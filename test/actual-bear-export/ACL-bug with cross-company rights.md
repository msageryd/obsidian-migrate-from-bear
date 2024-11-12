# ACL-bug with cross-company rights

#plantrail/sql

## The problem
In `create_project` we create a record in user_account__project for all users with any kind of company role. This will also include users which only have a -1 role.

This insert will result in an ACL-calc being queued for this specific project, i.e. all users with a relation to the company will get an ACL-calc performed. When the acl_calc is performed for a user with only -1 role and no role for the newly created project, this user will actually have the company role (-1) revoked.

Since the new acl_calc is optimized to do just what it's told to do, the ACL will be calculated only for the given project_id. At the end of the ACL-calculation all removed rights will be deleted. Since no explicit calculation was done at company level, and there previously existed an implicit company ACL (-1) the implicit company-level ACL will be removed. ph

### Solution A
The -1 role only gives access to the company name. There is no harm letting a -1 role remain even if the last project right gets revoked.

The easiest solution is probably to not remove -1 roles explicitly. We could have a sweeper job to get rid of orphan -1 roles.

**Problem** This solution works for -1 roles at company level as we never list companies in the app. But a user could have -1 roles at project level of explicit roles are granted to a separate layer in the project. Projects are listed in the app, so it would not be great to have lingering project roles if the user does not have access to any layers.

### Solution B
Before revoking any roles in `acl_calc_project` and `acl_calc_project_layer` we could check if any -1 roles exists and should still exist due to acls in sibling projects or sibling layers.

Special care needs to be taken with sub-projects, or rather their parent project, since these will have explicit acl as well.

This solution will be quite tricky.

### Solution C
Instead of automatically grant implicit rights to parents, we could revert to a  manual model where explicit rights to a company must be granted before any project rights can be granted. 

Such a role should not be inheritable, i.e. should not trickle down to projects after being granted to a company. Likewise for project vs layers. 

This special role should not include any permissions whatsoever. The only purpose is to be able to navigate the hierarchy down to the actual granted right, i.e. navigate via company/project in order to work on a layer for which a role has been granted.




## Test scenario:
project: 565
company: 8
user: 13

1. user 13 has access to more than one company (1 and 8)
2. to one of the companies (8), only project-level roles exists
3. Create new project (565) in company (8)
4. automatic ACL calc is queued for project 565 in company 8
5. somehow the acl calc removes the previous implicit company-acl for company 8

Before step 4, user 13 has access to two companies
`select * from company_acl where user_account_id = 13 order by modified_at desc;`

The troublesome calc-call:
`select acl_calc(13, _project_id => 565);`

After the above call, the user looses acl for company 8
`select * from company_acl where user_account_id = 13 order by modified_at desc;`

ACLs will be corrected if a user-level acl is performed
`select acl_calc(13);`

After the above call, the user will have access to both companies again
`select * from company_acl where user_account_id = 13 order by modified_at desc;`
