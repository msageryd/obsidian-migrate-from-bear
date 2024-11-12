const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Normalizes a filename for safe storage and lookup
 * @param {string} filename The filename to normalize
 * @returns {string} Normalized filename
 */
function normalizeFilename(filename) {
  // Decode URI components first
  const decodedFilename = safeDecodeURIComponent(filename);

  // Remove or replace problematic characters
  return decodedFilename
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_+/g, '_') // Collapse multiple underscores
    .toLowerCase(); // Convert to lowercase for case-insensitive comparison
}

/**
 * Safely decodes a URI component, handling special cases
 * @param {string} str The string to decode
 * @returns {string} Decoded string
 */
function safeDecodeURIComponent(str) {
  console.log('Decoding:', str);
  try {
    // First handle special case of %07B
    let decoded = str.replace(/%07B/g, ''); // Remove %07B entirely
    console.log('After %07B:', decoded);
    // Then handle other special characters
    decoded = decoded.replace(/%20/g, ' '); // Handle spaces explicitly
    console.log('After %20:', decoded);
    // Then decode the rest
    decoded = decodeURIComponent(decoded);
    console.log('After decodeURIComponent:', decoded);
    return decoded;
  } catch (error) {
    console.log('Error decoding:', error);
    try {
      // Try decoding parts separately
      return str
        .split('/')
        .map((part) => {
          try {
            // Handle %07B in each part
            part = part.replace(/%07B/g, '');
            return decodeURIComponent(part);
          } catch (e) {
            return part;
          }
        })
        .join('/');
    } catch (e) {
      return str;
    }
  }
}

/**
 * Creates a normalized key for filename mapping
 * @param {string} originalPath Original file path
 * @returns {string} Normalized key for mapping
 */
function createMappingKey(originalPath) {
  console.log('Creating key for:', originalPath);
  const decodedPath = safeDecodeURIComponent(originalPath);
  console.log('Decoded path:', decodedPath);
  const fullPath = path.normalize(decodedPath);
  console.log('Full path:', fullPath);
  const relativePath = path.relative(this.sourceDir, fullPath);
  console.log('Relative path:', relativePath);

  // Normalize all parts of the path
  const pathParts = relativePath
    .split(path.sep)
    .map(normalizeFilename) // This will convert to lowercase
    .filter((part) => part !== '');

  const key = pathParts.join('/');
  console.log('Created key:', key);
  return key;
}

/**
 * Handles attachment file operations and naming
 */
class AttachmentHandler {
  constructor(sourceDir, destDir) {
    this.sourceDir = sourceDir;
    this.destDir = destDir;
    this.attachmentMap = new Map(); // Map original filenames to UUIDs
  }

  /**
   * Generates a unique filename for an attachment using UUID
   * @param {string} originalPath Original file path
   * @returns {string} Unique filename
   */
  async generateUniqueFilename(originalPath) {
    // Keep original extension case but use lowercase for comparison
    const ext = path.extname(originalPath);
    const uuid = uuidv4();
    return `${uuid}${ext}`;
  }

  /**
   * Safely encodes a URI component, handling invalid characters
   * @param {string} str The string to encode
   * @returns {string} Encoded string
   */
  safeEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  /**
   * Stores the original filename and its UUID mapping
   * @param {string} originalPath Original file path
   * @param {string} newFilename New UUID filename (including extension)
   */
  storeFilenameMapping(originalPath, newFilename) {
    console.log('Storing mapping for:', originalPath);
    const key = createMappingKey.call(this, originalPath);
    console.log('Using key:', key);
    console.log('With UUID:', newFilename);
    this.attachmentMap.set(key, newFilename);

    // Also store with lowercase extension for case-insensitive lookup
    const lowercaseKey = key.toLowerCase();
    if (lowercaseKey !== key) {
      this.attachmentMap.set(lowercaseKey, newFilename);
    }
  }

  /**
   * Copies an attachment file to the destination with a unique UUID filename
   * @param {string} sourcePath Source file path
   * @returns {string} New UUID filename in destination (including extension)
   */
  async copyAttachment(sourcePath) {
    console.log('Copying attachment:', sourcePath);
    const newFilename = await this.generateUniqueFilename(sourcePath);
    const destPath = path.join(this.destDir, newFilename);

    await fs.copy(sourcePath, destPath, {
      preserveTimestamps: true,
      errorOnExist: false,
    });

    // Store the filename mapping
    this.storeFilenameMapping(sourcePath, newFilename);

    return newFilename;
  }

  /**
   * Processes all attachments in the Bear export
   * @returns {Map<string, string>} Map of original paths to UUID filenames (including extensions)
   */
  async processAttachments() {
    // Recursively find all files in source directory
    const processDir = async (dir) => {
      console.log('Processing directory:', dir);
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        console.log('Found entry:', fullPath);

        if (entry.isDirectory()) {
          await processDir(fullPath);
        } else if (!entry.name.endsWith('.md')) {
          // Skip markdown files
          await this.copyAttachment(fullPath);
        }
      }
    };

    await processDir(this.sourceDir);
    console.log(
      'Final attachment map:',
      Object.fromEntries(this.attachmentMap)
    );
    return this.attachmentMap;
  }

  /**
   * Gets the UUID filename for a given original path
   * @param {string} originalPath Original file path
   * @returns {string|undefined} UUID filename if found (including extension)
   */
  getUUIDFilename(originalPath) {
    console.log('Getting UUID for:', originalPath);
    // Try exact match first
    const key = createMappingKey.call(this, originalPath);
    console.log('Looking up key:', key);
    let uuidFilename = this.attachmentMap.get(key);
    console.log('Found UUID:', uuidFilename);

    // If not found, try lowercase key
    if (!uuidFilename) {
      const lowercaseKey = key.toLowerCase();
      uuidFilename = this.attachmentMap.get(lowercaseKey);
      console.log('Found UUID (lowercase):', uuidFilename);
    }

    return uuidFilename;
  }
}

module.exports = AttachmentHandler;
