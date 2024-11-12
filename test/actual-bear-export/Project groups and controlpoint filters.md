# Project groups and controlpoint filters

#plantrail/roles #plantrail/projects

## Background
### Project groups
Currently some of our clients have very long project lists with several hundred projects. To aid searching in the list we have a search function and a simple favourites list.

We need more flexibility in grouping projects for several reasons. Project groups could make it possible for users to get better overview in large project lists. Project groups would also make it possible to more easily grant roles with more granularity than “company roles” and less tedious than “project roles”.

### Controlpoint filters
The need for more granular access rights arises when inspectors invite contractors to resolve problems. Currently the only means to filter access to specific controlpoints within a project is via project layers. Project layers are included in our core ACL system.

We want to invite a contractor to a project with a specific role, e.g. “EB contractor, 11062”, which gives the contractor access to the “yellow hammer” on all EB controlpoints in the project or in specified layers. On top of this invitation we want to associate filters, preferably quite flexible filters. 

E.g.
Contractor A is granted role 111062 on project X with the associated controlpoint filter [controlpoint.category = 32221], where 32221 might be for example “Painting”.

#### Access levels and “magic links”
In order to give easy access to the todo-portal we could define different access levels for an account. Eg.
Level 9: Full PlanTrail access, the account needs to be validated and be password protected
Level 1: Only Todo-list access. Login with email + “magic link”

Level 1-accounts could actually be auto-created based on the email address we acquire when we issue the magic link. Magic links are popular for simple login. A one-time-link is sent to the email supplied email address. If the user gets this email we can conclude that the email address is valid.

## Client cases
### B&B Malmö
Hampus has, for some time, wished for a better way to organise projects in the project list. They operate on several hospital areas where each building is treated as a separate project. Hence “By63” (building 63), can exist in more than one hospital. Although multiple projects cannot be named the same, so “By63” would actually be “Ystad Sjukhus By63” or “Lunds Universitetssjukhus, By63”, there is a risk of selecting the wrong By63 from the list.

Hampus wants to create project groups to aid selecting the correct project. He also want to create a portal for each group which can be presented to his client. The portal would enlist all project within the project group, allowing his client to go to one main portal to reach all of the projects from one place.

Hampus would for example like to create a group named “PEAB” where all his Peab project would be included. His contact at PEAB loves our PlanTrail reports and has asked Hampus for a PEAB portal instead of a bunch of separate project portals.

### PM
All PM employees have their roles granted on company level, i.e. they get inherited access to all PM projects. There are some sensitive projects which should not be accessed by everyone. Since we don’t have support for excluding roles nor support for project groups as of now, these sensitive projects has been created under a completely different “PM” company to which only a few users have access.

### Inspector
Controlpoints of type EB are created in a project. The inspector has created categories to categorise each controlpoint, e.g. “painting”, “electricity”.

In the controlpoint grid in our web-app, the inspector filters for category “painting” and filters for “identifier >= 400”. The filtered grid is then shared as a “todo-list” with the painter firm or painter person. When the list is shared an underlaying invitation is created. The invitation includes granting role 111062 as well as the filter association. We can then safely open up the web-app, the mobile app or a special “todo-portal” for this user. Both the regular PlanTrail role and the filter will be applied to all data delivered to this user.

## Current grouping solutions
Currently we have three “groups” in the project list, “Favourites”, “Active”, “Inactive”. These groups are purely organisational and have no access rights associated with them.

**Favourites** is a private group for each user, i.e. every user has their own favourites list.

**Active** represents all active projects, including any projects in favourite lists.

**Inactive** represents projects which have been deactivated by the user. Inactive projects does not show up in any of the other groups (favourites or active).

These three groups are presented in the app UI as tabs, i.e. three clickable areas above the project list.

