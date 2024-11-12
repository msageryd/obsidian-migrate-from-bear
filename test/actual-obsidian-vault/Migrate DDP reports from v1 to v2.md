# Migrate DDP reports from v1 to v2

#plantrail/reports


New report structure as per 2024-05-29

report.version was bumped from null (column did not exist) to 2 by migration script. New reports after the migration gets null for version, as there is no version in report_type yet.

## Backup
Report tables were backed up before the migration.

``` sql
select  into report_bak_2024_05_13 from report;
select  into report_section_bak_2024_05_13 from report_section;
select  into report_component_bak_2024_05_13 from report_component;

```

## Migration scripts
``` SQL
CREATE OR REPLACE FUNCTION main.migrate_report_2024(_report_guid uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  _result jsonb;
  _intro_text text;
  _header_fields jsonb;
  _cover_page jsonb;
  _append_blueprints bool;
  _properties jsonb;
  _intro_section_guid uuid;
  _intro_component_guid uuid;
  _old_intro_component_guid uuid;
  _current_version smallint;
  _default_distr jsonb;
  _report_type_code text;
BEGIN
  --Check need for migration
  SELECT version, report_type_code 
  INTO _current_version, _report_type_code
  FROM main.report
  WHERE guid = _report_guid;

  IF _current_version = 2 THEN 
    RETURN jsonb_build_object(
      'status', 'Report already migrated to v2',
      'reportGuid', _report_guid
    ); 
  END IF;

  --Header fields
  select properties 
  into _header_fields
  from main.report_component 
  where section_guid in (
    select guid
    from report_section 
    where report_guid = _report_guid
    and section_type_id IN (10, 30)
  )
  and component_layout_id = 17003;

  --Intro text
  select content, guid
  into _intro_text, _old_intro_component_guid
  from report_component 
  where section_guid in (
    select guid
    from report_section 
    where report_guid = _report_guid
    and section_type_id = 10
  )
  and component_layout_id = 1002;


  --Cover page settings
  select properties 
  into _cover_page
  from report_component 
  where section_guid in (
    select guid
    from report_section 
    where report_guid = _report_guid
    and section_type_id IN (10, 30)
  )
  and component_layout_id = 17002;

  IF _cover_page IS NOT NULL THEN
    _cover_page = jsonb_set(_cover_page, '{isPrepend}', to_jsonb(true), true);
  END IF;

  --Append blueprints?
  select 
    case 
      when section_guid is not null then true 
      else false 
    end as append_blueprints
  into _append_blueprints
  from report_component 
  where section_guid in (
    select guid
    from report_section 
    where report_guid = _report_guid
    and section_type_id IN (10, 30)
  )
  and component_layout_id = 13001;

  _header_fields = jsonb_strip_nulls(
    jsonb_build_object(
      'left1', _header_fields->>'headerLeft1',
      'left2', _header_fields->>'headerLeft2',
      'left3', _header_fields->>'headerLeft3',
      'right1', _header_fields->>'headerRight1',
      'right2', _header_fields->>'headerRight2',
      'right3', _header_fields->>'headerRight3'
    )
  );

 
  _result = jsonb_strip_nulls(
    jsonb_build_object(
      'blueprint', jsonb_strip_nulls(jsonb_build_object('isAppend', _append_blueprints)),
      'coverPage', _cover_page,
      'pageHeader', _header_fields,
      'introText', _intro_text
    )
  );


  IF _report_type_code = '501.5' THEN
    _default_distr = jsonb_build_object(      
      'subject', 'Brandskyddsbesiktning {{Project.Name [1201]}} {{Report.Identifier [2203]}} från {{User.name [2101]}} på {{Company.Name [1101]}}',
      'fileName', '{{Projekt.Namn [1201]}}, Brandskyddsbesiktning {{Report.Identifier [2203]}}'
    );
  END IF;

  IF _report_type_code = '501.4' THEN
    _default_distr = jsonb_build_object(   
      'subject', 'Byggledar-protokoll {{Project.Name [1201]}} {{Report.Identifier [2203]}} från {{User.name [2101]}} på {{Company.Name [1101]}}',
      'fileName', '{{Projekt.Namn [1201]}}, Byggledar-protokoll {{Report.Identifier [2203]}}'
    );
  END IF;

  IF _report_type_code = '501.3' THEN
    _default_distr = jsonb_build_object(
      'subject', '{{Project.Name [1201]}}, entreprenadbesiktning utförd av {{User.name [2101]}} på {{Company.Name [1101]}}, id {{Report.Identifier [2203]}}',
      'fileName', '{{Projekt.Namn [1201]}}, Entreprenadbesiktning {{Report.Identifier [2203]}}'
    );
  END IF;


  _properties = jsonb_strip_nulls(
    jsonb_build_object(
      'blueprint', jsonb_strip_nulls(jsonb_build_object('isAppend', _append_blueprints)),
      'coverPage', _cover_page,
      'pageHeader', _header_fields,
      'reportDistribution', _default_distr
    )
  );

  UPDATE main.report 
  SET properties = COALESCE(properties, '{}')||_properties, version = 2
  WHERE guid = _report_guid;

  IF _intro_text IS NOT NULL THEN 
    _intro_section_guid = pgcrypto.gen_random_uuid();
    _intro_component_guid = pgcrypto.gen_random_uuid();

    INSERT INTO main.report_section 
    (guid, report_guid, title, sort_order, indentation_level, is_exclude_from_numbering, is_hide_title, section_type_id)
    VALUES 
    (_intro_section_guid, _report_guid, 'Inledning', -1, 0, true, true, 20);

    INSERT INTO main.report_component 
    (guid, section_guid, component_layout_id, sort_order, content, component_config_id) 
    VALUES 
    (_intro_component_guid, _intro_section_guid, 1001, 0, _intro_text, 1001);

    --Move any file_refs, i.e. embedded files in the old intro-component
    UPDATE main.report_component_file_ref
    SET report_component_guid = _intro_component_guid
    WHERE report_component_guid = _old_intro_component_guid;
  END IF;

  --cascade delete the deprecated sections
  UPDATE main.report_section 
  SET deleted_at = now()
  WHERE section_type_id IN (10,30) 
  AND deleted_at is NULL
  AND report_guid = _report_guid;

  PERFORM main.update_report_section_paragraph_numbers(_report_guid);
 
  return _result;
END;
$function$;
```


``` SQL
CREATE OR REPLACE FUNCTION main.migrate_reports_2024(_report_status_id int, _limit int)
 RETURNS integer
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
  _reports CURSOR FOR
    SELECT guid
    FROM main.report
    WHERE report_type_id = 501
    AND report_status_id = _report_status_id
    AND COALESCE(version, 0) <> 2
    ORDER BY created_at
    LIMIT _limit;

  _report_guid uuid;
  _count int = 0;
BEGIN
  OPEN _reports;

  LOOP
    FETCH _reports INTO _report_guid;
    EXIT WHEN NOT FOUND;

    PERFORM main.migrate_report_2024(_report_guid);
    RAISE NOTICE '%', _count;
    _count = _count + 1;
  END LOOP;
  CLOSE _reports;

  RETURN _count;
END;
$function$;
```
