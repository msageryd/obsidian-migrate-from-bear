# Scope tables

#plantrail/database

select * from find('scope_id');

### document
--document_scope is ok as it is
select * from document_scope; x
1	system
2	company (level 0 = everyone)
3	project (level 0 = everyone with access to project)

--Maybe add specialized scopes if needed?
user?
21 company level 1
22 company level 2

2 000004 01 (proprietary company level for company 4)
3 000014 01 (proprietary project level for project 14);

### controlpoint_category
—controlpoint_category_scope is ok as it is
select * from controlpoint_category_scope;
1	system
2	company (level 0 = everyone)
3	project (level 0 = everyone with access to project)

controlpoint_category uses “0” instead of null to indicate lack of companyId and/or projectId. This helps with constraints, in particular the unique constraint for (company_id, project_id, name) which prevents duplicately named categories.

N.B. company_id must be set to 0 if the scope is “project”. Otherwise we would need to handle categories when transfering projects between companies

### grid_state
select * from grid_state_scope;
1	system
2	company (level 0 = everyone)
3	project (level 0 = everyone with access to project)
4	user

grid_state uses “0” instead of null to indicate lack of companyId and/or projectId. This helps with constraints, in particular the unique constraint for (company_id, project_id, name) which prevents duplicately named categories.

N.B. company_id must be set to 0 if the scope is “project”. Otherwise we would need to handle grids when transfering projects between companies


### report_template
—report_template_acl_scope is ok.
select * from report_template_acl_scope
1	system
2	company
3	project
4	user


--template_scope is ok as it is
select * from find('template_scope');
select * from report_template_scope; x
1	system
2	company
3	project
4	user

### snippet
--snippet_scope needs to be converted to match standard
select * from snippet_scope; x
--new order to match above?
2	company
3	project
4	user
5	ad-hoc

--current order
1	company
2	project
3	user
4	ad-hoc


### inbox
--inbox_item_acl_scope might need adjustments to match standard?
select * from inbox_item
select * from inbox_item_acl_scope;
9	All items
1	Only own items

--borde ändras till
2 company
4 user

### report - NOT USED, report_scope table should be deleted
select * from report_scope; 
1	system
2	company
3	project

### sequence
select * from sequence_scope;
1	project
2	drawing
3	layer
4	layer+drawing

Sequence uses the fictive projectId and companyId “0” instead of null. This helps with constraints and selection of correctly scoped sequence.

### user_account_setting
select * from user_account_setting_scope;
1	System	system
2	Device	device
3	Company	company
4	Project	project
5	Drawing	drawing


select * from file_scope;
select * from find('document_scope');

select * from find('_revoked');

select * from inbox_item_acl_revoked


### invitation_scope
select * from invitation_scope;

1. system
2. company
3. project
4. layer