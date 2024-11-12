# Controlpoints new storage structure
#plantrail/controlpointTypes
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