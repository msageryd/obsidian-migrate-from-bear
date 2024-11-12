# Obsidian

## Migrate from Bear to Obsidian

## Obsidian config from Claude discussion

## Overall Structure
- Flat structure (no folders) using tags for organization
- Combined personal and PlanTrail notes in one vault
- Potential to separate PlanTrail notes in the future

## Tagging System

### Main Tag Categories
- #plantrail/ - for all PlanTrail-related content
- #type/ - for note types (documentation, prestudy, daily, etc.)
- #status/ - for tracking progress (draft, review, final)
- #area/ - for personal life areas
- #tech/ - for specific technologies or tools
- #project/ - for specific projects (personal or work-related)

### Tag Hierarchy
- Subtags (e.g., #plantrail/ddp) imply the parent tag in Obsidian search
- Dataview queries require explicit parent tag or wildcards

### Example Tags
- #plantrail/ddp, #plantrail/blueprints, #plantrail/reports
- #type/documentation, #type/prestudy, #type/daily
- #status/draft, #status/review, #status/final
- #area/home, #area/finance, #area/health

## Note Types
1. Daily notes (private and corporate ideas/scratchpad)
2. PlanTrail pre-studies
3. Private notes (purchases, manuals, home documentation, etc.)
4. PlanTrail documentation

## Frontmatter Structure

```yaml
---
title: "Note Title"
date: YYYY-MM-DD
tags: [plantrail/area, type/notetype, status/status]
publish: plantrail  # Only for publishable PlanTrail documentation
---
```

## Obsidian Publish Setup

### Publish Filter
- Use `publish: plantrail` in frontmatter for publishable notes
- Set Obsidian Publish to filter notes with this property

### Index Page
Create a main index page for navigation:

```markdown
---
title: "PlanTrail Documentation Index"
tags: [plantrail, type/index]
publish: plantrail
---

# PlanTrail Documentation

## Data-Driven Planning (DDP)
```dataview
LIST
FROM #plantrail/ddp AND #type/documentation AND publish="plantrail"
SORT file.name ASC
```

## Blueprints
```dataview
LIST
FROM #plantrail/blueprints AND #type/documentation AND publish="plantrail"
SORT file.name ASC
```

## Reports
```dataview
LIST
FROM #plantrail/reports AND #type/documentation AND publish="plantrail"
SORT file.name ASC
```




## Workflow Enhancements

### Alfred Workflow for Note Creation
- Automate tag application based on note type
- Include `publish: plantrail` for PlanTrail documentation notes

### Regular Maintenance
- Periodic tag review and cleanup
- Update tag index note

## Best Practices

1. Consistent Tagging: Apply relevant tags to all notes
2. Liberal Linking: Use internal links to connect related concepts
3. Use Aliases: For notes that might be referred to in multiple ways
4. Query-based Organization: Utilize Dataview for dynamic content organization

## Dataview Query Examples

1. Find all PlanTrail notes:
   ```dataview
   FROM #plantrail or #plantrail/*
   ```

2. List all documentation ready for review:
   ```dataview
   LIST
   FROM #type/documentation AND #status/review
   ```

3. Show recent pre-studies:
   ```dataview
   TABLE file.ctime as "Created"
   FROM #type/prestudy
   SORT file.ctime DESC
   LIMIT 5
   ```

Remember to adjust and expand this system as your needs evolve, particularly as PlanTrail grows and your documentation needs become more complex.
## Plugins
Admonition
