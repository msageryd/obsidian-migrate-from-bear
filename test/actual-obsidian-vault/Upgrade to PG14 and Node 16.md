# Upgrade to PG14 and Node 16

#plantrail/devops


## Database
- [x] Take new snapshot
- [x] Check for extension upgrades (all versions are current)

![[6119ED21-143C-48DA-AE3B-ACD79989865A.png]]

- [x] Check for unsupported datatype "unknown"

SELECT DISTINCT data_type FROM information_schema.columns WHERE data_type ILIKE 'unknown';

- [ ] Refresh statistics

`ANALYZE VERBOSE`




![[4AE9A5BD-0DB1-40C8-ADDC-BC931AE330E1.png]]