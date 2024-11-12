# Sendgrid alternatives
#plantrail/devops
Sendgrid might not be the best  partner for our email sending needs. Due to their size and possibly lack of abuse control, their ASN (11377) got blacklisted today. Albeit only on one list so far, but it's bad enough.

The blacklist occurred is an **UCEPROTECT-Level 3**, which happens when enough abuse has taken place on the whole ASN.


[UCEPROTECT®-Network - Spam Database Query](http://www.uceprotect.net/en/rblcheck.php)

## Our needs
- [ ] Send emails via API
- [ ] Send campaign emails via UI, including design editor
- [ ] Node.js library, maintained by provider
- [ ] Inbound emails forwarded to us via API (Sendgrid Inbound parse)
- [ ] Webhook for feedback on status for each email sent via API
- [ ] 

## Alternatives
### Sendinblue
ASN: **200484**

Sendinblue seems to have a much cleaner record in uceprotect.

### AWS SES (Simple Email Services)'
ASN: 16509
