# Sendgrid sender authentication

#plantrail/email

## Our needs
**Transactional emails** from **app.plantrail.com** (a couple of hundreds per month).

**Marketing emails** from **plantrail.com** (probably a couple of hundreds per month, maybe more in the future).

**Corporate email** at Gmail on domain **plantrail.com**.

**Inbound parse** to **inbox.app.plantrail.com**

**Transactional emails in dev-environment** from **dev.plantrail.com.** This is currently setup at a separate Sendgrid account without private IP.
> **Q1**. Can this be handled from a subuser on our main account? It would be a cleaner setup. Developer email should use a shared IP.

## Current setup
### Sendgrid users
plantrail_prod -> main account
plantrail_transactional -> subuser
plantrail_marketing -> subuser

plantrail_dev -> separate main account

### IP addresses
149.72.251.142 -> currently in production use for transactional emails
159.183.199.111 -> should be used for marketing emails

### 2024-09-17 Temporary dev emails under plantrail_prod account
The plantrail_dev account went unused for a long period and Sendgrid put the account “under review”. Unti this is sorted out I have authenticated the dev subdomain under plantrail_prod with the following DNS records:
![[24bfc826-c82a-436f-bed8-977c85a9d09e.png]]


### Domain authentication

![[A21BEEFC-A17C-4E11-B747-8C0D64C3AC60.png|654]]

**plantrail.com**
This domain is authenticated under user plantrail_prod.
![[62AF6232-77F5-4D61-8BAD-9C315028D74F.png]]


**app.plantrail.com**
This domain is authenticated under user plantrail_prod. 
![[5A24C828-DFA2-4B85-930D-8420B759CFB7.png]]

## rDNS
Reverse DNS is setup for the two IP addresses:
![[7EF509E5-93E2-4182-905B-D224624B06E7.png]]


## Subuser config
**plantrail_transactional**
![[69E0B1E0-5E9B-44AF-81D5-559CFF6AA44A.png]]

**plantrail_marketing**
![[0B1C19E2-6136-48EA-8612-56C2E546AF65.png]]


## Manual SPF
A manual TXT record is setup as per instructions from GMail. 
> **Q2.** How can this work without a DKIM key?
> **Q3.** Will this clash with Sendgrids automatik DKIM for plantrail.com?

![[A829F437-16E8-46C0-8327-10089FC343F8.png]]

## DMARC
Dmarc is setup on the main domain and should be inherited to all subdomains.  Dmarc seems to work fine according to test results.

The policy will be changed when everything works as it should.
![[EB1AFB2A-919E-472D-B70F-4D6864D58AEB.png]]


## Link branding
Link branding is setup for plantrail.com. 
![[AC497B34-723A-432D-892B-19ADEA7B007D.png]]

(app.plantrail.com does not use tracking, no need for branding)


## MailGenius
Sending with my old API key on the main user **plantrail_prod** works fine. DMIK/SPF works correctly

Sending with the API key on subuser plantrail_transactional *( cvWJhMcYS6OvRX_H3..)* gives the following on Mailgenius:
![[0ABEC13F-7314-443D-B943-DEC7FDCE541B.png]]


Sending marketing emails from subuser **plantrail_marketing** gives the following on Mailgenius:
![[989DDC77-ED76-4258-B666-3B2EEB6CDB05.png]]

**Q4:** Do I need to setup the validation directly on the subuser?
