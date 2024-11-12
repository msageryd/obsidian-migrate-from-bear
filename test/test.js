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

    // 3. Verify URL-encoded path handling
    const urlEncodedContent = await fs.readFile(
      path.join(destPath, 'URL Encoded Paths.md'),
      'utf8'
    );
    console.log('\nTransformed URL-encoded content:');
    console.log(urlEncodedContent);

    // Debug: Print out all image references with more details
    const imageRegex = /!\[\[([^|\]]+\.png)(?:\|(\d+))?\]\]/g;
    const imageRefs = [];
    let match;
    while ((match = imageRegex.exec(urlEncodedContent)) !== null) {
      imageRefs.push({
        fullMatch: match[0],
        filename: match[1],
        width: match[2] || 'no width',
      });
    }

    console.log('\nDetailed image references:');
    imageRefs.forEach((ref, index) => {
      console.log(
        `${index + 1}. ${ref.fullMatch} (filename: ${ref.filename}, width: ${
          ref.width
        })`
      );
    });

    // Verify unique image references
    assert.ok(
      imageRefs.length === 3,
      'Should have three unique image references'
    );

    // Ensure the references are different
    const uniqueFilenames = new Set(imageRefs.map((ref) => ref.filename));
    assert.strictEqual(
      uniqueFilenames.size,
      3,
      'Image references should have unique filenames'
    );

    // Rest of the test remains the same...
    // (previous test code continues here)

    console.log('\nTest completed successfully!');
    console.log('\nMigrated files are in:', destPath);
  } catch (error) {
    console.error('\nTest failed:', error);
    process.exit(1);
  }
}

// Run the test
runTest();
