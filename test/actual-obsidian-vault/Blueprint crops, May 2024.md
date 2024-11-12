# Blueprint crops, May 2024
## Background
Blueprint crops are currently used in reports and in “share controlpoint”-emails.
![[37b3afa3-8664-4664-abb3-6dc493be8021.png]]

The crops are produced in different ways depending on the use case:
### Crops for emails
Html emails can technically include SVG graphics as well as embedded images, but both of these concepts increase the risk dramatically for being spam classed. Our solution to this is to render a special “blueprint crop” report in JSReport. This report renders a cropped blueprint image with an SVG controlpoint on top,. The output format for the report is jpg, i.e. we merge the blueprint with the SVG into a new jpg.

The merged jpg is saved at S3 and referenced from the email, rather than embedded in the email.

### Crops for PDF reports
In PDF reports we can safely embed SVG graphics. This is preferable since the resolution will be infinite if the reader zooms into the pdf page.

We currently use blueprints in jpg format as backdrop for the SVG shapes. This is not optimal since jpgs cannot be zoomed without pixelation.

The way we crop the blueprint for this use case is to specify a viewBox, i.e. a looking-glass for the area of interest. As it turns out this is not a great idea (nowadays) since the actual complete blueprint file is embedded in the PDF in spite of the fact that most of the PDF is invisible.

A regular blueprint jpg is about 0.5 to 1.5 MB in size, depending on resolution and compression. This adds upp quickly is many blueprint crops is to be rendered in a report.
## Solutions to investigate
### Pre-cropping
The only safe solution to the size problem is to crop each “blueprint crop” for real and save the cropped jpg files somewhere for JSreport to reach them. If we crop the files with `sharp` this will probably be quite fast.

We have to decide when and how the cropping should occur: 
- on a need-to-crop-basis, i.e. api calls for each image directly from JSReport upon rendering the report
- or a queued based approach where all crop-needs are calculated ahead and put in a crop queue for the worker server to process.
### Reusing resources multiple times in the same PDF
The best solution would be if a resource (image or pdf) could be embedded once in the PDF and then references from different places with different viewbox for crops.

This solution would be optimal, but it might not be possible.

#### Using CSS background images
By dynamically creating a css class for each blueprint where the image is `background-image`, these classes can then be used on all places where the image should be used.

## PDF as blueprint backdrop
When we venture into solving the cropping problem we should also invest some time into figuring out if PDF files could be used instead of jpg files. Since the internal launch of our blueprint import functionality, we have saved both the jpg version and the original PDF version of blueprints.