# Reorganize controlpoint images and others "add/remove" items

#plantrail/database

## Objective
JournalItems can add images, products, snippets, etc to a controlpoint. We need a concept for removing these items as well. 

Example: 
* JournalItem 1 adds file A
* JournalItem 2 adds file B and removes file A
* The controlpoint should now be related only to fileB

When a journalItem is created, the input can include fileRefs, snippets, products, etc. The fileRefs are unpacked and stored in the table journal_item_file_ref. All other items are stored directly in the journal_item table as json data. 

As of today no files are actually related directly to the controlpoint, all fileRefs remain with the journalItem and has to be consolidated every time we need to show files for a controlpoint. 

We want the journalItem fileRefs to represent all the journal history, hence we cannot remove files from fileRefs.

We want to:
1. harmonize the structure for all items
2. migrate from "tag" to media_album_id in journal_item_file_ref
3. create detail tables for all item types related to a journal_item and migrate from the json fields 
4. create fk-constraints for every item related to a journal_item
5. Make room for removal instructions so a journalItem can instruct to remove items from the controlpoint.
6. populate the detail tables based on jsonb-input in create_journal_item-function (instead of populating the json columns)
7. remove obsolete jsonb_columns in journal_item (now replaced with detail tables)
8. add/delete items from corresponding detail tables for controlpoint
9. Ensure that affected views and functions are updated due to the above. I.e. Get_journal_items, get_ddp_.., get_report_data_…, etc


## Structure
The structure we want to create includes the following tables (some already exists)

### Existing tables
Detail tables for controlpoint already exists. These are updated by process_journal_item based on the current jsonb-columns.

All these tables should be slimmed down and not have created_by_id, created_at, etc. Instead a journal_item_guid should be added to make it possible to get any related data from the journal if needed.

* controlpoint_file_ref
* controlpoint_snippet
* controlpoint_tag
* controlpoint_state
* controlpoint_shape
* controlpoint_qr_token
* controlpoint_product

File-refs are the only jsonb-columns currently being unpacked to a separate table. This is performed in function create_journal_item in the database.
* journal_item_file_ref

### New tables
We need new detail tables to replace the current jsonb columns in journal_item. These tables should have all the information needed to populate the controlpoint_-corresponding table. We also need an "is_remove" flag to handle removal of items from the controlpoint_-table.

- [ ] journal_item_snippet
- [ ] journal_item_tag
- [ ] journal_item_state
- [ ] journal_item_shape
- [ ] journal_item_qr_token
- [ ] journal_item_product


### create_journal_item()
The create_journal_item function should unpack all jsonb objects into the new tables. As of now the structure of the different jsonb-inputs is not harmonized. We need to harmonize.

- [ ] all jsonb inputs should be arrays (currently fileRefs are objects)
- [ ] key fields in the arrays should have complete names "snippetI" or "fileGuid" (not just "id" or "guid")
- [ ] all fields should be camelized (fileRef fields are currently snake case)

#### Example inputs

```
_products = [{
	productId: 3, 
	intentId: 2,
  isRemove: ..
}]

_snippets = [{
	snippetGuid: 'ba0ca21e-ac72-489f-80a9-768a95690380',
	intentId: 2,
  isRemove: ..
}]

_file_refs = [{
	fileGuid: 'ba0ca21e-ac72-489f-80a9-768a95690381',
  mediaAlbumId: 1,
  tag: 'before_work',
	intentId: 5,
  isRemove: ..
}]

_qr_tokens = [{
	token: 'abc123xy',
  isRemove: ..
}]

_states = [{
	stateId: 1,
  isRemove: ..
}]

_tags = [{
	tagId: 1,
  isRemove: ..
}]

//Shapes are organized in a keyed object, i.e. not an array 
//as the above items
_shapes = {
	'shapeGuid': {
		p1: 
      p2:
      ...
      isRemove: ..
  }
}
```



## Tasks
### New columns
- [ ] controlpoint_file_ref.media_album_id
- [ ] controlpoint_file_ref.created_by_id
- [ ] controlpoint_file_ref.created_at

- [ ] Remove modified_at trigger in controlpoint_file_ref
- [ ] Drop controlpoint_file_ref.modified_at

### Drop constraints
- [x] controlpoint_file_ref.controlpoint_file_ref_intent_id_key (why does this even exist?)

### New database constraints
- [ ] controlpoint_file_ref.journal_item_id
- [ ] controlpoint_file_ref.media_album_id
- [ ] controlpoint_file_ref.created_by_id

### Populate main.media_album
- [x] Add all missing "tags" so we can use media_album_id instead of image tags
- [x] Update journal_item_file_ref.media_album_id via media_album

### Copy all fileRefs from journal_item_file_ref to controlpoint_file_ref
- [x] copy all missing file_refs (thumbnails already exists)
- [x] update existing thumbnail file_refs with media_album, etc

### Update view controlpoint_with_files
- [x] add mediaAlbumId
- [x] add  createdById

### Update data-extraction functions to use controlpoint_file_ref
- [ ] get_report_data_controlpoints_v1
- [ ] get_ddp_ds_controlpoint_images


## Update process_journal_item
- [x] Temporarily fill in media_album_id based on the image tag
- [x] create records in controlpoint_file_ref when file_refs are attached to the journal_item
- [ ] remove records from controlpoint_file_ref based on journal_item.remove_file_guids

## update tr_controlpoint__thumbnail_file_ref
- [x] disable this trigger for now
- [ ] How should we solve this. Where in the process should controlpoint.thumbnail_guid be updated?
- [ ] How should we act if a journalItem removed the file which is referenced from thumbnail_guid? Another image needs to be selected.

## Update create_journal_item
- [x] Call process_journal_item from here instead of from trigger
- [x] Drop trigger tr_journal_item__update_controlpoint

## controlpoint_file_ref.modified_at
- [ ] Do we really need this column?

Currently the column is updated via a trigger from main.file. Maybe we should remove the trigger and remove the modified_at column.

## Update get_report_data_controlpoints_v1
Deviation images are fetched from journal_item_file_ref. This is still correct, but we now need to omit records with "is_remove=true", since journal_item_file_ref also can hold removal-instructions.

Caveat:
Reports will show deviation images collected from each journal_item, even if some images are removed via a later journal_item.

We might want to fetch images directly from controlpoint_file_ref instead, now that this table is continuously updated?

Same goes for journaItemImages, which fetches all images for all JIs. This needs to stop..

- [ ] Alter get_report_data_controlpoints_v1

## Update the app

## Other
DROP FUNCTION IF EXISTS main.build_shape;