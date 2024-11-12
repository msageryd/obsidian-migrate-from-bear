# Appstore, todo

#plantrail/mobileApp

## Todo before AppStore publishing
### Invitations
Automatically add roles to an invited account. This reliefs Michael from doing this in real time on every new account.

### Test project
Every new account should be accompanied with an automatically created test project. Maybe under a company that is “the person”, i.e. a personal account, regardless of which companied the user is invited to.

### Project settings
Project settings should be handled from the app. The following are the most crucial.

- [ ] Which modules should be used in the project, i.e. which controlpointTypes, which reportTypes, etc. This is to avoid bloating the reportType list and the tool bar with stuff that is not being used.
- [ ] Project properties. Name, address, client, contractor, profile image, etc
- [ ] Maybe layer creation directly from the app

### Redux
It might take a long time for us to migrate from immutable.js. But some parts needs attention.

- [ ] Automatic store migration when new app versions alter the store structure
- [ ] Sync handling even after auto-logout, i.e. let the app keep syncing unsynced items even if the user is logged out.
- [ ] Each cleaning. Remove old stuff from Redux if not used for a long time

### Inactivate projects
Inactive projects needs to be handled more optimised.
- [ ] No ACL-calc for inactive projects
- [ ] Slimmed down sync for inactive projects
- [ ] A specific permission will be needed to re-activate inactive projects

### Live updates via code push
Code push would really help with upgrading apps on the fly.

### Version warnings in the app
When a version goes out of fashion, i.e. should not be used anymore, we need to help/force the user to upgrade.

### New name and owner
On appStore, we should use “PlanTrail” as app name and the organisation PlanTrail as owner. Currently the apps named FireSeal Pro and is owned by Sageryd Data.

