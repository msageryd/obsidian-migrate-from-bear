#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { transformMarkdown } = require('./src/markdownTransformer');
const AttachmentHandler = require('./src/attachmentHandler');
const TitleHandler = require('./src/titleHandler');

// Configuration and constants
const OBSIDIAN_ATTACHMENTS_DIR = 'attachments'; // Default Obsidian attachments directory name

async function validatePaths(sourcePath, destPath) {
  try {
    const sourceStats = await fs.stat(sourcePath);
    if (!sourceStats.isDirectory()) {
      throw new Error('Source path must be a directory');
    }

    // Create destination if it doesn't exist
    await fs.ensureDir(destPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Source directory does not exist');
    }
    throw error;
  }
}

async function processAttachments(sourcePath, destPath) {
  const destAttachmentsPath = path.join(destPath, OBSIDIAN_ATTACHMENTS_DIR);
  await fs.ensureDir(destAttachmentsPath);

  console.log('Processing attachments...');
  const handler = new AttachmentHandler(sourcePath, destAttachmentsPath);
  const attachmentMap = await handler.processAttachments();

  console.log(`Processed ${attachmentMap.size} attachments`);
  return attachmentMap;
}

async function copyAndProcessNotes(sourcePath, destPath, attachmentMap) {
  console.log('Processing notes...');
  let processedCount = 0;
  const titleHandler = new TitleHandler();

  // First pass: Process all notes to determine filename changes
  const notesMap = new Map(); // Store file paths and their content
  const processDir = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await processDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf8');
        notesMap.set(fullPath, content);

        // Process title and get new filename
        await titleHandler.processNote(fullPath, content);
      }
    }
  };

  await processDir(sourcePath);

  // Second pass: Write files with updated references
  for (const [sourcefile, content] of notesMap.entries()) {
    try {
      // Calculate relative destination path
      const relativePath = path.relative(sourcePath, sourcefile);
      const originalFilename = path.basename(relativePath);
      const renamedFiles = titleHandler.getRenamedFiles();
      const newFilename =
        renamedFiles.get(originalFilename) || originalFilename;
      const destFile = path.join(
        destPath,
        path.dirname(relativePath),
        newFilename
      );

      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(destFile));

      // Transform content with attachment UUID mappings and renamed files
      const transformedContent = transformMarkdown(
        content,
        attachmentMap,
        renamedFiles
      );

      // Write transformed content
      await fs.writeFile(destFile, transformedContent, {
        encoding: 'utf8',
        flag: 'w',
      });

      // Preserve timestamps
      const stats = await fs.stat(sourcefile);
      await fs.utimes(destFile, stats.atime, stats.mtime);

      processedCount++;

      // Log filename changes
      if (newFilename !== originalFilename) {
        console.log(`Renamed: ${originalFilename} → ${newFilename}`);
      }
    } catch (error) {
      console.error(`Error processing file ${sourcefile}:`, error.message);
    }
  }

  console.log(`Processed ${processedCount} markdown files`);
  const renamedCount = titleHandler.getRenamedFiles().size;
  if (renamedCount > 0) {
    console.log(`Renamed ${renamedCount} files to match their H1 titles`);
  }
}

async function migrate(sourcePath, destPath) {
  try {
    console.log('Starting migration...');
    console.log(`Source: ${sourcePath}`);
    console.log(`Destination: ${destPath}`);

    // Validate paths
    await validatePaths(sourcePath, destPath);

    // Process attachments first to get UUID mapping
    const attachmentMap = await processAttachments(sourcePath, destPath);

    // Process and copy notes using the attachment UUID mapping
    await copyAndProcessNotes(sourcePath, destPath, attachmentMap);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Command line argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error('Usage: node index.js <source-path> <destination-path>');
    process.exit(1);
  }
  return {
    sourcePath: path.resolve(args[0]),
    destPath: path.resolve(args[1]),
  };
}

// Main execution
if (require.main === module) {
  const { sourcePath, destPath } = parseArgs();
  migrate(sourcePath, destPath);
}

module.exports = {
  migrate,
  validatePaths,
  processAttachments,
  copyAndProcessNotes,
};
