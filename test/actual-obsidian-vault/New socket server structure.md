# New socket server structure

#plantrail/database

## Background
The current socket server has some short comings and quite messy code. We need to add new functionality to the socket server and in the process refresh the code base.

## New functionality
- [ ] DDP subscriptions
- [x] Queue based messaging with ack from client to clear item from queue

## Structure
We will keep the current structure, which is based a Map hierarchy with userAccounts at root level.

The current structure:

```
	clients
    userAccount (map)
      device (map)
        connection (web socket connection)
        subscriptions (map)
        id, tokenId, etc
```

The proposed new structure:
```
clients
  userAccount (Map)
    device (Map)
      connection (js object)
      deltaSubscriptions (map)
      ddpSubscriptions (map)
      id, tokenId, etc

messageQueue (Map)
  {device, message, status}
  {device, message, status}
  
```

`deltaSubscriptions` is a new name for the former “subscriptions” to differentiate from ddpSubscriptions.

`messageQueueItem.status` is a place for handling retry intervals etc.


## Message queue
The message queue need to handle retries as well as checking for device.connection.isAlive and device.tokenExpiresAt

An acknowledge message type will be implemented so the client can acc each message. After acc the message will be removed from the queue. For speedy lookup in the queue we will use Map to build the queue. We can use Map as a queue since it’s both iterable and has direct lookup.

Queue handler iterates the queue repeatedly. Trigger for queue-iteration could be:
- [x] new message arrives
- [x] youngest retry timestamp has passed

### Alternative solution
Each device could have a local queue of its own. Retries could be scheduled with setTimeout. A queue handler would not be needed, but a cleanup concept is needed so there will be no orphan setTimeouts if a device is removed.