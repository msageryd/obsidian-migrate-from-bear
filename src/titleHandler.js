const path = require('path');
const fs = require('fs-extra');

/**
 * Handles synchronization of filenames with H1 titles
 */
class TitleHandler {
  constructor() {
    this.renamedFiles = new Map(); // Track original to new filenames
  }

  /**
   * Extracts H1 title from markdown content if it exists at the start
   * @param {string} content Markdown content
   * @returns {string|null} The H1 title or null if not found
   */
  extractH1Title(content) {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();

    // Check if first line is an H1 title
    if (firstLine.startsWith('# ')) {
      return firstLine.substring(2).trim();
    }
    return null;
  }

  /**
   * Converts a title to a valid filename
   * @param {string} title The title to convert
   * @returns {string} A valid filename
   */
  titleToFilename(title) {
    return (
      title
        .replace(/[/\\?%*:|"<>]/g, '') // Remove invalid filename characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim() + '.md'
    ); // Add extension
  }

  /**
   * Updates references to renamed files in content
   * @param {string} content Markdown content
   * @returns {string} Updated content
   */
  updateReferences(content) {
    let updatedContent = content;

    for (const [oldName, newName] of this.renamedFiles.entries()) {
      const oldNameWithoutExt = path.basename(oldName, '.md');
      const newNameWithoutExt = path.basename(newName, '.md');

      // Update markdown links: [text](oldname) -> [[newname|text]]
      const markdownLinkRegex = new RegExp(
        `\\[([^\\]]+)\\]\\(${oldNameWithoutExt}\\.md\\)`,
        'g'
      );
      updatedContent = updatedContent.replace(
        markdownLinkRegex,
        `[[${newNameWithoutExt}|$1]]`
      );

      // Update existing wikilinks with display text: [[oldname|display]] -> [[newname|display]]
      const wikiLinkRegex = new RegExp(
        `\\[\\[${oldNameWithoutExt}\\|([^\\]]+)\\]\\]`,
        'g'
      );
      updatedContent = updatedContent.replace(
        wikiLinkRegex,
        `[[${newNameWithoutExt}|$1]]`
      );

      // Update simple wikilinks: [[oldname]] -> [[newname]]
      const simpleWikiLinkRegex = new RegExp(
        `\\[\\[${oldNameWithoutExt}\\]\\]`,
        'g'
      );
      updatedContent = updatedContent.replace(
        simpleWikiLinkRegex,
        `[[${newNameWithoutExt}]]`
      );

      // Handle URL-encoded references
      const encodedOldName = encodeURIComponent(oldNameWithoutExt + '.md');
      const urlEncodedRegex = new RegExp(
        `\\[([^\\]]+)\\]\\(${encodedOldName}\\)`,
        'g'
      );
      updatedContent = updatedContent.replace(
        urlEncodedRegex,
        `[[${newNameWithoutExt}|$1]]`
      );
    }

    return updatedContent;
  }

  /**
   * Processes a note file and renames it if needed based on H1 title
   * @param {string} filePath Path to the note file
   * @param {string} content Note content
   * @returns {Object} Object containing new filename and whether file was renamed
   */
  async processNote(filePath, content) {
    const title = this.extractH1Title(content);
    if (!title) {
      return { newFilename: path.basename(filePath), wasRenamed: false };
    }

    const newFilename = this.titleToFilename(title);
    const currentFilename = path.basename(filePath);

    if (newFilename.toLowerCase() !== currentFilename.toLowerCase()) {
      this.renamedFiles.set(currentFilename, newFilename);
      return { newFilename, wasRenamed: true };
    }

    return { newFilename: currentFilename, wasRenamed: false };
  }

  /**
   * Gets the map of renamed files
   * @returns {Map<string, string>} Map of original to new filenames
   */
  getRenamedFiles() {
    return this.renamedFiles;
  }
}

module.exports = TitleHandler;
