# Migratin from jsReport V2 to V3

#plantrail/reports

## Global constants
Constants declared in global assets are no longer accessible from other helpers.

**Solution** Convert usage of constants into function calls for each specifi use case.

**Example:** i18Next was exposed as a constant which was used in other helpers as `i18Next.t(...)`. 

Instead we will expose the t function wrapped in another function `t(...)`.


## Moment
Moment does not play well with V3. This is probably solvable by requiring Moment in another fashion. A lot is written about this in the Moment docs.

As it turns out the global object Intl can now handle all we need, i.e. date and number formatting based on locale, as well as timezone conversion.

## Translation
Top level await is now available for use in jsReport. This means that we can init i18Next from start and await completion. Hence we will not need to await the completion in every helper function.

- [ ] function `tSync` is no longer needed as `t()` won't be an async function anymore.
- [ ] **tSync** is only used in three places in tamplate 107, directly in the html. Swith to `t(..)` and remove the tSync function.
- [ ] `i18nLookupSync`  is not needed. Switch to `i18nLookup` in 106, 105, 107, 104

## Körplan
- [x] Importera färsk variant av templates från V2
- [x] Ersätt gamla common med nya
- [x] Ta bort dateTimeConstants (beforeRender behövs inte längre)
- [x] ta bort alla anrop till `tSync`, `i18nLookupSync`, mfl "sync-varianter"
- [x] ta bort alla `await initI18next`
- [x] byt alla `i18next.t` mot bara `t`
- [x] 107.2: gör om `translateControlpointField` till synkron
- [x] add options as argument i t-call in signature-list
- [x] provkör alla rapport-typer

- [ ] remove all calls to moment (5003)