## Solution check list
A grouping solution should aim to solve all of the below:
- [ ] User can create as many groups as needed
- [ ] A project can be included in one or more groups
- [ ] The former concept “company roles” will be transfered to being “project group roles” on an automatic group called “all projects”.
- [ ] The favourites concept will be preserved, but presented as a group (although it is a private group to each user)
- [ ] Access rights can be assigned to project groups and automatically trickle down to included projects
- [ ] Project groups can have an “exclusive ACL” setting to prevent access rights from being inherited from the group “all projects”.
- [ ] Groups will be presented above the project list as a horizontally scrollable icon list
- [ ] Groups can have properties of their own, such as name, description, thumbnail, etc
- [ ] Portals can be created for groups. These will show a list with links to each individual project portal.
- [ ] The web app needs to present the project groups above project lists so the user can “filter” the list by selecting groups.
- [ ] The web app needs functionality to administer project groups, i.e. add/remove projects from groups
- [ ] The mobile app needs the same functionality as the web app.

## Transitioning to a new solution
The new solution should be built in a transparent way, i.e. current users should not notice any big difference. Users get used to a work flow and we should not disrupt these without letting the user in on the decision.

### Transparency solutions
- [ ] All projects will get three groups, “Favourites”, “Active”, “and “Inactive”. I.e. no change from start
- [ ] Groups will be presented as icons instead of tabs. This is a small change for the greater good.
- [ ] The ACL engine will be rebuilt to operate on project groups instead of company-level.
- [ ] Current company roles will be transfered to the automatic “Active” group, i.e. no net change for the user

### MVP
We don’t need to go all in on the solution check list before shipping something to our users. Here is a proposal for an MVP:
- Create database structure and socket sync handling for project groups
- Restructure ACL calculations to take into account the new project roles
- Switch from tabs to icon list in the group selector in the mobile app
- Make a similar switch in the Web app UI
- Manually setup groups for clients in dire need of groups

I.e wait with the following functionality:
- Ability for user to administer project groups
- Portals
- ACL exclusion (this might be quite easy to achieve, in which case it can go on the MVP list)

## ACL calculations
When it comes to project roles, an ACL calculation leads to created or removed records in the tables project_acl and project_layer_acl. These records stems from granted roles on either company, project or project_layer.

Most commonly roles are granted on company level.

Triggers for ACL calculations can be newly granted or revoked roles or a newly created project. This trigger will have to change behaviour to fit project groups.

ACL triggers for project groups:
- new user
- granted role on projectGroup
- revoked role on projectGroup

N.B. A user can have different granted roles for the same project from several projectGroups. We need to calculate the net of these roles for each project.

Example roles for a single user:
#### Group: Active projects
Included projects: 1,2,3
Granted roles: A, B

#### Group: Special projects
Included projects: 3
Granted roles: B, C

**Group: Sensitive projects**
NO-ACL-INHERITANCE
Included projects: 2
Granted roles: -none-

The net roles for project 3 in this example will be A, B, C
The user will not have access to project 2, since this project is included in the “Sensitive” group.

The NO-ACL-INHERITANCE flag must operate over all groups. I.e. even if a user have specific access to group A, a project which is also included in group B (no-inheritance), will not be visible at all.

## Domain structure
Currently, the project structure is strictly hierarchical, i.e. 
- a project belongs to one company
- a layer belongs to a project
- a drawing belongs to a project
- a controlpoint belongs to a drawing
- a journalItem belong to a controlpoint
- other stuff belongs to a journalItem (images, tags, etc)

This hirerarchy structure is utilised in ACL calculations for role inheritance. If a role is inheritable, this role will trickle down from company to project to projectLayer. I.e. if a user has the right to create a specific controlpointType at company level, this role will also be applied to all layers within all projects in this company.

![](Project%20groups%20and%20controlpoint%20filters/image.png)<!-- {"width":328} -->

Project groups belong to a company, but there is no strict hierarchy between projects and project groups.
- a project can belong to one or more project groups
- different roles can be granted to different projectGroups
- the sum of all projectGroup-roles should be applied to included projects and project layers

