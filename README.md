# ICS
how to manually create an ICS file

Has two calendar tags: BEGIN and END

```
BEGIN:VCALENDAR // start calendar tag
VERSION:2.0 // version of the ICAL protocol
PRODID:-//CalraCal//EN //random string
BEGIN:VEVENT //start event tag
DTSTAMP: 20260114T064638Z
UID:20260114T064638Z@CalraCal //use timestamp + any string for unique 
DTSTART:20260114T074638Z
DTEND:20260114T075538Z //timestamp in ISO 8601 format
SUMMARY: test 
DESCRIPTION: manual ics file
LOCATION: home
END:VEVENT // end event tag
END:VCALENDAR // end calendar tag
```
Please look at the sample ICS file to manually create an event
Don't paste this directly!

The sampleEvent.ics file has been working on Google Calendar as of 14 January 2026.

On Linux, use this cmd to generate the timestamp in this format:

```date --utc +%Y%m%dT%H%M%SZ
```


