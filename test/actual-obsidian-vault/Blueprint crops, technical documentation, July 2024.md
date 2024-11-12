# Blueprint crops, technical documentation, July 2024

## Todo
Some todos for the future
- [ ] Implement one-off crops for use in controlpoint-portals and emails
- [ ] Omit crop calculations if controlpoint does not have a shape (i.e. when we implement support for shape-less controlpoints)

## Blueprint crops
In June 2024 our solution for embedding blueprint crops in reports and other places changed drastically. The previous solution was to embed the complete blueprint and visualize the cropped part in an SVG viewBox. The solution bloated the reports with way too much information and the PDFs where unmanageable.

Our new solution is to create actual crops, i.e. cropped jpg files from the original blueprint.
## Crop types
The needed crops can look different for different use cases. Therefore we have implemented cropTypes, which specify the characteristics of each type. 

Crops are specified in the table `crop_type` with the following parameters:
- aspectRatio
- minSizePct
- marginPct
- outputResolution
- jpgQuality

Whereever a crop is needed, the crop type will be specified.

## Identifying missing crops
Depending on the use case different identification solutions are needed for identifying missing crops. We are identifying the missing crops “just in time”, i.e. only when there is actual use for the crops. All needed crops are then generated at one of the worker servers.

When identifying missing crops, only the controlpoints in question should be processed. The same filter should be used for identifying missing crops as for the actual usage of the crops. This means that DDP-filters should be used for DDP-reports, legacy report-filters should be used for legacy reports and single controlpoint guids should be used for one-off use cases, such as a controlpoint portal.

### Missing crops for DDP reports
DDP reports are structured with sections and components. Components are the definition of how the data will be visualized. If a component will render a blueprint crop, a blueprint crop is needed.

The need for blueprint crops for each component layout is specified in the table `report_component_layout`. Each component type can specify a different cropType.

### Missing crops for legacy reports
Legacy reports (i.e. non DDP-reports) does not have a component concept, instead the report design is hard coded for each reportTypeVariant.

The need for blueprint crops for each reportTypeVariant is specified in the table `report_type_variant`. Each reportTypeVariant can specify one cropType, i.e. a legacy report cannot include multiple different crop types.

### Missing crops for one-off use cases
We have not yet implemented this use of crops. It would probably be a great fit for controlpoint-portals where we might want to render a blueprint crop.

When this feature is implemented the ordering of a new crop should probably be queue based, i.e:
1. client asks API for data, including the crop file
2. if the crop does not exist, the client gets null for the crop url and a crop job is registered in the crop queue
3. a worker server produces the crop
4. the new crop will trigger a socket message to the client
5. the client re-fetches data and now gets a crop url as well

This might seem cumbersome, but it aligns well with our strong use of worker queues and have the following benefits:
- api server does not need to know anything about cropping
- no action is lost due to bad connection or similar, a queued item will always be served
- speedier response to the request since there is no waiting for the crop

## Generating crops
The crops are generated with Sharp.js, a fast Node library for dealing with bitmap images. Crops are generated on a per blueprint basis, i.e. all crops needed for a specific blueprint are generated before the next blueprint is fetched from S3. This minimises the data transfer from S3.

1. fetch original blueprint jpg file from S3
2. generate crop for each missing crop for the current blueprint
3. register the crop file in the `file` table
4. register the usage of the crop along with crop cordinates and ctopType in `controlpoint_crop_file_ref`
5. upload the crop file to S3
## Caching crops
Crops are generated when they are needed, for example when a report is rendered. Each generated crop file is uploaded to S3, tracked in our `file` table and marked as “used” in our `controlpoint_crop_file_ref` table.

If the same crop is needed again, this crop will probably already exist.

If the cache needs to be cleared, we only need to remove the usage marker in controlpoint_crop_file_ref. When there is no usage of a file in the `file` table, this file is “orphaned” and can safely be removed from S3 in a nightly job.

Some triggering events will clear the cache for a controlpoint:
- altering the related controlpoint
- altering the specification if a cropType
- adding new blueprint revisions

These cache clearing events are all handled by a single database trigger: `tr_clear_blueprint_cops`. This trigger is connected to the following tables:
- controlpoint
- blueprint_file_ref
- crop_type

## Crop coordinates
Crop coordinates are calculated with the following input:
- cropType (defined in the database)
- boundingBox of the controlpoint
- resolution of the complete blueprint

Crop coordinates are save with the crop image so the image can be placed correctly.
![[image 6.png|452]]


When the crop is used as a background image for the controlpoint SVG, the crop coordinates is used both for the SVG viewbox and the image translation.

![[image 7.png|566]]


### Simple case
I a simple case the calculation is performed like this:
1. calculate `svgBBox` for the controlpoint
2. add margin, `marginPct`, to the boundingbox
3. create crop from the jpg
4. resize the crop to `outputResolution`
5. convert to jpg with quality = `jpgQuality`

### Advanced adjustments
Some adjustments might be needed for more advanced cases.
- ensure that the final crop size is at least `minSizePct`
- if any part of the boundingbox with margins are outside of the blueprint, move the crop to align with the overflowed edge
- if boundingbox + margins is larger than the blueprint, decrease the margins until it fits
- if `aspectRatio` of the crop differs from aspect ratio of the blueprint, a crop might have to be extended outside of the blueprint. (See “Crop extension”)
- crop resolution increase (see “Crop resolution adjustment”)

