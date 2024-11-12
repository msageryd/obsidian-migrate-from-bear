# Backend updates for "Portal"
#plantrail/portals

## Token encode/decode
- [x] Add JWT-type to database
- [x] Add JWT-types to const-sdk
- [x] Add token-create-funktion to security-sdk
- [x] Add tests for new token function

## API, portal: /portal
- [x] get: Get portal data
- [x] post: portal/send-link

## API, app: /app/portals
- [x] get: get portals
- [x] post: upsert portal
- [x] delete: remove portal
- [x] /reports post: add report to portal
- [x] /reports delete: remove report from portal
- [ ] Update API-documentation

## Database
- [x] get_portals
- [x] upsert_portal()
- [x] remove_portalI()
- [x] add_portal_report()
- [x] remove_portal_report()
- [x] get_report_data_portal_v1()
- [x] get_portal_data_v1()
- [x] tr_portal_child_modified
- [x] tr_notify
- [x] get_portal_users
- [x] get_portals_deleted

