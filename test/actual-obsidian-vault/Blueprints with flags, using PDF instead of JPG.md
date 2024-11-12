# Blueprints with flags, using PDF instead of JPG
#plantrail/blueprints

This document is investigating the possibility to use vector based blueprints in reports instead of jpg blueprints.
## Background
Currently PlanTrail uses jpg files for blueprints everywhere, but the original files are most often vector based pdf files. The blueprint import function renders the vector blueprints to bitmap and saves as jpg files.

Converting blueprints to jpg has some advantages:
- easier to present anywhere without the need for a pdf renderer
- easier to create crops from jpg files

But there are considerable drawbacks as well:
- we loose the infinite resolution of vector graphics
- reports with blueprint attachment gets bloated with bitmap files instead of more lightweight vector data
- some large scale blueprints needs to be converted to jpg with extra high resolution for small text to be readable, i.e. even larger files

### Dual filetypes
Since November 2023 our blueprint import function is saving the original vector pdf alongside with the rasterised jpg file. This gives us the future possibility to utilise the vector files as well. As of now (2024-07-10), about 1800 blueprints have dual format.

## Technical solution
In order to achieve the goal of a fully vector based blueprint with controlpoints, we need to manipulate the pdf in a more low level manner than currently possible with JSReport and Chrome-PDF.

We need to solve the following:
1. create a new pdf
2. embed an existing vector based blueprint, slightly scaled down to give room for the PlanTrail page header.
3. create our controlpoint graphics with low level PDF commands
4. create transparent PDF annotations on top of our flags to make them clickable

Currently our `shapes` library performs all the hard work of calculating coordinates for al vectors. The `shapes` library can currently output `geometry` or `svg`. The svg output is used in our current reports, rendered as svg on top of a blueprint jpg. The geometry output is used by the mobile app which created it’s own vectors with `react-native-svg`. (plain svg is not viable in React Native).

### Caveats
#### Coordinate system
PDF coordinate system is flipped relative to SVG coordinates. PDF has origin in the bottom-left corner whereas svg and React-Native has origin in the top-left corner.
#### SVG structure
Our current output from the `shapes` library is suitable for the current task of rendering one controlpoint at a time in a loop. In order to utilize a pdf library which is capable of parsing svg, we would need to rewrite `shapes` to output a complete svg file which only uses features that the library can handle.

## PDF libraries
There are not many good PDF libraries that can help us with what we need. This is what we need the library to do:
1. open or embedd existing pdfs
2. create pdf vectors
3. preferably parsing svg and translating automatically to pdf vectors
4. create clickable annotations

### PSPDFkit
[Complete PDF SDK, Fast Setup & Fully Supported](https://pspdfkit.com/)

PSPDFKit is an expensive library which we have implemented as a test in the mobile app. PSPDF is fast and really good at rendering existing PDF files. Our current use case is for creating “snippets”, i.e. annotated parts of a pdf which is exported as bitmap.

PSPDF is not very strong in “custom graphics”. All graphics in PSPDF is based on PDF annotations. Supported annotations are:
- highlight, a marker pen for text
- ink, freeform pencil drawings
- note, callout box with text
- text, plain text

The only way I can find to create custom graphics is with their geometry class, but the shape support is sparse and not enough to render our controlpoint graphics.
[Namespace: Geometry | API Reference | PSPDFKit for Web](https://pspdfkit.com/api/web/PSPDFKit.Geometry.html)

After delving into this, I’m quite confident that our competitors who use PSPDF will not be able to catch up with us in the graphics department. I think that both Dalux and PlanRadar are using PSPDFKit.

### PDFTron, now Apryse
[Document processing technology for developers | Formerly known as PDFTron](https://apryse.com/)

Similar to PSPDFKit. Built around PDFium. Very expensive and does not handle custom shapes in the way we need.

### ComPDFKit
Almost the same as PDFTron and PSPDFKit. Very expensive and lacking in geometry rendering.

### PDFKit
[PDFKit](https://pdfkit.org/)

PDFKit is an open source library, it has very strong functions for creating PDF files from scratch, even with advanced geometry such as our controlpoints.
[Vector Graphics in PDFKit](https://pdfkit.org/docs/vector.html)

Unfortunately PDFKit is only for creating new pdf files. There is noway to open or embed existing files, which makes this library unusable to us.

### PDF-LIB
[PDF-LIB ·  Create and modify PDF documents in any JavaScript environment.](https://pdf-lib.js.org/)

PDF-LIB is another open source library with strong geometry functions and also ability to embed external vector based pdfs.

The creator of PDF_KIT, Andrew Dillon, aka Hopding, has abandoned the project in late 2021. But with 6500 Github stars and 750,000 weekly downloads from NPM it’s safe to say that this library is well used.

There are some interesting forks of PDF-LIB. Most notably a fork from Cantoo. 
https://www.npmjs.com/package/@cantoo/pdf-lib
This fork has two objectives: 
1. maintain the library
2. add support for SVG

Cantoo is a French company producing teaching apps. I have had communication with the creator, **François Billed**, [Sharcoux - Overview](https://github.com/Sharcoux) at [Cantoo Scribe - L'essentiel pour l'inclusion scolaire](https://www.cantoo.fr/). They are using this fork in production and François has already been helpful in instructing me how to create clickable links.

I would say that this is by far our best choice of library. The licence is MIT which is very permissive and will not give us any licensing problems.
## HummusJS
[Home](https://github.com/galkahana/HummusJS/wiki)

HummusJS is a JS wrapper around the C++ library PDFHummus. We can probably do all that we want with this library, but it’s quite low level and we would need to produce hummus specific graphics commands instead of svg for drawing geometry.

Hummus is probably the most advanced library, but also most time consuming to work with.

I would say that Hummus is the second runner up behind pdf-lib. Actually pdf-lib and Hummus is the only two libraries that covers our use case.

## Proof of concept
I have created a proof of concept with PDF-LIB, it does seem veery promising. There will be some technicalities to solve, mainly with our SVG generating in the `shapes`lib.

The following code creates a PDF with the following features:
1. embedding an external vector pdf
2. adds text
3. adds a semi transparent red circle
4. adds svg graphics (blue rectangles at top left)
5. adds a clickable link (blue rectangle bottom left)
[[lab_pdflib.js|lab_pdflib.js]]<!-- {"embed":"true"} -->

Here is the pdf:
![[fc486ca3-e7dc-42ab-82ae-42776b1d9395.pdf|428]]

Here is another version of the PDF where the SVG is switched out for an actual PlanTrail flag. As said earlier on, our `shapes`  library needs some attention in order to produce compatible svg. But this proof of concept proves that it is possible.
[output 2.pdf](Blueprints%20with%20flags,%20using%20PDF%20instead%20of%20JPG/output%202.pdf)<!-- {"preview":"true","width":428,"embed":"true"} -->