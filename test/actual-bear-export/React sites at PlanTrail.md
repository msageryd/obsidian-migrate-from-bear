# React sites at PlanTrail
#plantrail/devops

What server setup should we choose for future web development? 

All future web sites belong to the same system, i.e. uses the same backend APIs. I can think of three separate sites to develop:
1. Internal site for admin purposes. Needs authentication.
2. Customer site. Needs authentication.
3. Open site without authentication. Needs to call the backend, i.e. API keys needs to be handeld.

The first project is #3 from the list. It's a very small site with only a couple of pages. It will be reached via QR-codes. Data will be fetched from our API based on a JWT embedded in the QR code.

 As of today we are all in on AWS. We are using the following:
- [ ] S3
- [ ] Fargate
- [ ] EC2
- [ ] KMS
- [ ] Route53
- [ ] ALB
- [ ] Aurora


## CRA + S3 + CloudFront

## CRA + Fargate
Our other infrastructure, API servers and task servers, runs on Fargate. It would be easy to set up another container in our cluster. 


## NextJS+Lambda
Secrets storage can be easily handled by the Lambda backend.
A mix of SSR and client side rendering can be used.

## CRA + AWS Amplify
Seems kind of non-flexible and expensive.
