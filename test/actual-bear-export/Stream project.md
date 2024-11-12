# Stream project
## Background
Clients upload files for processing. Some files needs many processing steps. Processed, and sometimes unprocessed files will end up at Amazon S3

The server is Node.js 18

Most of this is currently handled via buffers, but we need to use streams instead.

Since there are multiple processing steps as well as multiple destinations the stream infrastructure needs to be crafted carefully.

I need help with the general infrastructure, i.e. creating read/write-streams, piping, handling errors, cloning streams for transforming/uploading to multiple targets

## Requirements
* Node.js 18
* No third party dependencies except the ones I approve
* Error handling in accordance with best practice for streams
* Vanilla JS (No TypeScript)

## Stream structure
Stream “endpoints”:
* S3 upload, aka <S3>
* Local file, aka <FS>

Stream transforms:
* Sharp resize thumbnail, aka <thumbnailSize>
* Sharp resize medium, aka <mediumSize>
* Pdf


Input file

## 


## Advanced stream infrastructure, best practice
I’m trying to read up on streams in Node.js. The stream implementation in Node-js has changed over the years, so it’s hard to know which “Learn Node streams” is up to date. There are also many “recepies” for chaining, splitting and cloning streams.

I need advice on how to orchestrate the following including how to handle errors.

There are npm packages for cloning, such as [readable-stream-clone - npm](https://www.npmjs.com/package/readable-stream-clone). But this package was updated 4 years ago. 

![](Stream%20project/EF28BD03-6D92-40E7-A1F5-A9C4A3B40A64.png)