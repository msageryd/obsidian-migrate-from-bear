# Bug hunt, corrupt files after import

#plantrail/blueprints

## Background
After importing a large PDF and the PDF has been processed and jpg files uploaded to S3, some JPG files are corrupt.

This only happens on production servers. Not reproducible in dev environment.

The phenomenon actually was reproducible in dev environment before we switched from streams to buffers when handling the output from pdfium.

## Test 1: is it always the same JPG files or random files that gets corrupt?

The below images shows the jpg files (pages) downloaded from S3 after the import process. 
> We can conclude that the problem is random

**Import session 1**
![](Bug%20hunt,%20corrupt%20files%20after%20import/Pasted%20Graphic%203.png)

**Import session 2**
![](Bug%20hunt,%20corrupt%20files%20after%20import/Pasted%20Graphic%204.png)

## Test 2:
Process the same imported file and only call pdfium once at time, i.e. no parallell processes.

![](Bug%20hunt,%20corrupt%20files%20after%20import/image.png)

## Investigation of the binary files
It turns out that the corrupt files have one extra byte at the beginning. Here are the first bytes from three rendered files from the same pdf page, performed by three different pdfium processes ran in parallel.

```
<Buffer 01 01 01 01 02 01 01 01 02 02 02 02 02 04 03... 1207144 more bytes>
<Buffer    01 01 01 02 01 01 01 02 02 02 02 02 04 03... 1207143 more bytes>
<Buffer    01 01 01 02 01 01 01 02 02 02 02 02 04 03... 1207143 more bytes>
```

The two correct files are indented one byte to clarify that the these bytes are identical with the first (corrupt file) if it weren’t for the extra first byte.

**Possible bugs:**
1. Pdfium och pdfium-cli. Could the output stream from pdfium-cli be corrupt?
2. My stream handling code could be faulty. My Node-js code splits the stream into separate jpg files based on a file delimiter in the stream.
3. Could Node.js be at fault, or maybe how I’m using spawn in Node.js?

## Isolating the bug based on the three possibilities above
In order to isolate case 1, I made the following test.

- Spawn multiple parallel pdfium processes and send the output stream to files. This is performed without Node.js, i.e. no risk of misusing child_process.spawn or stumbling upon a bug in child processes

Bash script to generate 50 files of 50 concatenated jpg files each, i.e. 2500 files in total.
```
for i in {1..50}; do
  pdfium render "../test/resources/a-binder.pdf" - --max-width 4000 --max-height 4000  --pages "1-50" --std-file-delimiter myDelimiter > "../test/output/file_$i.stream" &
done

wait

```

- Process each file in Node in the exact same way we process stdout from pdfium

We have now decoupled from the child_process code.

**Result: No corrupt files!!**
I have ran the above test a couple of times and didn’t catch a single corrupt jpg file. I think we can conclude that pdfium is not at fault, nor is my code for parsing and splitting the concatenated stream.

![](Bug%20hunt,%20corrupt%20files%20after%20import/image%202.png)