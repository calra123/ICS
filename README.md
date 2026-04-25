# ICS
This project sprouted from trying to manually create an ics file. I built [Timo](https://timo-web.pages.dev)

# About Timo
Timo is a web-app to create Calendar events/reminders and directly download the ics to share with multiple people.

New use cases:
- Creating recurring reminder on behalf of parents.
- Inviting people for housewarming.
- Organizing protests.

Note: The reminders sent this way are local and won't be synced in case of date-time change.

Features:
- Easy to share
- No email ID's required.

# Why did I build this?
Often times, I wanted to remind my brother about certain, odd tasks, like "hey order AA batteries for the remote", even though I have his email-id, I didn't want the reminder to buzz on my phone. Turns out I have a lot of usecases, and I have used it fairly often, for meeting up with friends and hangouts, I have started sending ics files with time and maps location. It helps everyone be reminded and be approximately on time :) 

# TechStack
- plain html, js
- tailwindcss (after initial skepticism,iss becoming fun)

# [Legacy] how to manually create an ICS file

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

```
date --utc +%Y%m%dT%H%M%SZ
```

Hope it helps!
