# Obsidian Migrate from Bear

A Node.js tool for migrating notes from Bear to Obsidian while preserving timestamps and handling attachments.

## Features

- Filename Synchronization:

  - Automatically renames files to match their first H1 title
  - Preserves original filename if no H1 title is present
  - Updates all references when files are renamed
  - Handles URL-encoded links and special characters

- Attachment Management:

  - Consolidates all attachments into a single Obsidian attachments directory
  - Handles duplicate filenames using content-based hashing
  - Preserves all file timestamps
  - Maintains correct attachment references

- Markdown Transformations:
  - Converts Bear's image tags with size parameters to Obsidian wikilinks
  - Transforms PDF links to inline display format
  - Converts regular markdown links to Obsidian wikilinks
  - Ensures proper table formatting with empty lines
  - Properly handles spaces and special characters

### Transformation Examples

Bear format → Obsidian format

**Tables:**

```markdown
#header
| Column 1 | Column 2 |
|----------|----------|
| Value 1 | Value 2 |
Some text
→
#header

| Column 1 | Column 2 |
| -------- | -------- |
| Value 1  | Value 2  |

Some text
```

**Tables with images:**

```markdown
| Data | Value |
| ---- | ----- |
| Test | 100   |

![](image.png)<!-- {"width":300} -->
→
| Data | Value |
|------|-------|
| Test | 100 |
![[image.png|300]]
```

**Images with width:**

```markdown
![](assets/image.png)<!-- {"width":430} -->
→
![[image.png|430]]
```

**PDF links with inline display:**

```markdown
[document.pdf](assets/document.pdf)<!-- {"preview":"true","embed":"true","width":444} -->
→
![[document.pdf]]

[Monthly Report](report.pdf)<!-- {"preview":"true","embed":"true"} -->
→
![[report.pdf|Monthly Report]]
```

**Note links with filename sync:**

```markdown
# Actual Note Title

[Link to note](Original%20Filename.md)
→
File is renamed to "Actual Note Title.md"
[[Actual Note Title|Link to note]]
```

## Prerequisites

1. Export your notes from Bear:

   - Open Bear
   - Select all notes you want to export
   - File -> Export Notes
   - Choose "Markdown" format
   - Select a destination folder
   - Make sure "Include images" is checked

2. Have Node.js installed on your system

## Installation

```bash
git clone [repository-url]
cd obsidian-migrate-from-bear
npm install
```

## Usage

```bash
node index.js <source-path> <destination-path>
```

Where:

- `<source-path>` is the directory containing your exported Bear notes
- `<destination-path>` is your Obsidian vault directory where you want the notes to be migrated

Example:

```bash
node index.js ~/Downloads/bear-export ~/Documents/ObsidianVault
```

## Notes

- Files are automatically renamed to match their first H1 title if present
- Files without an H1 title at the start keep their original filename
- All references to renamed files are automatically updated
- All attachments are consolidated into a single 'attachments' directory
- Duplicate files are handled by generating unique filenames based on content
- All file timestamps are preserved during migration
- Tables are properly formatted with empty lines for better rendering
- The tool automatically handles:
  - URL-encoded characters in filenames
  - Spaces and special characters
  - Nested attachments
  - Various Bear-specific markdown features

## Technical Details

### Table Formatting

1. **Empty Line Handling:**

   - Ensures empty lines before and after tables
   - Preserves table-image grouping without extra spacing
   - Improves markdown rendering in Obsidian

2. **Special Cases:**
   - Tables followed by images maintain their grouping
   - Tables followed by text get proper spacing
   - Multiple consecutive tables are properly spaced

### PDF Link Handling

1. **Inline Display:**
   - All PDF links are converted to inline display format with `![[]]`
   - Preserves custom display names when different from filename
   - Simplifies links when display name matches filename

### Filename Synchronization

1. **Title Detection:**

   - Scans the first line of each note for an H1 title
   - Only renames files if the H1 title differs from current filename
   - Preserves original filename if no H1 title is found

2. **Reference Updates:**
   - Updates all markdown links to renamed files
   - Converts regular links to wikilinks
   - Preserves link text in references
   - Handles both regular and URL-encoded links

### Attachment Processing

1. **Filename Generation:**

   - First occurrence of a filename is used as-is
   - Duplicates get a content-based hash appended (e.g., `image-a1b2c3d4.png`)
   - Original file extension is preserved

2. **Path Updates:**

   - All attachment references in notes are automatically updated
   - Relative paths are converted to Obsidian-style wikilinks
   - Links are updated to reference the new unified attachments directory

3. **Metadata Preservation:**
   - File creation timestamps are preserved
   - File modification timestamps are preserved
   - Original file content is unchanged
