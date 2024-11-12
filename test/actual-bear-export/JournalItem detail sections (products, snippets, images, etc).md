# JournalItem detail sections (products, snippets, images, etc)

#plantrail/products

## Background
JournalItems are now able to both add and remove detail items, such as products, fileRefs, snippets, etc. The database and the API are ready for this change, the app GUI is next.

## Current app GUI
The input form for a journalItem is divided into "sections". Each section has its own GUI and its own data logic.

The following section types handles journalItem details:
* media
* products
* snippets

The following is planned to work in the same way:
* qrTokens
* documents
* states
* tags

**Shapes** are also handled in the same way, but there is no corresponding journalItem section for shapes. Shapes are create interactively as drawing items, i.e. they are not input to the journalItem form.

As of now the detail sections can only add more items, i.e. item removal is not possible in the GUI. If a photo is added to a controlpoint via a journalItem, this photo is stuck with the controlpoint forever.

## New GUI
- [ ] The sections should be pre-populated with the items added earlier on
- [ ] User should be able to add new items
- [ ] User should be able to remove old items
- [ ] User should possibly be able to edit old items (i.e. crop a photo, etc)
- [ ] ACL must be checked, i.e. permission to remove photo from other user, etc

### Different kinds of UI
- [ ] List based for selections (Snippets, Products)
- [ ] Clickable thumbnails (media)
- [ ] Button based (tags, states)

**The list based UI** should show thumbnails in the same way the thumbnail based UI does, but the "add"-button takes the user to a list with selectable items. The user can also build a favorites list. This UI should be used when there are many precreated, selectable items, such as products.

Clickable thumbnails does not have a selection list.

Button based selection should be presented as on/off buttons, eg a tag cloud where the user can activate/deactivate tags.

## Data structures
### Controlpoint details (i.e. previously added items)
The item data for controlpoints is structures in the following way under each controlpoint:

```
products: [
	{productId: 1, intentId: 1},
	{productId: 31, intentId: 2}  
}],
snippets: [
	{snippetGuid: '..', intentId: 2}
],
fileRefs: [
	{fileGuid: '..', intentId: 5, mediaAlbumId: 2}
	{fileGuid: '..', intentId: 5, mediaAlbumId: 2}
	{fileGuid: '..', intentId: 5, mediaAlbumId: 1, crop: {..}
],
tags: [
	{tagId: 11},
  {tagId: 13},
]
```

**IntentId** and **mediaAlbumId** are part of the primary keys for these items. The journalItemSections configuration must specify these keys if the itemType needs them.

Example:
sectionType = media, photo before work
* intentId = 5 (journalPhoto)
* mediaAlbumId = 2 (before work)

Item objects can potentially hold more data, for example crop coordinates or shape information if the UI lets the user draw on photos.

### JournalItem details
The detail data for a journalItem is what in the end creates the detail data for the controlpoint. Detail information in a journalItem is a change-instruction. For removing an item from the journalItem, the journalItem should set isRemove=true on the item to remove.

```
[
	{productId: 1, intentId: 1, isRemove: true}
	{productId: 2, intentId: 1}
]
```

Removal instructions can coexist with add/update instructions in the array.

## Data processing
When a journalItem is created a reference to the controlpoint is included. The item arrays in the controlpoint is the starting point for any GUI type, i.e. the selection lists, thumbnails, and selection buttons should be initialized with the current state. Current state is the current items in the controlpoint.

The variable for the current state is named `original`

When the user adds or removes (selects/unselects) items this should result in an update instruction as per above.

The variable for added/updated items is named `upsert``

The variable for removals is named `remove`

### Update rules
The resulting journalItem update instruction is calculated like this:

`original.merge(upsert).delete(removal)`

I.e. The original list is merged with the upsert list. All new items are added. If an item already exists in original, this item is updated. All items in the removal list is removed from the original list.

If an item is added in the current journalItem, and removed in the same journalItem, the item should be removed directly from the upsert list.

### Component hierarchy
JournalItems are constructed in the GUI via the following components:

JournalItemView
   Sections

Each section type is defined as a separate component. As of now the section types are class based components and they inherit from BaseSection. (N.B, we should move away from this inheritance PITA).

A section can handle its own internal state during editing. Upon leaving the section (or earlier event) the state is saved to the JournalItem via the `update` function which is avalilable to the sections via a prop.

## Remove obsolete journal_item columns
- [x] remove_qr_tokens
- [x] add_qr_tokens
- [ ] remove_sippet_guids
- [ ] snippets
- [x] remove_snippets
- [x] add_snippets
- [x] add_state_ids
- [x] remove_state_ids
- [ ] notes
- [x] remove_shape_guids
- [x] shapes
- [x] products
- [x] product_intent_id


- [ ] remove_qr_tokens
- [ ] add_qr_tokens
- [ ] remove_snippets

- [ ] shapes
- [ ] remove_shape_guids
- [ ] add_state_ids
- [ ] remove_state_ids
- [ ] products
- [ ] product_intent_id
- [ ] add_snippets

