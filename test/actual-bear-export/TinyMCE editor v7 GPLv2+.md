# TinyMCE editor v7 GPLv2+
#plantrail/webapp

## Background
TinyMCE switched from MIT to GPLv2+ when version 7 launched. The GPL license model only applies to “distributed” software. The problem is to define what distributed means.

GPL was written 1991, even before Javascript was invented. Today it seems to be quite hard to define what distribute means. A SaaS is not distributed per se, since it runs on servers. But nowadays much of the code for a web side is downloaded to the browser and ran at the client. Is this “distribution”.

Unfortunately it seems to be very hard to come to a conclusion. Some say that a SaaS (web app) can never go under GPL. Others say that GPL does apply.

CKEditor (Tiny’s only real competitor) switched to GPL a while ago. Apparently this lead to people migrating to Tiny since Tiny had the MIT license (much more permissive than GPL). The goal for CKEditor was to earn more money by forcing commercial users to buy a licence. Since this was the goal it seems apparent that CKEditor’s view on GPL is that is does apply to SaaS.

In March of 2023 TinyMCE was purchased by the portfolio company Tiugo Technologies. Tiugo also owns CKEditor, which is quite bad from a consumer standpoint. This purchase is probably the reason for Tiny to move to GPL. 
[Tiugo purchase of Tiny](https://www.tiny.cloud/blog/tiugo-portfolio-with-tinymce/)<!-- {"preview":"true"} -->


## PlanTrails use case
PlanTrail uses TinyMCE as an embedded component in some parts of the web app. In comparison to the complete PlanTrail system (servers, mobile app, web app), the use of Tiny is very small.

### V6 -> V7
PlanTrail upgraded from TinyMCE v6 to v7 with no knowledge of the license switch. Recently we got an email explaining that we need to purchase a quite costly license.

## PlanTrail editor loads
Tiny’s price model is based on “number of editor loads”. Since we are loading many editors for each report (one editor per free text component, i.e. about 20 editors per ABT06-report), the editor count goes through the roof. I also suspect that we get more “loads” when we sync data to the server (not quite sure though)

Our current load count averages at about 14,000 loads per month, as per information in an email from Tiny.
![](TinyMCE%20editor%20v7%20GPLv2+/image.png)<!-- {"width":346} -->

These editor loads are performed by 26 users in total, and only about 10 heavy users. This gives an average of about 500 editor loads per user per month.
![](TinyMCE%20editor%20v7%20GPLv2+/image%202.png)<!-- {"width":150} -->
## Our options
### Paid subscription
A paid subscription makes all the GPL/MIT licensing problems go away. Instead we would pay a hefty price. There is an enterprise license with unlimited editor loads, but the price for this license is undisclosed and probably quite high.

The license below “enterprise” is “professional”. This license costs 130 USD per month and has a limit of 20,000 editor loads per month. I.e. we could fit approximately 40 users in this license based on our usage statistics. For every 1000 extra loads the price would be 40 USD, i.e. on average more than 200 SEK per PlanTrail user per month (compare this to the total income for a PlanTrail web app licence, 350 SEK)

It would probably be possible to alter the way we load editors so we only load editors when they are used for editing, i.e. render readonly data when not in edit mode. This would probably take down our load count massively, maybe 10-20 times. If the average load count would go down 10 times we could fit 400 users in the 130 USD license. But at some point we would outgrow this and need an enterprise license anyway (or pay 40 USD per 1000 excess loads)

### Setup an OSS Tiny server for v7
To use v7 on our own servers (i.e. not paying anything to Tiny) we would need to comply with GPLv2+.

We might or we might not be eligible for this. We should probably get legal advice before attempting this.

### Setup an OSS Tiny server for v6
Version 6 of Tiny will remain under MIT. This can be freely used in commercial software.

### Find an alternative to Tiny
This seems like a bad option. The only viable alternative is CKEditor, but this does not suit our needs as good as Tiny (no support for tables in CK). CKEditor is also under GPL and is owned by the same company.

## Links
### Discussion thread from Feb 2024 about the license switch
[What happened to TinyMCE's license? · Issue \#9453 · tinymce/tinymce](https://github.com/tinymce/tinymce/issues/9453)

### Explanation on what’s “free”
[The TinyMCE WYSIWYG HTML editor is free | TinyMCE](https://www.tiny.cloud/blog/tinymce-free-wysiwyg-html-editor/)
