const path = require('path');

/**
 * Safely decodes a URI component, handling special cases
 * @param {string} str The string to decode
 * @returns {string} Decoded string
 */
function safeDecodeURIComponent(str) {
  try {
    // First handle special case of %07B
    let decoded = str.replace(/%07B/g, ''); // Remove %07B entirely
    // Then handle other special characters
    decoded = decoded.replace(/%20/g, ' '); // Handle spaces explicitly
    // Then decode the rest
    decoded = decodeURIComponent(decoded);
    return decoded;
  } catch (error) {
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
 * Creates a key for filename mapping, preserving case
 * @param {string} originalPath Original file path
 * @returns {string} Key for mapping
 */
function createMappingKey(originalPath) {
  const decodedPath = safeDecodeURIComponent(originalPath);
  const fullPath = path.normalize(decodedPath);

  // Split path and filter out empty parts, but preserve case
  const pathParts = fullPath.split(path.sep).filter((part) => part !== '');

  return pathParts.join('/');
}

/**
 * Gets the UUID filename for a path from the attachment map
 * @param {string} originalPath Original file path
 * @param {Map<string, string>} attachmentMap Map of original paths to UUID filenames (including extensions)
 * @returns {string} UUID filename if found (including extension), otherwise original filename
 */
function getUUIDFilename(originalPath, attachmentMap) {
  const key = createMappingKey(originalPath);
  const uuidFilename = attachmentMap.get(key);
  return uuidFilename || path.basename(originalPath);
}

/**
 * Checks if a file has a specific extension (case-insensitive)
 * @param {string} filename The filename to check
 * @param {string} extension The extension to check for (with or without dot)
 * @returns {boolean} True if the file has the specified extension
 */
function hasExtension(filename, extension) {
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  return filename.toLowerCase().endsWith(ext.toLowerCase());
}

/**
 * Transforms Bear markdown to Obsidian format
 * @param {string} content The markdown content
 * @param {Map<string, string>} attachmentMap Map of original paths to UUID filenames (including extensions)
 * @param {Map<string, string>} renamedFiles Map of original note filenames to new filenames
 * @returns {string} Transformed markdown content
 */
function transformMarkdown(content, attachmentMap, renamedFiles = new Map()) {
  // Format blockquotes (do this first to handle original content structure)
  content = formatBlockquotes(content);

  // Format tables with proper spacing
  content = formatTables(content);

  // Transform image tags with size parameters
  content = transformImageTags(content, attachmentMap);

  // Remove PDF remarks and transform PDF links
  content = transformPdfLinks(content, attachmentMap);

  // Convert regular links to wikilinks
  content = convertToWikilinks(content, renamedFiles);

  return content;
}

/**
 * Formats blockquotes by converting implicit responses to second-level quotes
 * @param {string} content The markdown content
 * @returns {string} Content with properly formatted blockquotes
 */
function formatBlockquotes(content) {
  // Skip blockquote handling as requested
  return content;
}

/**
 * Formats markdown tables by ensuring they have empty lines before and after
 * @param {string} content The markdown content
 * @returns {string} Content with properly formatted tables
 */
function formatTables(content) {
  // Split content into lines for processing
  let lines = content.split('\n');
  let inTable = false;
  let tableStartIndex = -1;
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const isTableLine = isPartOfTable(trimmedLine);

    if (isTableLine && !inTable) {
      // Starting a new table
      inTable = true;
      tableStartIndex = result.length;

      // Add empty line before table if not already present
      if (tableStartIndex > 0 && result[tableStartIndex - 1].trim() !== '') {
        result.push('');
        tableStartIndex++;
      }
    }

    result.push(line);

    if (inTable && !isTableLine) {
      // Table has ended
      inTable = false;

      // Check if the current line is an image
      const isImage =
        trimmedLine.startsWith('![[') || trimmedLine.startsWith('![](');

      // Add empty line after table if:
      // 1. The current line is not empty AND
      // 2. The current line is not an image
      if (trimmedLine !== '' && !isImage) {
        result.splice(result.length - 1, 0, '');
      }
    }
  }

  // Handle case where table is at the end of the content
  if (inTable && result[result.length - 1].trim() !== '') {
    result.push('');
  }

  return result.join('\n');
}

/**
 * Checks if a line is part of a markdown table
 * @param {string} line The line to check
 * @returns {boolean} True if the line is part of a table
 */
function isPartOfTable(line) {
  // Skip empty lines
  if (!line) return false;

  // Match table header/content lines (|col1|col2|) and separator lines (|---|---|)
  return (
    (line.startsWith('|') && line.endsWith('|')) ||
    (line.startsWith('|') && line.includes('|-')) ||
    line.match(/^\|[\s-|]*\|$/)
  ); // More precise separator line detection
}

/**
 * Transforms Bear image tags to Obsidian wikilink format
 * @param {string} content The markdown content
 * @param {Map<string, string>} attachmentMap Map of original paths to UUID filenames (including extensions)
 * @returns {string} Content with transformed image tags
 */
function transformImageTags(content, attachmentMap) {
  // First, handle existing Obsidian wikilinks
  content = content.replace(
    /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (match, filename, width) => {
      // Create a lookup key from the filename
      const basename = path.basename(filename);

      // Try to find the UUID filename by looking up the original filename
      for (const [key, value] of attachmentMap.entries()) {
        if (path.basename(key) === basename || value === basename) {
          // If width was specified, preserve it
          return width ? `![[${value}|${width}]]` : `![[${value}]]`;
        }
      }
      return match; // If no mapping found, keep original
    }
  );

  // Then handle Bear-style image tags
  content = content.replace(
    /!\[.*?\]\(([^)]+)\)(?:<!-- *({[^}]+}) *-->)?/g,
    (match, imagePath, jsonPart) => {
      // Skip if it's a PDF file (case-insensitive)
      if (hasExtension(imagePath, '.pdf')) {
        return match;
      }

      let width;
      try {
        // Parse the JSON to get the width if it exists
        if (jsonPart) {
          const jsonStr = jsonPart.replace(/&quot;/g, '"');
          const config = JSON.parse(jsonStr);
          width = config.width;
        }
      } catch (error) {
        console.warn(`Warning: Could not parse image tag: ${match}`);
      }

      // Get the UUID filename
      const decodedPath = safeDecodeURIComponent(imagePath);
      const basename = path.basename(decodedPath);
      const parentDir = path.basename(path.dirname(decodedPath));
      const key = `${parentDir}/${basename}`;

      // Try to find the UUID filename
      let uuidFilename = attachmentMap.get(key);

      // Create Obsidian wikilink with UUID filename
      if (width) {
        return `![[${uuidFilename || basename}|${width}]]`;
      } else {
        return `![[${uuidFilename || basename}]]`;
      }
    }
  );

  return content;
}

