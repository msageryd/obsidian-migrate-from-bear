# Document uploads to projects and companies

#plantrail

## Background
We have need for functionality to upload documents for usage in various places.

Example usage:
- [x] insert document links in ddp reports
- [ ] add documents to control points via journal posts

Example of uploading documents
- [ ] email documents to the company inbox and move those to the appropriate project
- [x] upload documents directly from the “select document” dialog in the report-link component in a ddp report.

Usage of uploaded documents differ depending on the document type.
* zip files needs to be unzipped for access to individual documents
* pdf files might hold blueprints for blueprint import
* pdf files might be linked or merged into a ddp pdf report
* image files might be linked or embedded in ddp reports

## Concepts
### Files
Files are the underlaying concept for storing anything binary in PlanTrail. A files is defined in the database but the actual file is stored in S3.

### Specific usage
Most files has a dedicated usage in the system. Examples:
* logotype (image file connected to a company)
* journalItemPhoto (photo connected to a journalItem)
* blueprint file (jpg file extracted from a PDF and connected to a drawing)

### Inbox
Inbox will be an easy way for users to import files to PlanTrail. Since the intended usage is not clear from a plan email with attached files, the user needs to manually sort the incoming files and tell PlanTrail what they are intended for (blueprints, project documents, company documents, etc)

### Document
A  `document` is special type of file intended for linking or embedding into other places, probably mostly ddp reports.

### Blueprint
Blueprint is a specific usage of a file, but before the file is useful we need to:
1. Extract jpg images from PDFs
2. Apply metadata to the images (blueprint id, floorpan, dimensions, scale, etc)
3. Connect the blueprint image to a drawing (a blueprint can be reused in multiple drawings)


### 
## Access rights
Which document are visible to which user and which user can upload documents.

It’s not viable to have access rights on individual documents. Instead we need to group documents and assign rights to the groups. This is equivalent to access rights for `controlpointTypes`, i.e. we are not assigning right to individual controlpoints, but instead to “groups” or types as we call them.

What should we call the document groups?
* documentTypes
* documentSecurityType
* documentSecurityLevel (not a fan of this since this implies access to all levels below “my level”)


## Usage scope
Where can a document be used? This classification can help to present the correct documents in selection dialogs.

E.g. Insert document link in report -> list documents with scope company (the company owning the project) and list documents with scope project (the project owning the report)

## Uploads
### Upload whatever..
User uploads pdfs, images, zip files etc. Those will end up in the company inbox (zip files will first be extracted). From the inbox a user can transfer the files to:
* blueprint import
* company documents
* project documents


## WIP 2023-05-19
Idea.
1. getProjects will only return thumbnailFile (instead of all file_refs)
2. Same goes for get_companies
3. project_file_refs and company_file_refs are then used for all document libraries
4. report_component_file_ref is used for both embedded images and linked documents
5. Available documents will be fetched from company_file_ref and project_file_ref using calculated ACL as filter

- [x] rewrite get_projects to only include thumbnail in files array
- [x] rewrite get_companies to only include thumbnail in files array
- [ ] create acl_calc_file_archive
- [ ] create get_file_archive
- [x] create roles for file_access_type
- [x] create report_component_file_ref
- [x] add storage for file_access_type_id in project_file_ref and company_file_ref
- [ ] /uploads needs to handle company-files, project-files and report_component-files
- [ ] Fix file_archive_acl in transfer_project

* Do we need to separate company_file_ref_acl from project_file_ref_acl? How can we otherwise separate access to just company files from access to project files under a company (both projectId and companyId)



1. Upload file (main.file, S3)

uploadFileScopeId: 
	2	company -> intentId = 32
	3	project -> intentId = 32
	4	user -> intentId = 32
	5	ad-hoc. (Same as null, i.e. no specific file archive storage)

fileAccessTypeId: 
	1 = standard
	2 = restricted

fileUsageEntityType:
	report_component 

fileUsageIntentId: 
	34 = report component, embedded file
	35 = report component, linked file

fileUsageParentGuid:
fileUsageParentGuid:


- [ ] ad-hoc embedded image (intentId = 34)
- [ ] linked file (intentId = 35)
- [ ] company-archive (intentId = 32)
- [ ] project-archive (intentId = 32)
- [ ] availability (project or company)
- [ ] access-type (one of available access types)

