# Web-app dashboards
#plantrail/webapp

## Background
The web-app has two unused spaces on screen, which could be filled with usable information. One space is the “global space”, i.e. no project is active. The other space is the “project space”, i.e. it belongs to the currently active project.

We will call those spaces:
- global dashboard
- project dashboard

## Relevant information
It’s very important that we only put relevant information on the dashboards. Failing to do so has implications:
- our users will get confused
- the dashboard will be less usable and maybe not used
- we put our servers to work for fetching irrelevant data
- dashboards will be filled up and possibly take valuable space from relevant data

Different clients will have different views on what is relevant data. In the future we should probably make the dashboards dynamic so the client can design the information via widgets.

A simple rule to decide if data is relevant, might be “Is the data actionable”? I.e. if the user sees some specific data point, would this lead to an action? Action being for example, send out personell to a project to fix a problem, or have a talk with some person about low productivity.

## Interaction with dashboard data
Some of the information on our dashboards will probably be about the same as in some menus. When suitable, we should let the data be clickable and act as if they were menu choices.

Examples:
- A project list on the global dashboard might have clickable project names. Clicking on a project name would be the same as selecting a project in the “Open project” dialogue.
- A list of users might be clickable and open up a dialogue with settings for this user, but only if the logged in user has the correct permission to do this.
## Synching data
When data is presented on a dashboard it should probably be live data, or at least updated automatically in a set interval. Depending on the nature of the data we might be able to implement socket updates for live data.

When widgets are implemented, each widget could possibly have a separate update scheme. Some widgets will rely on data which is synced anyways and data will be readily available in Zustand. Other widgets might have socket subscriptions of their own for live updates, and some more complicated widgets might have an update interval for fetching new data periodically.

## Global dashboard
Here are some idéas for widgets on the global dashboard:

### List of users 
A list of users with relevant information, such as:
- days since last activity in PlanTrail
- roles (this might be a long list, maybe not suitable for a compact format)

Since users can have cross company access rights, users in a company might not always be employees. The logged in user should only be able to see users who belong to companies in which the logged din user has the right to enlist users.

Example:
Company C1 invites user U11 to work in their projects
The following users are associated with company C1
U1: The boss of C1
U2: An employee in C1
U3: An employee in C2

User U1 does not have “enlist user accounts” permission on company C2, hence the users presented on the dashboard will only be U1 and U2.

### Obstacle list
A list of obstacles in all projects. This would be about the same list as we include in the weekly statistics email to our clients.

Collecting obstacles from all projects can be a demanding operation, which we don’t want to do too often.

### Last active projects
> Low hanging fruit

The last X active project would probably be very useful.
Information for this widget is already available and automatically updated via sockets in Zustand.

### Report delivery problems
This information is available in the report archive in each project. With a large amount of project it’s not an easy task to keep track of delivery problems.

The list might show the following information:
- Report name (clickable to download report)
- recipient email
- email problem (bounced, deferred)
- Project name. (clickable for opening up the project)

## Project dashboard
Here are some idéas for widgets on the global dashboard:

### 