/**
 * Transforms PDF links and removes Bear-specific remarks
 * @param {string} content The markdown content
 * @param {Map<string, string>} attachmentMap Map of original paths to UUID filenames (including extensions)
 * @returns {string} Content with transformed PDF links
 */
function transformPdfLinks(content, attachmentMap) {
  // Handle PDF links with remarks and optional width
  content = content.replace(
    /\[([^\]]+)\]\(([^)]+\.(?:pdf|PDF))\)(?:<!-- *({[^}]+}) *-->)?/g,
    (match, text, pdfPath, jsonPart) => {
      // Skip remote PDFs
      if (pdfPath.match(/^https?:\/\//)) {
        return match.replace(/<!-- *{[^}]+} *-->/, ''); // Remove remarks but keep link
      }

      // Get the UUID filename
      const decodedPath = safeDecodeURIComponent(pdfPath);
      const basename = path.basename(decodedPath);
      const parentDir = path.basename(path.dirname(decodedPath));
      const key = `${parentDir}/${basename}`;
      const uuidFilename = attachmentMap.get(key);

      // If no UUID found, return the original link
      if (!uuidFilename) {
        return match;
      }

      // Determine width if specified
      let width;
      try {
        if (jsonPart) {
          const jsonStr = jsonPart.replace(/&quot;/g, '"');
          const config = JSON.parse(jsonStr);
          width = config.width;
        }
      } catch (error) {
        console.warn(`Warning: Could not parse PDF link config: ${match}`);
      }

      // Create wikilink with optional width
      if (width) {
        return `![[${uuidFilename}|${width}]]`;
      } else {
        return `![[${uuidFilename}]]`;
      }
    }
  );

  return content;
}

/**
 * Converts regular markdown links to wikilinks
 * @param {string} content The markdown content
 * @param {Map<string, string>} renamedFiles Map of original filenames to new filenames
 * @returns {string} Content with converted links
 */
function convertToWikilinks(content, renamedFiles) {
  // Match markdown links: [text](path)
  return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, link) => {
    // Skip external links (http, https, etc.)
    if (link.match(/^[a-zA-Z]+:\/\//)) {
      return match;
    }

    // Skip PDF files as they're handled separately (case-insensitive)
    if (hasExtension(link, '.pdf')) {
      return match;
    }

    // Get the filename from the path
    const filename = path.basename(link);

    // Check if this file was renamed
    let displayName = filename;
    if (filename.endsWith('.md')) {
      // Remove .md extension
      const nameWithoutExt = filename.slice(0, -3);
      // Check if the file was renamed
      const newName = renamedFiles.get(filename);
      displayName = newName ? newName.slice(0, -3) : nameWithoutExt;
    }

    // If the link text is the same as the filename (without extension),
    // we can use the simpler wikilink format
    const filenameWithoutExt = displayName.replace(/\.[^/.]+$/, '');
    if (text === filenameWithoutExt) {
      return `[[${displayName}]]`;
    }

    // Otherwise, use the format with alternate text
    return `[[${displayName}|${text}]]`;
  });
}

module.exports = {
  transformMarkdown,
  transformImageTags,
  transformPdfLinks,
  convertToWikilinks,
  formatTables,
  formatBlockquotes,
};