3. Add file to archive (project_file_ref or company_file_ref)
4. Add file to report_component


```
DROP FUNCTION IF EXISTS app_api.get_projects(integer, timestamp with time zone);

CREATE OR REPLACE FUNCTION app_api.get_projects(_user_account_id integer, _last_updated timestamp with time zone)
 RETURNS TABLE(id integer, company_id integer, name character varying, project_state_id smallint, properties jsonb, thumbnail_file_guid uuid, files json, user_active_inspection_guid uuid, brand_filter integer[], product_filter integer[], is_project_container boolean, project_container_id integer, container_properties jsonb, drawing_groups jsonb, module_ids integer[], layers jsonb, controlpoint_types jsonb, template_mnemonic text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN

  IF NOT pg_try_advisory_xact_lock(102, _user_account_id) THEN
      RAISE EXCEPTION 'Could not acquire lock for user % on project table', _user_account_id USING ERRCODE = 'S3GA5'; --lock_not_available
  END IF;

  /*
    Return a list with layers granted to _user_Account_id
    - only projects which are modified after _last_update_time
    - OR projects which have newly created acl records (i.e. the user has been granter right to an old project)
    - AND the project is not deleted
  */
  RETURN QUERY

  SELECT
    p.id,
    p.company_id,
    p.name,
    p.project_state_id,
    p.properties,
    p.thumbnail_file_guid,
    _thumbnail.files AS files,
    us.active_inspection_guid as user_active_inspection_guid,
    brands.brand_filter,
    products.product_filter,
    p.is_project_container,
    p.project_container_id,
    --p.container_name::varchar,
    COALESCE(container.properties, NULL::jsonb) AS container_properties,
    drawing_groups.group_objects,
    project_module.module_ids,
    project_layers.layers,
    COALESCE(controlpoint_type.controlpoint_types, '{}'::jsonb) as controlpoint_types,
    pt.mnemonic as template_mnemonic

  FROM main.project p
  JOIN main.project_acl acl ON p.id = acl.project_id
  LEFT JOIN main.user_account__project us ON us.project_id = p.id AND us.user_account_id = _user_account_id
  LEFT JOIN main.project_template pt ON pt.id = p.template_id
  LEFT JOIN project container ON container.id = p.project_container_id

  LEFT JOIN LATERAL (
    SELECT
      array_to_json(
        array_agg(
          jsonb_build_object(
            'guid', f.guid, 
            'pixelWidth', f.pixel_width, 
            'pixelHeight', f.pixel_height, 
            'hasThumbnailFile', f.has_thumbnail_file, 
            'hasMediumResFile', f.has_medium_res_file, 
            'hasLowResFile', f.has_low_res_file, 
            'fileTypeId', f.file_type_id, 
            'languageCode', f.language_code
          ) 
        )
      ) AS files
    FROM main.file f
    WHERE f.guid = p.thumbnail_file_guid
  ) _thumbnail ON TRUE
  
  LEFT JOIN (
    SELECT
      b.project_id,
      array_agg(DISTINCT ARRAY[controlpoint_type_id, brand_id]) as brand_filter
    FROM main.project_brand b
    GROUP BY project_id
  ) as brands ON brands.project_id = p.id

  LEFT JOIN (
    SELECT
      pp.project_id,
      array_agg(DISTINCT ARRAY[controlpoint_type_id, product_id]) as product_filter
    FROM main.project_product pp
    GROUP BY project_id
  ) as products ON products.project_id = p.id

  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', drawing_group.id,
        'name', drawing_group.name,
        'drawingCount', (SELECT COUNT(*) FROM main.drawing_group_drawing WHERE project_id = p.id AND drawing_group_id = drawing_group.id)
      ) ORDER BY drawing_group.name
    ) group_objects
    FROM main.drawing_group
    WHERE project_id = p.id
  ) drawing_groups ON true

  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', l.layer_id,
        'name', l.name,
        'mnemonic', l.mnemonic,
        'description', l.description,
        'deletedAt', l.deleted_at,
        'sortOrder', lp.sort_order,
        'layerType', dev.default_deviation,
        'layerPath', lp.layer_path,
        'layerDepth', lp.layer_path_depth,
        'parentLayerId', l.parent_layer_id
      ) ORDER BY l.sort_order, l.name
    ) layers
    FROM main.project_layer l
    
    JOIN main.get_layer_paths(_project_id => p.id) lp
    ON l.layer_id = lp.layer_id
    
    LEFT JOIN LATERAL (
      SELECT jsonb_build_object(
        'id', plt.id,
        'deviationTypeId', dt.id,
        'levelId', dt.controlpoint_level_id,
        'iconName', plt.icon_name
      ) as default_deviation
      FROM main.project_layer_type plt 
      LEFT JOIN main.deviation_type dt ON dt.id = plt.default_deviation_type_id
      WHERE plt.id = l.layer_type_id
    ) dev ON TRUE
    
    WHERE l.is_hidden <> true 
    AND l.project_id = p.id
  ) project_layers ON true

  LEFT JOIN LATERAL (
    SELECT main.get_project_controlpoint_types(
      _user_account_id => _user_account_id,
      _project_id => p.id
    ) as controlpoint_types
  ) controlpoint_type ON true
  
  LEFT JOIN LATERAL ( 
    SELECT array_agg(pm.module_id) AS module_ids
     FROM project_module pm
     WHERE pm.project_id = p.id
  ) project_module ON true


  WHERE acl.user_account_id = _user_account_id
  AND (_last_updated IS NULL OR p.modified_at > _last_updated OR acl.created_at > _last_updated OR us.modified_at > _last_updated)
  AND (p.deleted_at IS NULL)
  AND (p.is_pending = FALSE OR p.created_by_id = _user_Account_id)
  AND p.is_project_container = false;
END;
$function$;
```

