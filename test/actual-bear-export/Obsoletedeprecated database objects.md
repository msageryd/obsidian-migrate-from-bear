# Obsolete/deprecated database objects

#plantrail/database
## Background
During development we sometimes migrate to new structures. The old structures, i.e. tables, functions, triggers, etc, should be removed. The removal must be foregone by meticulous controls to ensure that the structure really is unused.

This document serves as a roadmap and todo-list for removing obsolete structures in the database.

## Remove
### main.reset_sequence_last_value()
Two functions with this name is obsolete and should be removed.
- [ ] Drop function main. reset_sequence_last_value

### main.sequence
The sequence table is migrated to more precise tables for different use cases, e.g project_sequence. The old sequence table should be empty and unused (apart from the above mentioned reset_sequence_last_value function.
- [ ] Drop table main.sequence

### main.field_set_field.is_side_car
- [ ] ensure that the field is unused before removing