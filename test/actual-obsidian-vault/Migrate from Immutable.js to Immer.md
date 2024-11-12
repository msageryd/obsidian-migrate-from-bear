# Migrate from Immutable.js to Immer
#dev/immutable

## Object filter
Used to just myObject.filter.

filter() cannot be used on JS objects. Need to do this instead:
Fortunately, all my "items" has its key included in the properties, i.e. 

{
	1: {id:1, name: 'abc'}
	2: {id:2, name: 'def'}
}

Object.fromEntries(
	Object.entry(myObject)
		.filter(item => item.someValue === criteria)
		.map(item => [item.id, item]
)