## WIP 2023-05-18
main.acl_calc_project_file
main.acl_calc
main.project_with_files

Nej, returnera INTE alla projektfiler I project_with_file 
Endast en viss intent kanske ska gå att access-reglera, dessa intents kan man hämta med helt separat snurra istället.

Eller helt enkelt skippa file_ref och istället använda document till detta??
Men report_component_file_ref då??


```CREATE TABLE IF NOT EXISTS main.file_access_type ( 
	id                   smallint  NOT NULL  ,
	name                 text    ,
	CONSTRAINT file_access_type_fkey PRIMARY KEY ( id )
 );

CREATE TABLE IF NOT EXISTS main.project_file_acl ( 
	user_account_id      integer  NOT NULL  ,
	project_id           integer  NOT NULL  ,
	file_access_type_id smallint NOT NULL  ,
	can_create           boolean    ,
	acl_batch_id         integer    ,
	modified_at          timestamptz(3) DEFAULT now() NOT NULL  ,
	created_at           timestamptz(3) DEFAULT now() NOT NULL  ,
	company_id           integer  NOT NULL  ,
	CONSTRAINT project_file_acl_pkey PRIMARY KEY ( user_account_id, project_id, file_access_type_id )
 ) ;

CREATE INDEX IF NOT EXISTS idx_project_file_acl_created_at ON main.project_file_acl  ( created_at ) ;
CREATE INDEX IF NOT EXISTS idx_project_file_acl_modified_at ON main.project_file_acl  ( modified_at ) ;

CREATE TABLE IF NOT EXISTS main.project_file_acl_revoked ( 
	user_account_id      integer  NOT NULL  ,
	project_id           integer  NOT NULL  ,
	file_access_type_id smallint NOT NULL  ,
	company_id           integer  NOT NULL  ,
	modified_at          timestamptz(3) DEFAULT now() NOT NULL  ,
	CONSTRAINT project_file_acl_revoked_pkey PRIMARY KEY ( user_account_id, project_id, file_access_type_id )
 ) ;

CREATE INDEX IF NOT EXISTS idx_project_file_acl_revoked_modified_at ON main.project_file_acl_revoked  ( modified_at ) ;

ALTER TABLE main.project_file_ref ADD COLUMN IF NOT EXISTS file_access_type_id smallint;

ALTER TABLE main.project_file_ref DROP CONSTRAINT IF EXISTS project_file_ref_file_access_type_id_fkey;
ALTER TABLE main.project_file_ref 
ADD CONSTRAINT project_file_ref_file_access_type_id_fkey 
FOREIGN KEY ( file_access_type_id ) 
REFERENCES main.file_access_type( id );

ALTER TABLE main.project_file_acl DROP CONSTRAINT IF EXISTS project_file_acl_user_account_id_fkey;
ALTER TABLE main.project_file_acl 
ADD CONSTRAINT project_file_acl_user_account_id_fkey 
FOREIGN KEY ( user_account_id ) 
REFERENCES main.user_account( id )   ;

ALTER TABLE main.project_file_acl DROP CONSTRAINT IF EXISTS project_file_acl_project_id_fkey;
ALTER TABLE main.project_file_acl 
ADD CONSTRAINT project_file_acl_project_id_fkey 
FOREIGN KEY ( project_id ) 
REFERENCES main.project( id ) 
ON DELETE CASCADE;

ALTER TABLE main.project_file_acl_revoked DROP CONSTRAINT IF EXISTS project_file_acl_revoked_user_account_id_fkey;
ALTER TABLE main.project_file_acl_revoked 
ADD CONSTRAINT project_file_acl_revoked_user_account_id_fkey 
FOREIGN KEY ( user_account_id ) 
REFERENCES main.user_account( id )   ;

ALTER TABLE main.project_file_acl_revoked DROP CONSTRAINT IF EXISTS project_file_acl_revoked_company_id_fkey;
ALTER TABLE main.project_file_acl_revoked 
ADD CONSTRAINT project_file_acl_revoked_company_id_fkey 
FOREIGN KEY ( company_id ) 
REFERENCES main.company( id )   ;

COMMENT ON CONSTRAINT project_file_acl_project_id_fkey ON main.project_file_acl IS 'cascade delete';


CREATE TABLE IF NOT EXISTS main.role_file_access_type ( 
	role_id              integer  NOT NULL  ,
	file_access_type_id smallint  NOT NULL  ,
	can_create           boolean    ,
	created_at           timestamptz(3) DEFAULT now()   ,
	CONSTRAINT role_file_access_type_pkey PRIMARY KEY ( role_id, file_access_type_id )
);

ALTER TABLE main.project_file_acl DROP CONSTRAINT IF EXISTS project_file_acl_file_access_type_id_fkey;
ALTER TABLE main.project_file_acl 
ADD CONSTRAINT project_file_acl_file_access_type_id_fkey 
FOREIGN KEY ( file_access_type_id ) 
REFERENCES main.file_access_type( id )   ;

ALTER TABLE main.project_file_acl_revoked DROP CONSTRAINT IF EXISTS project_file_acl_revoked_file_access_type_id_fkey;
ALTER TABLE main.project_file_acl_revoked 
ADD CONSTRAINT project_file_acl_revoked_file_access_type_id_fkey 
FOREIGN KEY ( file_access_type_id ) 
REFERENCES main.file_access_type( id )   ;

ALTER TABLE main.role_file_access_type DROP CONSTRAINT IF EXISTS role_file_access_type_role_id_fkey;
ALTER TABLE main.role_file_access_type 
ADD CONSTRAINT role_file_access_type_role_id_fkey 
FOREIGN KEY ( role_id ) 
REFERENCES main."role"( id )   ;

ALTER TABLE main.role_file_access_type DROP CONSTRAINT IF EXISTS role_file_access_type_file_access_type_id_fkey;
ALTER TABLE main.role_file_access_type 
ADD CONSTRAINT role_file_access_type_file_access_type_id_fkey 
FOREIGN KEY ( file_access_type_id ) 
REFERENCES main.file_access_type( id )   ;


INSERT INTO main.file_access_type 
(id, name)
VALUES 
(1, 'Restricted document'),
(2, 'Super restricted document')
ON CONFLICT DO NOTHING;

INSERT INTO main.role_file_access_type 
(role_id, file_access_type_id, can_create) 
VALUES 
(2, 1, true)
ON CONFLICT DO NOTHING;

```