Example:
company A has:
- three projects, P1, P2 and P3.
- two projectGroups, G1 and G2
- G1 includes P1 and P2
- G2 includes P2 and P3
- User X has role R1 in group G1
- User X has role R2 in Group G2

Effectively this will give the following roles at project level
- P1: R1 (since P1 is included in G1 where R1 is granted)
- P2: R1 and R2 (since P2 is included in both G1 and G2, where R1 and R2 is granted respectively)

![](Project%20groups%20and%20controlpoint%20filters/image%202.png)

### Exclusive ACL
We need a concept for securing sensitive projects. The purpose is to prohibit inherited roles to reach certain projects.

Example:
User **Y** has Role **R1** at company level for Company **A**. This is actually the usual scenario at our clients. This means that Y will get R1 on every project under Company A.

If some projects need to be excluded from this inherited roles, our only option today is to not grant company roles and instead grant individual roles to all projects but omit the sensitive projects. This is very tedious when there are many projects (some of our clients has more that 100 projects).

Our new concept “**exclusive ACL**” solves this. The exclusiveACL flag means that no inherited ACL can reach the object. The exclusiveACL flag can be applied to individual projects or projectGroups.

In the sketch below, Project P5 has exclusiveACL. The only user with a role granted directly on P5 is user Z. Both User X and user Y would have had access to project P5 via role inheritance, but P5 is immune to inherited roles, so User Z is the only user with access to P5.

In the same below sketch, group G1 has exclusiveACL=true. All projects in group G1 will be immune to inherited roles from company level. I.e. Only User X will have access to P1 and P2. Even if a user has a role granted on group G2 (which includes project P2), this user would not be able to access P2. As soon as a project resides in one or more exclusiveACL groups, the only way to get access to them is by being granted roles in one of these groups.

User U is granted R1 on group G2. G2 includes P2, P3, P4 and P5, but only P3 and P4 will be visible to User U due to the exclusiveACL flags on P2 and P5. P5 has an explicit exclusiveACL and P2 has implicit exclusiveACL via group G1.


![](Project%20groups%20and%20controlpoint%20filters/image%203.png)
### ExclusiveACL precedence
Having exclusiveACL=true on a project will always precede any membership in exclusiveACL groups.

In the example above, P5 resides in group G2. Even if G2 would have exclusiveACL=true, project P5 would not be accessible to User U, since project level exclusiveACL always trumps group level exclusiveACL.

### Summary on inheritance logic

- Roles granted on company level will trickle down to all normal projectGroups, projects and projectLayers within the company, but not to exclusiveACL projects or projectGroups.
- Roles granted on projectGroup-level will trickle down to all normal projects and projectLayers within this group, but not to projects with exclusiveACL=true.
- Roles granted directly to a project will always be active and also trickle down to all layers within the project.
- Roles granted directly to a specific layer within a project will always be active, even if the project has exclusiveACL=true. This special treatment gives us the opportunity to have a “secure” project with no inherited roles from above, but still being able to grant access to a specific layer “below”.

### Triggers and scope for ACL calculations
Many different events can trigger ACL calculations. The calculation requests will be queued and processed by a worker server in all but one case, creating a new project. When a new project is created the user needs to get access to this project directly, i.e. we don’t have time to wait for a queued calculation.

All ACL calculations are performed ona a per user basis. If a triggering event will affect more than oneusers, a separate item will be queued for each user in acl_queue.

#### **Roles**
Updates in roles will often have a great impact on ACL calculations since nearly all users will be affected. Role updates should be performed at low traffic hours if possible.

All role updates are handled by a single tigger `tr_role__queue_acl` connected to all relevant tables
- AFTER INSERT OR DELETE ON main.role_controlpoint_type
- AFTER INSERT OR DELETE ON main.role_journal_item_type
- AFTER INSERT OR DELETE ON main.role_report_type
- AFTER INSERT OR DELETE ON main.role_inspection_type
- AFTER INSERT OR DELETE ON main.role_permission
- AFTER INSERT OR DELETE ON main.role_grant_role

