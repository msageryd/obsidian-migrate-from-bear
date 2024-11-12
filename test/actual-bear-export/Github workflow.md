# Github workflow

#plantrail/wiki

## Github workflow for the web-app repo

### Master and develop branches
The web-app has two important git branches; **master** and **develop**. 

**Master** is the source for pushing new sites to **staging** (app.staging.plantrail.com) and **production** (app.plantrail.com). 

**Develop** is where all PR’s will be merged from task specific branches. When a new site is released, the develop branch should be merged into master.

Before pushing a new site to production, the exact same site must be pushed to staging. After verifying that the staging site works as intended, the same site should be pushed to production, i.e. no merge into master is allowed between a staging- and a production push.

### Development tasks
During development a new task-specific bransch will be created for each task. The bransch should be named so it clearly identifies its purpose. 

The developer responsible for a task specific bransch will create a PR for merging into the develop branch. The PR should be reviewed by one other developer before merging into develop.

After merging a task specific branch into the develop branch, the task specific branch should be deleted from origin. Each developer is responsible for deleting the local branch to keep the bransch list tidy, even locally.

### Linear tasks
If a task specific branch is regarding a specific issue in Linear, the bransch should be named by the Linear id, e.g. “RW-67”.