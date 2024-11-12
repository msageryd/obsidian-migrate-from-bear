# Advisory locks while syncing items

#plantrail/sync

## Todo
Migrate to acquire_advisory_xact_lock in the following functions:
..or document the different use cases:
1. `PERFORM pg_advisory_xact_lock` in acl_calc
2. `PERFORM pg_advisory_try_xact_lock` in get_nnn_complete
3. `PERFORM pg_advisory_xact_lock` in get_ddp
4. `PERFORM main.acquire_advisory_xact_lock(_lock_type => 201)` in ensure_project_sequences

- [ ] get_ddp
- [ ] get_controlpoints_complete
- [ ] get_drawings_complete
- [ ] get_inbox_items_complete
- [ ] get_inspections_complete
- [ ] get_journal_items_complete
- [ ] get_projects2
- [ ] get_projects_complete
- [ ] get_report_sections_complete
- [ ] get_reports_complete


## Background
While fetching data from one of our sync endpoints, (i.e. /controlpoints, /drawings, /projects, etc) we take an advisory lock in the database to ensure that the same user does not fetch the same data twice, in parallell.

We need to use an identifier to take a unique lock. Sometimes the identifier needs to be composed from three numbers, for example lockType + userAccountId + drawingId.

The lockType is always a small number, for example 103 = controlpoint lock.
UserAccountId is probably the next smallest id, we won’t reach the end of INT for a long time when it comes to userAccountsIds.

Postgres `pg_try_advisory_xact_lock`  can only take two integers or one bigint as lock identifer. Our solution is to combine three numbers into one bigint by using 8 bits for lockType, 24 bits for userAccountId and a full integer (32 bits) for the itemId (i.e drawingId, projectId, etc) 


acl_calc:
  PERFORM pg_advisory_xact_lock(101, _user_account_id); --drawings
  PERFORM pg_advisory_xact_lock(102, _user_account_id); --projects
  PERFORM pg_advisory_xact_lock(103, _user_account_id); --controlpoints
  PERFORM pg_advisory_xact_lock(104, _user_account_id); --reports
  PERFORM pg_advisory_xact_lock(105, _user_account_id); --inspections
  PERFORM pg_advisory_xact_lock(106, _user_account_id); --journalItems
  PERFORM pg_advisory_xact_lock(107, _user_account_id); --inboxItems
  
  
get_ddp:
    PERFORM pg_advisory_xact_lock(101, _user_account_id); --drawings (no need to differentiate between lock types anymore)


other get_functions uses "try_advisory"
  get_controlpoints_complete
	get_drawings_complete
  get_inbox_items_complete
	get_inspections_complete
	get_journal_items_complete
	get_projects2
	get_projects_complete
	get_report_sections_complete
  get_reports_complete

composed lock ids when more granularity is needed:
  get_controlpoints_complete: _lock_key = main.compose_advisory_lock_key(103, _user_account_id, _drawing_id);

## acquire_advisory_xact_lock
We have centralized the handling of trying to take locks and retry until success. The function acquire_advisory_xact_lock also handles composing lock_type and user_account_id into one 32 bit value.

This is the call signature.
```sql 

main.acquire_advisory_xact_lock(
	_lock_type integer, 
	_user_account_id integer DEFAULT NULL::integer, 
	_aux_id integer DEFAULT NULL::integer, 
	_max_tries integer DEFAULT 100, 
	_sleep_interval double precision DEFAULT 0.1
)
```



## main.compose_advisory_lock_key
This is our compose-function

```sql
CREATE OR REPLACE FUNCTION main.compose_advisory_lock_key(
    lock_type INT,
    user_account_id INT,
    item_id INT
) RETURNS BIGINT AS $$
DECLARE
    composite_key BIGINT;
BEGIN
  /*
    The syntax for pg_try_advisory_xact_lock is either (int, int) or (bigint). Sometimes we need to use three arguments, for example:
    - lock_type = 103 (controlpointSync)
    - user_account_id = 1
    - drawing_id = 8202
    
    Since we know that lock_type is a very small number we can combine this with drawing_id to build a composite lock key.
  */

    -- Ensure lock_type is within valid range
    IF lock_type < 1 OR lock_type > 255 THEN
        RAISE EXCEPTION 'lock_type must be between 1 and 255';
    END IF;

    -- Ensure user_account_id is within valid range
    IF user_account_id < 0 OR user_account_id > 16777215 THEN
        RAISE EXCEPTION 'user_account_id must be between 0 and 16777215';
    END IF;

    -- Compose the key
    composite_key := (lock_type::BIGINT << 56) |  -- 8 bits for lock_type
                     (user_account_id::BIGINT << 32) |  -- 24 bits for user_account_id
                     (item_id & x'FFFFFFFF'::BIGINT);  -- 32 bits for item_id

    RETURN composite_key;
END;
$$ LANGUAGE plpgsql;

```

## Test
Bitwise operations are prune to errors and are quite hard to follow in code. Here is a test SQL to explain our compose function.

```sql
-- Test values
WITH test_values AS (
    SELECT 
        42 AS lock_type,
        12345 AS user_account_id,
        789012 AS drawing_id
),

-- Step-by-step calculations
calculations AS (
    SELECT
        lock_type,
        user_account_id,
        drawing_id,
        (lock_type::BIGINT << 56) AS lock_type_shifted,
        (user_account_id::BIGINT << 32) AS user_account_id_shifted,
        (drawing_id & x'FFFFFFFF'::BIGINT) AS drawing_id_masked,
        (lock_type::BIGINT << 56) | 
        (user_account_id::BIGINT << 32) | 
        (drawing_id & x'FFFFFFFF'::BIGINT) AS composite_key
    FROM test_values
)

-- Display results
SELECT
    lock_type,
    user_account_id,
    drawing_id,
    '0x' || to_hex(lock_type_shifted) AS lock_type_shifted_hex,
    '0x' || to_hex(user_account_id_shifted) AS user_account_id_shifted_hex,
    '0x' || to_hex(drawing_id_masked) AS drawing_id_masked_hex,
    '0x' || to_hex(composite_key) AS composite_key_hex,
    composite_key AS composite_key_decimal,
    -- Verify by extracting components
    (composite_key >> 56) & 255 AS extracted_lock_type,
    (composite_key >> 32) & 16777215 AS extracted_user_account_id,
    composite_key & x'FFFFFFFF'::BIGINT AS extracted_drawing_id
FROM calculations;

```
