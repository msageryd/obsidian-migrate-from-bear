# Invitations (modules & roles)
#plantrail/roles

- [ ] Invite by email (await registration)
- [ ] Invite by QR code
- [ ] Invite by "bump", i.e. NFC

## Todo
- [x] trim and small-caps invitation emails
- [x] DB structure
- [ ] Pre-invitation stage (1), awaiting email via qr etc
- [ ] Cc-email. I.e. Also inform other person when roles are granted
- [x] create_invitation()
- [x] confirm_invitation()
- [x] validate_invitation()
- [x] process_invitation()
- [x] update_invitation()
- [ ] invitations-sync?
  - [x] sync-domain
  - [ ] socket server
- [ ] Invitation email report design
  - [ ] Translate email subject
- [ ] Confirmation email report design
- [x] Queue worker for invitations
  - [x] get_next_queued_invitation()
  - [x] get_invitations()
  - [x] send invitation email
  - [x] send confirmation email
  - [x] process invitation
- [ ] Translations for emails
- [ ] API endpoints /invitation
  - [ ] POST -> create_invitation
  - [ ] POST ../{:id}/confirm -> confirm_invitation()
  - [ ] GET / -> get_invitations()
- [ ] Invitation processing (granting roles) should set primary company_id

## Invitation process

- inviter creates invitation
  - invitee email
  - roles or role template
  - is_await_confirmation
  - during editing status = 1
  - save
  - status = 2
  - if account already exists, go straight to status 4 (await confirmation) or 6 (no confirmation needed)
- worker picks up status 2 = send invitation email
  - inviter has invited you to project(s)/company(ies)
  - invitation templates should have specific phrases in locize
  - link to testflight attached
  - status = 3, awaiting account creation
- worker picks up status 4 if “await confirmation”
  - send confirmation email to inviter
  - Invitee “kjhkjh” has created a PlanTrail account and is awaiting permissions for the following: project x, …
  - confirm / reject buttons with links to /


### Status codes

| Code | Meaning                                                      |
|------|--------------------------------------------------------------|
|      |                                                              |
| 1    | Invitation created, queued for sending                       |
| 2    | Invitation sent, awaiting account creation                   |
| 3    | invitee account created, awaiting confirmation from inviter  |
| 5    | invitation confirmed by inviter, ready for processing        |
| 6    | invtee account created, ready for processing                 |
| 7    | invitation ready for processing since invitee account already exists |
|      |                                                              |
| 9    | finished processing invitation                               |
| -1   | Invitation cancelled by inviter                              |
| -2   | Invitation cancelled due to invitation timeout               |
| -3   | Invitation cancelled due to rejected confirmation            |
| -4   | Invitation cancelled due to confirmation timeout             |
| -7   | Invitation cancelled due to lacking invitee permissions      |

### Create invitation manually -> status 1 then 2
An invitation can include the following:
- company roles
- project roles
- layer roles
Only one invitation per inviter and invitee can be active. I.e. 
During creation, the invitation has **status = 1**, i.e. awaiting completion before sending off.

Status 1 is a way to save invitations during the specification. When the specification is completed the status should be set to 2.

If the invitee account already exists, status is set to 5 directly, i.e. no email invitation is sent.

### Create invitation via an invitation template -> status 2
Invitation templates makes it easy to create standardised invitations, such as “Invite entrepreneur to resolve EB deviations”.

Template based invitations gets **status=2** directly.

### Sending invitation -> 3 or 7
If the invitee account already exists, there will be no invitation email. Instead status will be moved to 7 directly.

When the invitation is fully created and marked with **status 2** (queue for sending to invitee) it will be handled by the worker and sent by email (or maybe SMS or bump).

**N.B.**
If the company associated with the invitation has a `testflight_invitation_link`, this link should be included in the invitation email.

### 3. Invitee installs the PlanTrail app and creates the account
When a new account is created, the worker checks if the account email is associated with an active invitation. Any active invitations are processed.

### 4. processing invitations
- invitation is validated (inviter’s permissions could have changed during invitation wait time)
  - does the inviter have right to add users to company?
  - does the inviter have right to grant the roles which are stated in the invitation?
- if inviter lacks permissions we should:
  - log the problem
  - alert PlanTrail admin
  - email the inviter
  - possibly email the invitee (maybe with some delay)
  - set invitation status to 
- account is added to the company in the invitation 
  `app_api.company_add_user()`
- add roles for company, project and layer
  `role_grant_on_company`
  `role_grant_on_project`
  `role_grant_on_layer`



## Invite by email
Invitation registered for a specific email address. When an account is created for this address, the invitation is materialised into roles and possibly module subscriptions.

### Use case
Project manager wants to add a new user to a specific project.
1. invite by email
2. add module subscriptions (i.e. inviter pays for the modules)
3. add project roles (or possibly company roles)

When invitee creates a PlanTrail account, the account is granted modules and roles in accordance with the invitation.

An email is sent to the inviter with information on subscribed modules and granted roles for the new user.

The new user should get a welcome email as well, but this is not necessarily tied to the invitation.

## Invite by QR or bump
If the invitee is nearby the inviter, the inviter can show a QR code in the app or use NFC to materialise the invitation directly from the app.

The invitee needs to install the PlanTrail app. Bumping and QR code reading should be implemented to work from the login screen.

