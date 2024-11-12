# CORS

#plantrail/api

We need more permissive cors handling for /downloads since w are using redirects to S3 links.

``` js
  const defaultCorsOptions = {
    origin: [
      'https://app.plantrail.com',
      'https://portal.plantrail.com',
      'https://app.dev.plantrail.com',
      'https://app.staging.plantrail.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'deviceid'],
    credentials: true,
  };

// /downloads uses redirect for AWS S3 presigned urls, this is troublesome with CORS, hence origin: *
  const downloadCorsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD'],
    credentials: false,
    exposedHeaders: [
      'Content-Disposition',
      'Content-Type',
      'Content-Length',
      'Content-Range',
      'Accept-Ranges',
      'ETag',
    ],
  };
```


### Deployment of new CORS options

Test:
- [x] portal.plantrail.com, specifically downloading files
- [x] app.plantrail.com, download files (for example report previews and project thumbnails)
- [ ] app.plantrail.com all other functionality
- [x] ensure that ratelimiters do not disturb
  - [x] mobile app /downloads?
- [ ] Ensure that cors logging works for blocked origins