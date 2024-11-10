const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

/**
 * Handles attachment file operations and naming
 */
class AttachmentHandler {
  constructor(sourceDir, destDir) {
    this.sourceDir = sourceDir;
    this.destDir = destDir;
    this.processedFiles = new Map(); // Track original path to new filename mappings
  }

  /**
   * Generates a unique filename for an attachment by always adding a content hash
   * @param {string} originalPath Original file path
   * @returns {string} Unique filename with hash
   */
  async generateUniqueFilename(originalPath) {
    const ext = path.extname(originalPath);
    const nameWithoutExt = path.basename(originalPath, ext);

    // Generate hash based on file content
    const content = await fs.readFile(originalPath);
    const hash = crypto
      .createHash('md5')
      .update(content)
      .digest('hex')
      .slice(0, 8);

    // Always include the hash to ensure uniqueness
    const newName = `${nameWithoutExt}-${hash}${ext}`;

    return newName;
  }

  /**
   * Copies an attachment file to the destination with a unique name
   * @param {string} sourcePath Source file path
   * @returns {string} New filename in destination
   */
  async copyAttachment(sourcePath) {
    const newFilename = await this.generateUniqueFilename(sourcePath);
    const destPath = path.join(this.destDir, newFilename);

    await fs.copy(sourcePath, destPath, {
      preserveTimestamps: true,
      errorOnExist: false,
    });

    // Store the mapping from original path to new filename
    this.processedFiles.set(sourcePath, newFilename);

    return newFilename;
  }

  /**
   * Processes all attachments in the Bear export
   * @returns {Map<string, string>} Map of original paths to new filenames
   */
  async processAttachments() {
    // Recursively find all files in source directory
    const processDir = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await processDir(fullPath);
        } else if (!entry.name.endsWith('.md')) {
          // Skip markdown files
          await this.copyAttachment(fullPath);
        }
      }
    };

    await processDir(this.sourceDir);
    return this.processedFiles;
  }

  /**
   * Gets the new filename for a given original path
   * @param {string} originalPath Original file path
   * @returns {string|undefined} New filename if found
   */
  getNewFilename(originalPath) {
    return this.processedFiles.get(originalPath);
  }
}

module.exports = AttachmentHandler;
