# Client synchronisation

#plantrail/api

## Background
Synchronising data between server and client in a timely and efficient manner is key to a great user experience.

To aid this experience PlanTrail uses both socket- and http communication. The socket communication is currently used only as a trigger for the client to initiate a data fetch via http. In the future we might use sockets as a data bearer for simple data where http is overkill.

### Goal
We want to implement a synchronisation scheme which accomplishes the following:
- Client should be updated in near real time (i.e. within seconds) when data is updated at the server
- Socket messages should only be sent to clients which are affected by the updated data, i.e.:
  - only logged in clients (i.e. needs an open socked channel)
  - only clients which are logged in with a user whom has access to the updated data
  - only clients which subscribe to this particular update if the resource is subscription based
  - all logged in clients with ACL to a resource if the resource is marked as “autosubscription”, i.e. mostly system metadata,
- Client should be able to fetch all updates since the last fetch
- Client should be able to add an exception list to the fetch call in order to omit it’s own updates. I.e:
  - client A updates a project name for project X
  - the new name is saved to the server
  - the server sends out socket messages so clients can fetch the updated data
  - when client A requests updated projects, project X should be omitted since this update  origins at client A
## Domains
In order to separate different resources at the server, all “syncable” resources belong to a sync-domain. Example of sync-domains:
- project
- company
- drawing
- controlpoint

When a socket message is sent to the clients, the affected sync-domain is included in the message. The domain tells the client which particular resource is in need of synchronisation so the client can request the updated data for the affected domain.

### controlpointEvent
- [ ] should migrate to function .._complete

### companies
- [ ] should migrate to function .._complete
### journalItemTypes
- [ ] should migrate to function .._complete
### deviationTypes
- [ ] should migrate to function .._complete
### controlpointCategories
- [ ] should migrate to function .._complete
### controlpointTypes
- [ ] should migrate to function .._complete
### controlpointLevels
- [ ] function `get_controlpoint_levels`

## Modification dates everywhere
All resources in the database has a timestamp called `modified_at`. This timestamp is automatically updated when the resource or related resources are updated. “Related resources” are often detail data in a master-detail relation.

Example:
If the distribution log is updated for a report, i.e. a report is sent by email, the modified_at timestamp is updated in the actual report. 

All timestamps are calculated by the database itself, i.e. not by the client. This concept ensures that all timestamp comparisons are performed with the same “clock” as base. If the client would generate a timestamp, this timestamp would most certainly not be the exact same as a database generated timestamp.

The `modifiedAt` *(camelCase in Javascript, snake_case in the database)*  timestamp is included in the response data when a client requests a resource.

A modifiedAt timestamp is also included in the response when a client updates a resource via http.

## Fetching updated data and nothing else
When a client requests a resource, a `lastUpdateTime` parameter can be added in the http query. This timestamp is used in the database to select data which is updated since the last time the client fetched this resource. 

The client must keep track of `lastUpdateTime` so this can be used in the next request for data. Since data is requested on a per domain basis, the client must keep track of this timestamp for every domain.

To ensure that all parties are working with the same clock, the lastUupdateTime is provided by the server in the response for each data request.

Example:
1. Client A updates project X
2. the server recognise the update and finds that cluent B is logged in and has access rights to project X
3. socket messages is sent to both client A and B
4. client B requests all projects since the last time
5. the response to B includes project X as well as a new updateTime timestamp for B to store in local state

The above example clarifies another sync issue, which is elaborated on below, namely that client A also will get a socket message and will fetch the newly updated project, in spite the fact that this is the very same update which client A initiated.

## Excluding “own updates”
The client should keep track of a local state regarding synchronised resources. In order to keep the client UI snappy and even off-line-able, the client will probably make optimistic updates to the local state. If such an update will make the local state equal to the updated database, this client is not interested in fetching is’s “own update”.

In order to exclude own updates the client can send an exclusion list in the resource request. The list (an array) should include the key (id) for each item as well as the last known modifiedAt timestamp.
