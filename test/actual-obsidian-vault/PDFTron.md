# PDFTron
#plantrail/snippets

## pdf-table-extraction
Can we use pdf-table.extraction to learn our app to peel out blueprint information from the lower right information box on cad drawings?

I tried to use [Extract Tables from PDFs | PDF Table Extractor | PDFTron](https://www.pdftron.com/pdf-tools/pdf-table-extraction) but it didn't work out well.
**"Our servers are currently unavailable. Please try again later"**

## pdf2svg
We need pdf2svg to extract snippets from pdfs according to given coordinates.

We use pdftocairo today.
**Wy would we need PDFTron?**
- [ ] File size seems a little smaller

**Why not use pdf2svg?**
- [ ] Cannot choose jpg as embedded image format. PNG is overkill and bloats our files.

## pdf2html
An alternative would be to use pdf2html
**Why would we use pdf2html?**
- [ ] smaller file size than svg

**Why not use pdf2html?**
- [ ] Inflexible, cannot specify crop coordinates
- [ ] Uses pdftocairo under the hood, why pay for this?
- [ ] Seems like an afterthought, i.e. command line arguments not harmonized with pdf2svg

PDFTron states "no dependencies". Yet, it seems that pdf2html uses libcairo.


5000 USD per year

5 cent per document.