The trigger function will queue ACL-items for every granted role on every level, i.e. company, project and projectLayer-level
- [ ] TODO: projectGroup roles will need attention

#### **Companies**

#### Create new company
`create_company` will add a role to user_account__role__company

#### Granted or revoked company roles
--AFTER INSERT OR DELETE ON main.user_account__role__company
CREATE OR REPLACE FUNCTION main.tr_user_account__role__company__queue_acl()

#### **Projects**
##### Creating a new project
1. The creating user will get ACL directly from an `acl_calc()` call in `upsert_project()`
2. All other users connected to the company will have their ACL queued via `tr_project__queue_acl_for_new_project`

##### Updating an existing project
Currently no ACL calculations are performed.
- [ ] We need to handle the case when an exclusive_acl is changed for a project

##### Deleting a project
No ACL calculations are needed when a project is deleted. The deletion will be communicated to the clients and the clients will remove the project from local state. The deleted project will not be included in any requests moving forward, so there is no harm in letting some ACLs for the project linger in `project_acl`.

The next time an ACL is calculated for any related user, the deleted project will be removed from ACL.

#### Granted or revoked project roles
tr_user_account__role__project__queue_acl is triggered AFTER INSERT OR DELETE ON main.user_account__role__project.

ACL filter: projectId

#### **Project layers**
##### Creating a new project layer
- [ ] TODO: The creating user will get ACL directly from an `acl_calc()` call in `upsert_project_layer()`
- All other users connected to the project will have their ACL queued via `tr_project_layer__queue_acl_for_new_layer`

##### Updating an existing project layer
Currently no need for ACL calculations.

##### Deleting a project layer
No ACL calculations are needed when a project layer is deleted. The deletion will be communicated to the clients and the clients will remove the layer from local state. The deleted layer will not be included in any requests moving forward, so there is no harm in letting some ACLs for the project linger in `project_layer_acl`.

The next time an ACL is calculated for any related user, the deleted project_layer will be removed from ACL.

#### Granting or revoking projectLayer roles
--AFTER INSERT OR DELETE ON main.user_account__role__project_layer
CREATE OR REPLACE FUNCTION main.tr_user_account__role__project_layer__queue_acl()

#### Project Groups
When ACL is calculated based on events in projectGroups, we can never filter on projectGroup. ACL always needs the complete picture for each project. If a project resides in more than one group all granted roles must be processed. At the end of the ACL calc all roles not included in the calculated rule set will be removed from ACL. I projectGroup filtering would be applied we could miss roles from other group which would result in  lost roles.

- [ ] Adding a project to a group should trigger ACL-calc for all users on this project
  - could we filter on projectGroup? NO, Projects always needs to be handled completely. Filtering on projectGroup might lead to misses in revoked roles.
- [ ] Removing a project from a group should trigger ACL-calc for all users on this project
  - only this projectGroup? NO, se above.
- [ ] Altering exclusiveACL on a projectGroup should trigger ACL-calc for all users on all projects in this group, regardless of which group the project resides in. I.e. no projectGroup filtering can occur.
- [ ] Granting/Revoking a role for a user in a projectGroup should trigger ACL-calc for this user for all projects in the group
- [ ] Creating a new projectGroup should give the creating user admin role to the group
- [ ] Deleting a project should remove the project from all projectGroups

### ACL-calc

ACL calculation is performed in stages. The first stage is to generate the total effective roles for a user, maybe filtered on some object (project or company). This dataset is generated by the function `get_effective_roles`.

The effective roles dataset is left-joined with every role-detail table in order to expand the dataset to a gross list including permissions, controlpointTypes, journalItemTypes, reportTypes, etc.

The gross dataset is sent to domain specific acl_calc_xx functions. Each of these functions 