## Crop extension
If the blueprint does not have the exact same aspect ratio as the target aspect ratio for the crop, some adjustment might be needed.

In the example below we have a blueprint with aspectRatio 0.5 (i.e. portrait). A quite tall controlpoint with portrait aspect ratio is placed on the blueprint.
![[image 4.png|404]]

In order to fit the controlpoint in our crop as well as maintain the crop’s target aspect ratio we will have to extend the crop outside of the blueprint. The middle part will be extracted from the blueprint jpg. The green areas on the side will be added as white pixels to the final crop jpg. this ensures that every crop file can be treated the same as they have the same aspect ratio.

The placement of the crop beneath the controlpoint is done with the specified crop coordinates saved alongside the crop file. If the crop is extended, the coordinates are adjusted for correct placement. In this example `crop.left` will actually be negative.


![[image 5.png|606]]

## Crop resolution adjustment
Crop resolution is specified in crop_type. Currently, cropType 1 is set at 500px and minimum 13% of the blueprint.

If a controlpoint spans a larger area of the blueprint, the resulting crop will be larger than the specified minimum. This will fit a larger portion of the blueprint into the specified resolution (i.e. more details), which might impede readability upon zooming. Our solution is to automatically  increase the pixel-resolution of the crop-file with the same factor as the crop is increased from the specified minimum. The resolution increase is capped at 2x, which gives better readability without too large file sizes.

Below are examples from report 2097.107.5.05 (Inklädnad, PM Fog). The bounding box of this bracket controlpoint spans 24% of the blueprint.

### 1. Full resolution (i.e. no cropping)
Our previous solution did not suffer from low resolution since the complete blueprint was embedded for each crop, i.e. normally 4000px

File size = complete blueprint size in our previous solution, i.e. 780 KB.
![[image 2.png|654]]


### 2. Too low resolution
Our new solution where crop files are created for each blueprint crop suffered from too low resolution. The below image is 500px wide.

File size for crop: 24 KB
![[d7d26d0e-626f-4f13-9581-58e244a8610d.png]]


### 3. Adjusted resolution based on boundingbox
The boundingbox in this example has a width of 0.24. Minimum crop size is 0.13. To compensate for the larger crop we will increase the resolution by 0.24/0.13 = 1.85. The pixel width of the below image is 925px (500x1.85), which gives adequate visibility without too large file size.

File size for crop: 42 KB.
![[image 3.png]]


## Debugging
If any faulty crops turns up we might need some debugging tools. Crop generating could for example fail if the crop coordinates are wrongly calculated so the are outside of the blueprint jpg file.
- If a crop fails, crop details will be logged to Datadog automatically

For manual debugging of a specific controlpoint crop, set “isDebug” at the root of the shape-object in question.

## Test reports
```
--Malins stora fellista (107.?)
select report_enqueue_debug_data(1, 'dd7a6c28-6ac1-49ea-9108-21e7ee8e7c3d');

select preview_status_id, * 
from report where guid = 'dd7a6c28-6ac1-49ea-9108-21e7ee8e7c3d';

select * from report_data 
where report_guid = 'dd7a6c28-6ac1-49ea-9108-21e7ee8e7c3d' 
and type_id = 3;
```

```
--Teds stora bilaga (501.3)
select report_enqueue_debug_data(1, '76e9abc7-0d3a-4f3a-a050-74c73753c6d0');

select preview_status_id, * 
from report 
where guid = '76e9abc7-0d3a-4f3a-a050-74c73753c6d0';

select * from report_data 
where report_guid = '76e9abc7-0d3a-4f3a-a050-74c73753c6d0' 
and type_id = 3;
```

```
--Daniels BL med revideringsmoln ända ut i ritningskanten = extend
select report_enqueue_debug_data(1, '304fa564-9f9c-4203-84ab-0c319f1cce37');

select preview_status_id, * 
from report 
where guid = '304fa564-9f9c-4203-84ab-0c319f1cce37';

select * from 
report_data 
where report_guid = '304fa564-9f9c-4203-84ab-0c319f1cce37' 
and type_id = 3;
```

```
--Inklädnad Alex, test av resolution-ökning
select report_enqueue_debug_data(1, '5a4efb2a-caa7-47d6-9e74-1c8bcc898d09');

select preview_status_id, * 
from report 
where guid = '5a4efb2a-caa7-47d6-9e74-1c8bcc898d09';

select * 
from report_data where report_guid = '5a4efb2a-caa7-47d6-9e74-1c8bcc898d09' 
and type_id = 3;
```

```
--Målning, tågarpskolan
select report_enqueue_debug_data(1, '0938d410-6c0f-4d78-82a4-068a8a58c4c5');

select preview_status_id, * 
from report 
where guid = '0938d410-6c0f-4d78-82a4-068a8a58c4c5';

select * from report_data 
where report_guid = '0938d410-6c0f-4d78-82a4-068a8a58c4c5' 
and type_id = 3;
```