```CREATE OR REPLACE FUNCTION main.acl_calc_project_file(_acl_batch_id integer, _user_account_id integer, _company_id integer DEFAULT NULL==integer, _project_id integer DEFAULT NULL==integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
BEGIN
  WITH new_acl AS (
    SELECT
      company_id,
      project_id,
      file_access_type_id,
      max(can_create_file::int)::boolean as can_create,
      _acl_batch_id as acl_batch_id,
      now() as modified_at,
      now() as created_at,
      coalesce(array_agg(DISTINCT role_id)
        FILTER (WHERE role_id IS NOT NULL), '{}') as granted_roles

    FROM acl
    WHERE project_id IS NOT NULL
    AND file_Access_type_id IS NOT NULL
    GROUP BY company_id, project_id, file_access_type_id
  )

  INSERT INTO main.project_file_acl as old_acl (
    user_account_id,
    company_id,
    project_id,
    file_access_type_id,
    can_create,
    acl_batch_id,
    created_at,
    modified_at
    --,    granted_roles
    )
  SELECT
    _user_account_id,
    company_id,
    project_id,
    file_access_type_id,
    can_create,
    acl_batch_id,
    created_at,
    modified_at
    --,    granted_roles
  FROM new_acl
  ON CONFLICT ON CONSTRAINT project_file_acl_pkey
  DO UPDATE SET
    acl_batch_id = _acl_batch_id,
    can_create = excluded.can_create,
--    granted_roles = excluded.granted_roles,
    modified_at = CASE
      WHEN old_acl.can_create != excluded.can_create
    THEN now() ELSE old_acl.modified_at END;

  INSERT INTO main.project_file_acl_revoked
  (user_account_id, project_id, company_id, file_Access_type_id, modified_at)
  SELECT
    user_account_id,
    project_id,
    company_id,
    file_access_type_id,
    now()
  FROM main.project_file_acl
  WHERE user_account_id = _user_account_id
  AND (_project_id IS NULL OR project_id = _project_id)
  AND (_company_id IS NULL OR company_id = _company_id)
  AND acl_batch_id != _acl_batch_id
  ON CONFLICT ON CONSTRAINT project_file_acl_revoked_pkey
  DO UPDATE SET modified_at = now();

  DELETE FROM main.project_file_acl
  WHERE user_account_id = _user_account_id
  AND (_project_id IS NULL OR project_id = _project_id)
  AND (_company_id IS NULL OR company_id = _company_id)
  AND acl_batch_id != _acl_batch_id;

  RETURN 1;
END;
$function$;


CREATE OR REPLACE FUNCTION main.acl_calc(_user_account_id integer, _company_id integer DEFAULT NULL::integer, _project_id integer DEFAULT NULL::integer, _layer_id integer DEFAULT NULL::integer, _drawing_id integer DEFAULT NULL::integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  _acl_batch_id int = nextval('main.acl_batch_id_seq');
  _locked_at timestamptz;
  GRANT_COMPANY_ROLES_PERMISSION int;
  SUPER_PERMISSION int;
BEGIN

  GRANT_COMPANY_ROLES_PERMISSION := 101;
  SUPER_PERMISSION := 1;

--  RAISE NOTICE 'ACL calc with acl_batch_id: %', _acl_batch_id;

  --Take a shared lock for all involved users to prohibit data access while calculating acl
  --Lock will be released after this transaction so get_drawings becomes accessile again
  --101 = drawings, 102 = projects, 103 = controlpoints, 104 = reports, 105 = inspections
  --Shared locks are needed to ensure that more than one microservice can see the locks concurrently
  PERFORM pg_advisory_xact_lock(101, _user_account_id); --drawings
  PERFORM pg_advisory_xact_lock(102, _user_account_id); --projects
  PERFORM pg_advisory_xact_lock(103, _user_account_id); --controlpoints
  PERFORM pg_advisory_xact_lock(104, _user_account_id); --reports
  PERFORM pg_advisory_xact_lock(105, _user_account_id); --inspections
  PERFORM pg_advisory_xact_lock(106, _user_account_id); --journalItems
  PERFORM pg_advisory_xact_lock(107, _user_account_id); --inboxItems

  IF _layer_id IS NOT NULL AND _project_id IS NULL THEN 
    --layer_id is only unique per project, hence project_id cannot be automatically implied
    RAISE EXCEPTION '_project_id must be provided for layer specific ACL-calculations';
  END IF;

  --Just in case.. If drawing_id is not null, but project_id is missing, company_id and project_id will be implied
  IF _drawing_id IS NOT NULL AND _project_id IS NULL THEN 
    SELECT d.project_id
    INTO _project_id 
    FROM main.drawing d
    WHERE d.id = _drawing_id;
  END IF;

  --Just in case.. If project is not null, but company_id is missing, company_id will be implied
  --n.b. implied company_id must be queried after project_id. It's cascasing.
  IF _project_id IS NOT NULL AND _company_id IS NULL THEN 
    SELECT p.company_id 
    INTO _company_id 
    FROM main.project p 
    WHERE p.id = _project_id;
  END IF;

  DROP TABLE IF EXISTS acl;

  --This temp table will be dropped after this transaction. The use of a temp table makes this function troublesome to run in multiples concurrently within the same session
  --Hence, if more than one call should be done concurrently it must be done from separate sessions to isolate the temp table.
  CREATE TEMP TABLE acl ON COMMIT DROP AS
  SELECT
    er.user_account_id,
    er.layer_id,
    er.project_id,
    er.company_id,
    er.role_level,
    rp.permission_id,
    rcp.controlpoint_type_id,
    rcp.can_create as can_create_controlpoint_type,
    rit.journal_item_type_id,
    rit.can_create as can_create_journal_item_type,
    rrt.report_type_id,
    rrt.report_type_variant_id,
    rrt.report_type_id::varchar||'.'||rrt.report_type_variant_id::varchar as report_type_composite,
    rrt.can_create as can_create_report_type,
    insp.can_create as can_create_inspection_type,
    COALESCE(insp.can_start, insp.can_create) as can_start_inspection_type, --if you can create, you can start
    COALESCE(insp.can_join, insp.can_start, insp.can_create) as can_join_inspection_type, --if you can start or create, you can join
    insp.inspection_type_id,
    fat.file_access_type_id,
    fat.can_create as can_create_file,
    grant_role_id,
    null::int as grant_role_id_as_admin, --rbr.role_id as grant_role_id_as_admin,
    r.id AS role_id
  FROM main.acl_get_effective_roles(_user_account_id, _company_id, _project_id, _layer_id) er
  JOIN main."role" r ON r.id = er.role_id
  LEFT JOIN main.role_permission rp ON rp.role_id = r.id
  LEFT JOIN main.role_controlpoint_type rcp ON rcp.role_id = r.id

  --We need to join cptjit in order to match jit from each role with jit from controlpointType definition
  LEFT JOIN main.controlpoint_type__journal_item_type cptjit ON cptjit.controlpoint_type_id = rcp.controlpoint_type_id
  LEFT JOIN main.role_journal_item_type rit ON rit.role_id = r.id AND rit.journal_item_type_id = cptjit.journal_item_type_id
  LEFT JOIN main.role_report_type rrt ON rrt.role_id = r.id
  LEFT JOIN main.role_grant_role rgr ON rgr.role_id = r.id
  LEFT JOIN main.role_inspection_type insp ON insp.role_id = r.id
  LEFT JOIN main.role_file_access_type fat ON fat.role_id = r.id;

  --For now (2019-02-09) we won't use company role bundles. Instead role bundles are conencted directly to user accounts
  --Add all available company roles if er.role = 1 (Admin) or 101 (grand company roles)
--  LEFT JOIN main.company__role_bundle crb
--    ON (rp.permission_id = SUPER_PERMISSION OR rp.permission_id = GRANT_COMPANY_ROLES_PERMISSION)
--    AND crb.company_id = er.company_id
--  LEFT JOIN main.role_bundle__role rbr ON rbr.role_bundle_id = crb.role_bundle_id;

  --All ACL-calc functions take the same arguments, even if not all are used. This simplifies the call signature and readability
  PERFORM main.acl_calc_project_layer      (_acl_batch_id, _user_account_id, _company_id, _project_id, _layer_id, _drawing_id);
  PERFORM main.acl_calc_project            (_acl_batch_id, _user_account_id, _company_id, _project_id, _layer_id, _drawing_id);
  PERFORM main.acl_calc_company            (_acl_batch_id, _user_account_id, _company_id, _project_id, _layer_id, _drawing_id);
  PERFORM main.acl_calc_controlpoint_type  (_acl_batch_id, _user_account_id, _company_id, _project_id, _layer_id, _drawing_id);
  PERFORM main.acl_calc_journal_item_type  (_acl_batch_id, _user_account_id, _company_id, _project_id, _layer_id, _drawing_id);
  PERFORM main.acl_calc_report_type        (_acl_batch_id, _user_account_id, _company_id, _project_id, _layer_id, _drawing_id);
  PERFORM main.acl_calc_inspection_type    (_acl_batch_id, _user_account_id, _company_id, _project_id, _layer_id, _drawing_id);
  PERFORM main.acl_calc_inbox              (_acl_batch_id, _user_account_id, _company_id, _project_id, _layer_id, _drawing_id);

  PERFORM main.acl_calc_project_file       (_acl_batch_id, _user_account_id, _company_id, _project_id);

  --Drawing access is not controlled via roles, hence no need to use acl temp table for drawing calculations
  PERFORM main.acl_calc_drawing(_user_account_id, _company_id, _project_id, _drawing_id);

--No "explain" for now.. The explain functions needs to be altered to work with PG 9+
--due to "unnest cannot be included in select list, change to LATERAL JOIN.."
--PERFORM main.acl_calc_explain(users, _acl_batch_id);

  RETURN _acl_batch_id;
END;
$function$;


DROP VIEW IF EXISTS main.project_with_files;

CREATE OR REPLACE FUNCTION main.project_with_files(_user_account_id int) 
RETURNS TABLE (
    id int,
    company_id int,
    name text,
    container_properties jsonb,
    properties jsonb,
    is_pending bool,
    thumbnail_file_guid uuid,
    modified_at timestamptz,
    deleted_at timestamptz,
    project_state_id int,
    created_by_id int,
    is_project_container bool,
    project_container_id int,
    file_refs json,
    files json,
    module_ids int[],
    template_id int
) 
LANGUAGE SQL 
AS $$
 SELECT 
    p.id,
    p.company_id,
    p.name,
    COALESCE(container.properties, NULL::jsonb) AS container_properties,
    COALESCE(p.properties, NULL::jsonb) AS properties,
    p.is_pending,
    p.thumbnail_file_guid,
    p.modified_at,
    p.deleted_at,
    p.project_state_id,
    p.created_by_id,
    p.is_project_container,
    p.project_container_id,
    array_to_json(array_agg(fr.file_ref) FILTER (WHERE fr.file_ref IS NOT NULL)) AS file_refs,
    array_to_json(array_agg(fr.file) FILTER (WHERE fr.file IS NOT NULL)) AS files,
    array_agg(project_module.module_id) AS module_ids,
    p.template_id
    FROM main.project p
    LEFT JOIN LATERAL ( WITH RECURSIVE project_tree(project_id, project_container_id, distance) AS (
      SELECT 
        p_leaf.id,
        p_leaf.project_container_id,
        0 AS "?column?"
      FROM main.project p_leaf
      WHERE p_leaf.id = p.id
      
      UNION ALL
      
      SELECT 
        p_recursive.id,
        p_recursive.project_container_id,
        project_tree.distance + 1
      FROM project_tree
      JOIN main.project p_recursive ON project_tree.project_container_id = p_recursive.id
    )
    SELECT DISTINCT ON (pfr.file_guid, pfr.intent_id) 
      jsonb_build_object(
        'sourceProjectId', pfr.project_id,
        'sourceDistance', pt.distance, 
        'fileGuid', pfr.file_guid, 
        'intentId', pfr.intent_id, 
        'properties', pfr.properties
      ) AS file_ref,
      jsonb_build_object(
        'guid', pfr.file_guid, 
        'pixelWidth', fs.pixel_width, 
        'pixelHeight', fs.pixel_height, 
        'hasThumbnailFile', fs.has_thumbnail_file, 
        'hasMediumResFile', fs.has_medium_res_file, 
        'hasLowResFile', fs.has_low_res_file, 
        'fileTypeId', fs.file_type_id, 
        'languageCode', fs.language_code, 
        'properties', pfr.properties
      ) AS file
    FROM main.project_file_ref pfr
    JOIN main.file_simple fs ON fs.guid = pfr.file_guid
    JOIN project_tree pt ON pt.project_id = pfr.project_id
    LEFT JOIN main.project_file_acl facl 
      ON facl.project_id = pfr.project_id 
      AND facl.file_access_type_id = pfr.file_access_type_id
      AND facl.user_account_id = _user_account_id
    WHERE (pfr.is_inheritable OR pt.distance = 0)
    AND (pfr.file_access_type_id IS NULL OR facl.project_id IS NOT NULL)
    
    ORDER BY 
      pfr.file_guid, 
      pfr.intent_id, 
      (CASE
         WHEN pfr.properties IS NULL THEN 1
         ELSE 0
       END), 
       pt.distance
     ) fr ON true
     LEFT JOIN LATERAL ( 
       SELECT pm.module_id
       FROM main.project_module pm
       WHERE pm.project_id = p.id
     ) project_module ON true
     LEFT JOIN main.project container ON container.id = p.project_container_id
  GROUP BY p.id, container.id
$$;
```