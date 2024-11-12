# Upgrade from Postgres v10 to v14

#plantrail/database


## Logon to database postgres
`CREATE ROLE sw_super WITH LOGIN CREATEDB CREATEROLE PASSWORD 'superpw' SUPERUSER;`
`CREATE DATABASE plantrail WITH OWNER sw_super;`

`CREATE ROLE datadog;`
`CREATE ROLE sw_super;`
`CREATE ROLE sw_main;`
`CREATE ROLE sw_app_api;`
`CREATE ROLE sw_admin_api;`
`--CREATE ROLE sw_api;`
`CREATE ROLE sw_log;`
`CREATE ROLE sw_read_only;`
`CREATE ROLE sw_auth;`
`CREATE ROLE sw_listener;`

`ALTER ROLE sw_main WITH LOGIN PASSWORD 'mainpw';`
`ALTER ROLE sw_app_api WITH LOGIN PASSWORD 'appapipw';`

## Logon to database plantrail
  `  GRANT ALL ON ALL TABLES IN SCHEMA log TO sw_main;`
`    GRANT ALL ON ALL TABLES IN SCHEMA main TO sw_main;`

`    GRANT ALL ON ALL TABLES IN SCHEMA app_api TO sw_app_api;`
`    GRANT ALL ON ALL TABLES IN SCHEMA admin_api TO sw_admin_api;`
`    GRANT ALL ON ALL TABLES IN SCHEMA log TO sw_log;`

`    GRANT ALL ON ALL SEQUENCES IN SCHEMA main TO sw_main;`
`    GRANT ALL ON ALL SEQUENCES IN SCHEMA log TO sw_main;`
`    GRANT ALL ON ALL SEQUENCES IN SCHEMA app_api TO sw_app_api;`
`    GRANT ALL ON ALL SEQUENCES IN SCHEMA admin_api TO sw_admin_api;`
`    GRANT ALL ON ALL SEQUENCES IN SCHEMA log TO sw_log;`

`    --sw_read_only, seclect on tables`
`    GRANT SELECT ON ALL TABLES IN SCHEMA main TO sw_read_only;`
`    GRANT SELECT ON ALL TABLES IN SCHEMA app_api TO sw_read_only;`
`    GRANT SELECT ON ALL TABLES IN SCHEMA admin_api TO sw_read_only;`
`    GRANT SELECT ON ALL TABLES IN SCHEMA log TO sw_read_only;`

`    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app_api TO sw_super;`
`    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app_api TO sw_app_api;`
`    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA admin_api TO sw_admin_api;`
`    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO sw_auth;`
`    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA main TO sw_main;`

`    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA log TO sw_log;`
`    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA log TO sw_main;`
