const fs = require('fs-extra');
const path = require('path');
const assert = require('assert').strict;
const { migrate } = require('../index');

async function runTest() {
  try {
    console.log('Starting migration test...\n');

    // Set up test directories
    const sourcePath = path.join(__dirname, 'mock-bear-export');
    const destPath = path.join(__dirname, 'mock-obsidian-vault');

    // Clean up previous test results if they exist
    await fs.remove(destPath);

    // Run migration
    await migrate(sourcePath, destPath);

    // Verify results
    console.log('\nVerifying migration results...');

    // 1. Check if attachments directory was created
    const attachmentsDir = path.join(destPath, 'attachments');
    const attachmentsExist = await fs.pathExists(attachmentsDir);
    assert.ok(attachmentsExist, 'Attachments directory should exist');

    // 2. Check if all attachments were copied
    const attachments = await fs.readdir(attachmentsDir);
    console.log('\nAttachments in destination:');
    attachments.forEach((file) => console.log(`- ${file}`));

    // Verify that files with same names got different hashes
    const image1Files = attachments.filter((f) => f.startsWith('image1-'));
    const documentFiles = attachments.filter((f) => f.startsWith('document-'));

    assert.strictEqual(
      image1Files.length,
      2,
      'Should have two image1 files with different hashes'
    );
    assert.strictEqual(
      documentFiles.length,
      2,
      'Should have two document files with different hashes'
    );

    // 3. Verify duplicate attachments handling
    const duplicatesContent = await fs.readFile(
      path.join(destPath, 'Test Duplicate Attachments.md'),
      'utf8'
    );
    console.log('\nTransformed duplicates content:');
    console.log(duplicatesContent);

    // Each image1.png reference should have a different hash
    const image1Refs = duplicatesContent.match(
      /![\[]{2}image1-[a-f0-9]{8}\.png/g
    );
    assert.ok(
      image1Refs && image1Refs.length === 2,
      'Should have two image1 references'
    );
    assert.notStrictEqual(
      image1Refs[0],
      image1Refs[1],
      'Image references should have different hashes'
    );

    // Each document.pdf reference should have a different hash
    const documentRefs = duplicatesContent.match(
      /![\[]{2}document-[a-f0-9]{8}\.pdf/g
    );
    assert.ok(
      documentRefs && documentRefs.length === 2,
      'Should have two document references'
    );
    assert.notStrictEqual(
      documentRefs[0],
      documentRefs[1],
      'Document references should have different hashes'
    );

    // 4. Verify remote PDF handling
    const linksContent = await fs.readFile(
      path.join(destPath, 'Test Links.md'),
      'utf8'
    );
    console.log('\nTransformed links content:');
    console.log(linksContent);

    // Check that remote PDF links are preserved
    assert.ok(
      linksContent.includes('https://www.skanska.se'),
      'Remote PDF links should be preserved'
    );
    assert.ok(
      linksContent.includes('http://example.com/files/document.pdf'),
      'Remote PDF links should be preserved'
    );

    // Check that local PDFs are converted to wikilinks with hash
    assert.ok(
      linksContent.match(/![\[]{2}document-[a-f0-9]{8}\.pdf[\]]{2}/),
      'Local PDFs should be converted to wikilinks with hash'
    );

    // Check that Bear remarks are removed from remote PDFs
    assert.ok(
      !linksContent.includes('<!-- {"preview":"true","embed":"true"} -->'),
      'Bear remarks should be removed from remote PDFs'
    );

    // 5. Verify table formatting
    const tablesContent = await fs.readFile(
      path.join(destPath, 'Test Tables.md'),
      'utf8'
    );

    // Check for empty lines around tables
    const tableLines = tablesContent.split('\n');
    let inTable = false;
    let tableEndIndex = -1;

    for (let i = 0; i < tableLines.length; i++) {
      const line = tableLines[i].trim();

      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          // Starting a new table, check for empty line before
          assert.ok(
            i === 0 || tableLines[i - 1].trim() === '',
            `Table at line ${i + 1} should have empty line before`
          );
          inTable = true;
        }
        tableEndIndex = i;
      } else if (inTable) {
        // Check if we've moved past the table
        if (!line.startsWith('|')) {
          inTable = false;
          // Skip empty line check if next line is an image
          if (!line.startsWith('![[') && !line.startsWith('![](')) {
            // Check for empty line after table
            assert.ok(
              line === '',
              `Table ending at line ${
                tableEndIndex + 1
              } should have empty line after`
            );
          }
        }
      }
    }

    // 6. Verify other transformations still work
    const renamedContent = await fs.readFile(
      path.join(destPath, 'Different Title Than Filename.md'),
      'utf8'
    );
    const note2Content = await fs.readFile(
      path.join(destPath, 'Second Note.md'),
      'utf8'
    );

    // Verify wikilink transformations and reference updates
    assert.ok(
      note2Content.includes('[[Different Title Than Filename|'),
      'References should be updated to use new filename'
    );
    assert.ok(
      renamedContent.includes('![['),
      'Image links should be converted to wikilinks'
    );

    console.log('\nTest completed successfully!');
    console.log('\nMigrated files are in:', destPath);
  } catch (error) {
    console.error('\nTest failed:', error);
    process.exit(1);
  }
}

// Run the test
runTest();
