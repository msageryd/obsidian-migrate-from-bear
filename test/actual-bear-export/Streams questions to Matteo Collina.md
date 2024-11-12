# Streams questions to Matteo Collina
## Error handling
I’m using pipeline and clone.
If I emit `error` on source stream I cannot catch this error.

## Stream from buffer
What is the correct way to convert a buffer to a stream?

Is this correct?
[GitHub - sindresorhus/into-stream: Convert a string/promise/array/iterable/asynciterable/buffer/typedarray/arraybuffer/object into a stream](https://github.com/sindresorhus/into-stream)

## Convert stream to buffer
[GitHub - sindresorhus/get-stream: Get a stream as a string, Buffer, ArrayBuffer or array](https://github.com/sindresorhus/get-stream)

## Why doesn’t Benjamins code work?
[How to implement a through stream · Issue #527 · nodejs/readable-stream · GitHub](https://github.com/nodejs/readable-stream/issues/527)

## Push vs write
Whats the difference between `push`and `write` 
I read that push is for pushing data into the read queue of a readable stream.
