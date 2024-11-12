# PSPDF
#plantrail/snippets

## Questions
### ## Coding
Where can I find all string constants. Sometimes I can guess from the iOS API ref.

- [ ] How do I enable search?

PSPDFTextSelectionMenuActionSearch

configuration.allowedMenuActions: ['none']; should work, shouldn't? Notning changes

## Locking down annotation editing
Hide annotation menu
Programmatically added annotation should be moveable and resizeable.

editableAnnotationTypes: [] disables everything.. not what I want



## addAnnotation(s)
- [ ] addAnnotation(single) is flicker free
- [ ] addAnnotations(InstantJSON)  flickers the whole PDF. why?

### Search
- [ ] How to search within document
- [ ] Price for indexed search over many documents?

### PSPDFLibrary
Price?
**Use-case**
Need to index about 3-20 documents per context.

When user switches context (i.e. switches to another company), a new set of documents should be indexed.

All documents are in the same folder. 
Filenames are guids 

Some documents will be used in multiple companies, i.e. indexed in multiple index databases.

Typically, only 1-3 companies exists. Some special cases could involve more.

### Document editor
This seems to be a separate component. 

The sample catalog includes a sample where pages are rotated. Is this only possible with "Document Editor" add on?