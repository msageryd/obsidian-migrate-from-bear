const path = require('path');

/**
 * Transforms Bear markdown to Obsidian format
 * @param {string} content The markdown content to transform
 * @param {Map<string, string>} attachmentMap Map of original paths to new filenames
 * @returns {string} Transformed markdown content
 */
function transformMarkdown(content, attachmentMap) {
  // Format blockquotes (do this first to handle original content structure)
  content = formatBlockquotes(content);

  // Format tables with proper spacing
  content = formatTables(content);

  // Transform image tags with size parameters
  content = transformImageTags(content, attachmentMap);

  // Remove PDF remarks and transform PDF links
  content = transformPdfLinks(content, attachmentMap);

  // Convert regular links to wikilinks
  content = convertToWikilinks(content);

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
 * Gets the new filename for a path from the attachment map
 * @param {string} originalPath Original file path
 * @param {Map<string, string>} attachmentMap Map of original paths to new filenames
 * @returns {string} New filename if found, otherwise original filename
 */
function getNewFilename(originalPath, attachmentMap) {
  // Normalize the path
  const normalizedPath = path.normalize(originalPath);
  const basename = path.basename(normalizedPath);

  // Try to find the exact file by traversing up the directory structure
  let currentPath = normalizedPath;
  while (currentPath !== '.') {
    // Check each entry in the map
    for (const [mapPath, newName] of attachmentMap.entries()) {
      if (mapPath.endsWith(currentPath)) {
        return newName;
      }
    }
    // Move up one directory
    currentPath = path.normalize(path.join(currentPath, '..'));
  }

  // If no match found by path, try matching just the basename as a fallback
  const matchingPaths = Array.from(attachmentMap.entries()).filter(
    ([origPath]) => path.basename(origPath) === basename
  );

  if (matchingPaths.length === 1) {
    return matchingPaths[0][1];
  }

  // If multiple matches found, try to find the best match based on directory structure
  if (matchingPaths.length > 1) {
    const pathParts = normalizedPath.split(path.sep);
    for (const [origPath, newName] of matchingPaths) {
      const origParts = origPath.split(path.sep);
      // Check if the path contains matching directory names
      if (pathParts.some((part) => origParts.includes(part))) {
        return newName;
      }
    }
    // If no better match found, use the first one
    return matchingPaths[0][1];
  }

  // If no match found at all, return the original basename
  return basename;
}

/**
 * Transforms Bear image tags to Obsidian wikilink format
 * @param {string} content The markdown content
 * @param {Map<string, string>} attachmentMap Map of original paths to new filenames
 * @returns {string} Content with transformed image tags
 */
function transformImageTags(content, attachmentMap) {
  // Handle images with size parameters
  content = content.replace(
    /!\[\]\(([^)]+)\)<!-- *({[^}]+}) *-->/g,
    (match, imagePath, jsonPart) => {
      // Skip if it's a PDF file
      if (imagePath.toLowerCase().endsWith('.pdf')) {
        return match;
      }

      try {
        // Parse the JSON to get the width
        const jsonStr = jsonPart.replace(/&quot;/g, '"');
        const config = JSON.parse(jsonStr);

        // Get the new filename with hash
        const decodedPath = decodeURIComponent(imagePath);
        const newFilename = getNewFilename(decodedPath, attachmentMap);

        // Create Obsidian wikilink with size if width is specified
        if (config.width) {
          return `![[${newFilename}|${config.width}]]`;
        } else {
          return `![[${newFilename}]]`;
        }
      } catch (error) {
        console.warn(`Warning: Could not parse image tag: ${match}`);
        return match;
      }
    }
  );

  // Handle regular images without size parameters
  content = content.replace(/!\[\]\(([^)]+)\)/g, (match, imagePath) => {
    // Skip if it's already been transformed to a wikilink
    if (imagePath.includes('[[')) {
      return match;
    }

    // Get the new filename with hash
    const decodedPath = decodeURIComponent(imagePath);
    const newFilename = getNewFilename(decodedPath, attachmentMap);
    return `![[${newFilename}]]`;
  });

  return content;
}

/**
 * Transforms PDF links and removes Bear-specific remarks
 * @param {string} content The markdown content
 * @param {Map<string, string>} attachmentMap Map of original paths to new filenames
 * @returns {string} Content with transformed PDF links
 */
function transformPdfLinks(content, attachmentMap) {
  // Handle PDF links with remarks
  content = content.replace(
    /\[([^\]]+)\]\(([^)]+\.pdf)\)<!-- *{[^}]+} *-->/g,
    (match, text, pdfPath) => {
      // Skip remote PDFs
      if (pdfPath.match(/^https?:\/\//)) {
        return match.replace(/<!-- *{[^}]+} *-->/, ''); // Remove remarks but keep link
      }

      const decodedPath = decodeURIComponent(pdfPath);
      const newFilename = getNewFilename(decodedPath, attachmentMap);

      // If display text is same as filename, use simple format
      if (
        text === path.basename(pdfPath) ||
        text === path.basename(pdfPath, '.pdf')
      ) {
        return `![[${newFilename}]]`;
      }
      return `![[${newFilename}|${text}]]`;
    }
  );

  // Handle regular PDF links without remarks
  content = content.replace(
    /\[([^\]]+)\]\(([^)]+\.pdf)\)/g,
    (match, text, pdfPath) => {
      // Skip remote PDFs
      if (pdfPath.match(/^https?:\/\//)) {
        return match;
      }

      const decodedPath = decodeURIComponent(pdfPath);
      const newFilename = getNewFilename(decodedPath, attachmentMap);

      // If display text is same as filename, use simple format
      if (
        text === path.basename(pdfPath) ||
        text === path.basename(pdfPath, '.pdf')
      ) {
        return `![[${newFilename}]]`;
      }
      return `![[${newFilename}|${text}]]`;
    }
  );

  return content;
}

/**
 * Converts regular markdown links to wikilinks
 * @param {string} content The markdown content
 * @returns {string} Content with converted links
 */
function convertToWikilinks(content) {
  // Match markdown links: [text](path)
  return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, link) => {
    // Skip external links (http, https, etc.)
    if (link.match(/^[a-zA-Z]+:\/\//)) {
      return match;
    }

    // Skip PDF files as they're handled separately
    if (link.toLowerCase().endsWith('.pdf')) {
      return match;
    }

    // Get the filename from the path and decode URI components
    const filename = decodeURIComponent(path.basename(link));

    // Remove .md extension for note links
    const displayName = filename.endsWith('.md')
      ? filename.slice(0, -3)
      : filename;

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
