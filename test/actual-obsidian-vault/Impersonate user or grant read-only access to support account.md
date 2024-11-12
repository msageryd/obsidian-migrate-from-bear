# Impersonate user or grant read-only access to support account

#plantrail/roles

## Background
We need to access customer project in some ways:
* read only access in order to guide users and check what they need help with
* completely 

--Current roles for user 13
select * from user_account__role__project where user_account_id = 13;
select * from user_account__role__company where user_account_id = 13;
select * from user_account__role where user_account_id = 13;

delete from company__user_account where user_account_id = 13;
delete from user_account__role__project where user_account_id = 13;
delete from user_account__role__company where user_account_id = 13;
delete from user_account__role where user_account_id = 13;



INSERT INTO main.company__user_account
(company_id, user_account_id, created_by_id, subcontractor_chain_id)
VALUES (56, 13, 1, 1)
ON CONFLICT DO NOTHING;

select app_api.role_grant_on_company(_user_account_id => 1, _grantee => 13, _company_id => 56, _role_id => 2, _subcontractor_chain_id => 1)
select app_api.role_grant_on_company(_user_account_id => 1, _grantee => 13, _company_id=> 56, _role_id => 10100, _subcontractor_chain_id => 1)
select app_api.role_grant_on_company(_user_account_id => 1, _grantee => 13, _company_id=> 56, _role_id => 10102, _subcontractor_chain_id => 1)

select * from user_account__role__company where user_account_id = 172;


select * from company__user_account where user_account_id = 172;
select * from user_account__role__project where user_account_id = 172;
select * from user_account__role__project_layer where user_account_id = 172;
select * from user_account__role__company where user_account_id = 172;
select * from user_account__role where user_account_id = 172;


select * from role_permission;
select * from permission;


CREATE TABLE main.impersonation
(
  guid uuid NOT NULL, 
  expires_at timestamptz(3) NOT NULL,
  impersonated_user_account_id int NOT NULL,
  granted_user_account_id int NOT NULL,
  signature text,
  PRIMARY KEY (guid) 
);

CREATE TABLE main.impersonation_company_id
CREATE TABLE main.impersonation_company_role
CREATE TABLE main.impersonation_project_role
CREATE TABLE main.impersonation_project_layer_role


requestImpersonation(_user_account_id, _source_user_id, _ttl) -> impersonification_guid
grantImpersonation(_user_account_id, _impersonification_guid
revokeImpersonation(_impersonification_guid)
;