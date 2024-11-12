# DDP notifications and middle layer filtering

#plantrail/database

## Background
DDP is our very flexible data selection engine. Many different dataset types are defined and advanced filtering can be applied to the datasets.

One DDP (Dynamic Data Package) consists of one or more datasets. Each dataset is delivered as a sub property in the ddp json. The dataset properties has the same name as dataset.

Ex: 
```
	ddp = {
    controlpoints: [],
    controlpointShapes: {}
  }
```

DDPs are currently used in “ddp reports” and the project portal. We want to extend the use to include dashboard widgets in the web app.

## Smart live updates
In order to build great dashboards we need live data. Live data means web socket communication, but we need to be conservative with updates, hence web socket messages should only be dispatched when really needed.

In order to find out if a web socket message is needed we need to process each applied ddp-filter on each relevant dataset. We do not want to hit the database for every filter-check, so the filters need to be processed in the middle-layer, i.e. the socket server.

## DDP Subscriptions
The socket server needs to keep a list of active ddp-subscriptions. One subscription must be registered for each DDP. In simple use cases, i.e. one single widget, the DDP might consist of only one dataset.

- [ ] Every dataset has a specification of which database tables might affect the dataset. This spec is stored in the database, so the socket server needs to load this spec upon startup and reload whenever the spec is updated.

- [ ] Whenever an insert/update/delete is performed on a table the socket server gets notified via pg_notify. The notification includes the table name and various other fields from the database record. The socket server needs to check if any active subscription has to do this table. This lookup is performed via the table spec for each dataset.

- [ ] If the table name matches a dataset, the socket server goes on and processes the filter definitions specified in the subscription.

- [ ] If the database record in the notification message passes the filter we know that the client needs to refresh this dataset. A socket message is sent to the client with instructions on which dataset should be refreshed.

- [ ] The dependent-table definition in ddp_dataset_table_dependency should maybe auto-register a ddp-trigger on each table.

- [ ] ddp subscriptions could maybe be registered for different use-cases: reports, portals, dashboards. The sub itself should look the same for every type, but the registration interface could take any of the three formats.

### Caveats 
Some DDP filters are quite advanced and won’t be easily processed on the socket server without some extensive data caching. These filters will be implemented later and will probably involve som querying of the database.25096

