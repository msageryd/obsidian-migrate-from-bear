# New status-scheme due to interactive reports, R2
#plantrail/reports #type/prestudy #todo/document

## Previous attempt to solve this
Here is a link to an overthought solution
[New status-scheme due to interactive reports](bear://x-callback-url/open-note?id=AA915C4F-D3AD-4442-8889-64523FAA232F-88858-0001AE309B289678&show_window=yes&new_window=yes)

## Background
We are currently implementing a new interactive reporting engine. The interaction will take place before the report is sent to JSReport for final rendering. We need to keep track of reports currently under manual control, i.e. interactive report building.

The reasonable solution is to use the first status code in our status scheme, i.e. **1**, to indicate the manual state of a report.

## ## Current scheme
![](New%20status-scheme%20due%20to%20interactive%20reports,%20R2/D471DEDD-01CD-417C-91BA-88DA114E0958.png)

## New scheme
The current first status, **preflight started (1)**, will never be used. Status 1-5 are synchronous , and there will not be any worker queue serving these statuses. 

A report can only get status 2-4 if a preflight check is performed. During preflight check, the report will hold its current status, whichever it is. Hence, status "preflight started" can never occur.

So, the simple solution is to rename status **1** to "Manual interaction in reporting GUI). No other changes are needed.


![](New%20status-scheme%20due%20to%20interactive%20reports,%20R2/37775B31-CC20-4E5D-BCE2-E1D0D4E81C40.png)