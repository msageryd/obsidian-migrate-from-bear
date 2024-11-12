const fs = require('fs').promises;
const { PDFDocument, rgb, PDFString, PDFName } = require('@cantoo/pdf-lib');

async function createSpecialPage() {
  try {
    // Create a new PDF document
    const doc = await PDFDocument.create();

    // Set the page size to A3 landscape
    const page = doc.addPage([1190.55, 841.89]); // A3 dimensions in points

    // Load and add vector-based CAD PDF as background
    await addBackgroundPDF(doc, page, './blueprint_fill.pdf');

    // Add SVG-like content
    addHeader(page);
    addOverlay(page);
    addSvg(page);
    addLink(doc, page);

    // Save the PDF
    const pdfBytes = await doc.save();
    await fs.writeFile('output.pdf', pdfBytes);

    console.log('PDF created successfully!');
  } catch (error) {
    console.error('Error in createSpecialPage:', error);
  }
}

async function addBackgroundPDF(doc, page, backgroundPath) {
  try {
    console.log('Loading background PDF from:', backgroundPath);
    const backgroundPdfBytes = await fs.readFile(backgroundPath);
    console.log(
      'Background PDF loaded, size:',
      backgroundPdfBytes.length,
      'bytes'
    );

    const [embeddedPage] = await doc.embedPdf(backgroundPdfBytes);
    console.log('Background PDF embedded successfully');

    const { width, height } = embeddedPage.size();
    console.log('Background page size:', width, 'x', height);

    const scale = Math.min(page.getWidth() / width, page.getHeight() / height);
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const x = (page.getWidth() - scaledWidth) / 2;
    const y = (page.getHeight() - scaledHeight) / 2;

    console.log('Drawing background page with parameters:', {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });

    page.drawPage(embeddedPage, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });

    console.log('Background PDF added successfully');
  } catch (error) {
    console.error('Error in addBackgroundPDF:', error);
    throw error;
  }
}

function addHeader(page) {
  page.drawText('Header Text', {
    x: 50,
    y: page.getHeight() - 50,
    size: 30,
    color: rgb(0, 0, 0),
  });
}

function addOverlay(page) {
  page.drawCircle({
    x: page.getWidth() / 2,
    y: page.getHeight() / 2,
    radius: 100,
    color: rgb(1, 0, 0),
    opacity: 0.5,
  });
}

function addLink(doc, page) {
  const link = createPageLinkAnnotation({
    page,
    uri: 'https://pdf-lib.js.org/',
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    isDebug: true,
  });
  page.node.set(PDFName.of('Annots'), doc.context.obj([link]));
}

function addSvg(page) {
  svg = `<svg width="100" height="100">
    <rect y="0" x="0" width="100" height="100" fill="none" stroke="black"/>
    <rect y="25" x="25" width="50" height="50" fill="blue"/>
  </svg>`;

  page.moveTo(0, 840);
  page.drawSvg(svg);
}

const createPageLinkAnnotation = ({ page, uri, x, y, w, h, isDebug }) =>
  page.doc.context.register(
    page.doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [x, y, x + w, y + h],
      Border: [0, 0, isDebug ? 1 : 0],
      C: [0, 0, 1],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(uri),
      },
    })
  );

createSpecialPage().catch(console.error);
