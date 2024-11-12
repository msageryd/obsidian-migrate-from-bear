# Linear work process
#plantrail/process

## Our Linear process
### Teams
Teams represents our working groups. Currently most of the teams consists of one member. The team structure will prepare us for growing in the future.
- [ ] api
- [ ] database
- [ ] react-native
- [ ] react-web
- [ ] support
- [ ] devops
- [ ] jsreport

### Labels
- [ ] Bug
- [ ] Feature

### Projects
Project can span multiple teams. Projects should have an end, i.e. we do not create perpetual “projects”.

### Status
- [ ] Backlog
- [ ] Todo
- [ ] In progress
- [ ] Done
- [ ] Cancelled/Duplicate


## PlanTrail project process in Linear

1. Changelog
2. Brief/Why
3. Current Problems
4. Ideas
5. Goals/Outcome
6. How to track feature?
7. Recommended approach
8. Phases/Scope
9. Engineering proposal
   1. Design goals


## Example: project “Declarative form engine”
### Changelog
- [ ] Form definitions and field definitions can be fetched from API
- [ ] Forms can be chained via an array of form ids
- [ ] Simple field validations can be specified directly in the field def
- [ ] Advanced rules can be defined as “conditions”
- [ ] Web app now uses the new form engine

## Why
We have need for input forms everywhere. Some forms are quite advanced.

## Current problems
Forms are currently rendered in three different ways:
1. Hard coded (some small simple forms are hard coded)
2. Declarative via journalItem definitions (only in the native app)
3. Declarative via a simple json definition (only in the web app)

