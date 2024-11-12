# Migrate from document_id to document_guid

#plantrail/database

## Background
In hindsight, opting for integer id in main.document was not a good idea. Document-id will be exposed via the API and hence lends itself to guessing attacks. I.e. an Api user could easily guess what integer id another document might have.

It should not be possible to gain access to a document only by knowing its id, but with many use cases there is a risk of missing this control.

### Example use case:
In the protocol creation GUI, a user can choose among company- and project documents to link to from within the report (pdf). Connecting a document to a report is done via an API call which includes the document id. This api call could potentially be tampered with to randomly choose any other integer id for the connected document.

The resulting report would include a link to the document, which would let the user gain access to a potentially sensitive document.

* Since the database cannot have constraints for the document connections, we should implement a check on this, so the above use case will not be possible.
* We should also switch do UUID as id instead of integer.

## Switching to UUID
"document_id" is referenced in the below database entities (tables/views/functions) in the database. Switching to UUID will need all those entities to be altered.

![[879E09E3-07BA-4DC6-A71B-65E6552E957F.png]]

### Code #1 (tables and view)

```DROP VIEW IF EXISTS main.snippet_with_files;
ALTER TABLE main.snippet DROP COLUMN IF EXISTS document_id CASCADE;
DROP TABLE main.report_section_document CASCADE;
DROP TABLE main.document CASCADE;
DROP TABLE main.project_document CASCADE;
DROP TABLE main.company_document CASCADE;
DROP TABLE main.system_document CASCADE;
DROP TABLE main.portal_log_document_download CASCADE;


CREATE TABLE main.report_section_document ( 
	report_section_id    integer  NOT NULL  ,
	document_guid        uuid  NOT NULL  ,
	properties           jsonb    ,
	CONSTRAINT report_section_document_pkey PRIMARY KEY ( report_section_id, document_guid )
 );

ALTER TABLE main.report_section_document 
ADD CONSTRAINT report_section_document_report_section_id_fkey 
FOREIGN KEY ( report_section_id ) 
REFERENCES main.report_section( id );

ALTER TABLE main.report_section_document 
ADD CONSTRAINT report_section_document_document_guid_fkey 
FOREIGN KEY ( document_guid ) 
REFERENCES main.document( guid );

----------------

CREATE TABLE main.document ( 
	guid                 uuid NOT NULL DEFAULT pgcrypto.gen_random_uuid(),
	file_guid            uuid  NOT NULL,
	company_id           int NOT NULL DEFAULT 0,
	project_id           int NOT NULL DEFAULT 0,
	title                text    ,
	properties           jsonb    ,
	created_at           timestamptz(3) DEFAULT now() NOT NULL  ,
	created_by_id        integer  NOT NULL  ,
	snippet_paragraph_regex varchar    ,
	snippet_margins      jsonb    ,
	CONSTRAINT document_pkey PRIMARY KEY ( guid )
 );

ALTER TABLE main.document 
ADD CONSTRAINT document_created_by_id_fkey 
FOREIGN KEY ( created_by_id ) 
REFERENCES main.user_account( id );

ALTER TABLE main.document 
ADD CONSTRAINT document_file_guid_fkey 
FOREIGN KEY ( file_guid ) 
REFERENCES main."file"( guid );

ALTER TABLE main.document 
ADD CONSTRAINT document_company_id_fkey 
FOREIGN KEY ( company_id ) 
REFERENCES main.company( id );

ALTER TABLE main.document 
ADD CONSTRAINT document_project_id_fkey 
FOREIGN KEY ( project_id ) 
REFERENCES main.project( id );

COMMENT ON COLUMN main.document.snippet_paragraph_regex IS 'Regex for peeling out identifiers (i.e. "5:535") from pdf-outlines.';

COMMENT ON COLUMN main.document.snippet_margins IS 'Valid props: top, bottom, left, right, leftOdd, rightOdd, leftEven, rightEven';

-------------------------------------------
CREATE TABLE main.portal_log_document_download ( 
	id                   integer  NOT NULL GENERATED ALWAYS AS IDENTITY ,
	portal_guid          uuid  NOT NULL  ,
	document_guid        uuid  NOT NULL  ,
	token                text  NOT NULL  ,
	client_guid          uuid    ,
	created_at           timestamptz(3)  NOT NULL  ,
	CONSTRAINT portal_log_document_download_pkey PRIMARY KEY ( id )
 );

ALTER TABLE main.portal_log_document_download 
ADD CONSTRAINT portal_log_document_download_portal_guid_fkey 
FOREIGN KEY ( portal_guid ) 
REFERENCES main.portal( guid );

ALTER TABLE main.portal_log_document_download 
ADD CONSTRAINT portal_log_document_download_document_guid_fkey 
FOREIGN KEY ( document_guid ) 
REFERENCES main.document( guid );
---------------------------------------------

ALTER TABLE main.snippet ADD COLUMN IF NOT EXISTS document_guid uuid;
UPDATE main.snippet SET 
  document_guid = d.guid,
  snippet_paragraph_regex = '(\d:\d{1,5}|\d|.*\d:\d{1,5}.{0,3}) .',
  snippet_margins = '{"top": 75, "left": 70, "right": 50, "bottom": 75}'
FROM main.document d WHERE d.title = 'BBR kapitel 5';

-------------

CREATE VIEW main.snippet_with_files AS
SELECT
  s.guid, 
  s.name,
  s.document_guid,
  s.scope_id,
  s.company_id, 
  s.project_id,
  s.annotations,
  s.properties,
  s.highlighted_words,
  s.created_at, 
  s.created_by_id,
  s.modified_at,
  s.deleted_at,
  fr.file_refs,
  fr.files
  FROM main.snippet s
  LEFT JOIN (
    SELECT
      sfr.snippet_guid,
      array_to_json(
        array_agg(
          json_build_object(
            'fileGuid', sfr.file_guid,
            'intentId', sfr.intent_id
          )
        ) FILTER (WHERE (sfr.file_guid IS NOT NULL))
      ) AS file_refs,
      json_strip_nulls(
        array_to_json(
          array_agg(row_to_json(f.*)) FILTER (WHERE (f.guid IS NOT NULL))
        )
      ) AS files
      FROM (
        main.snippet_file_ref sfr
        JOIN main.file_simple f ON (f.guid = sfr.file_guid)
      )
      GROUP BY sfr.snippet_guid
  ) fr ON s.guid = fr.snippet_guid;

---------------------

```