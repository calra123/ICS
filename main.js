const startDate = document.getElementById("start_date");
let today = new Date().toISOString().split("T")[0];
startDate.value = today;
const endDate = document.getElementById("end_date");
endDate.value = today;

function setMinEndDate() {
  endDate.min = startDate.value;
}

function updateEndTime() {
  const startTime = document.getElementById("start_time");
  const endTime = document.getElementById("end_time");
  const startDate = document.getElementById("start_date");
  const endDate = document.getElementById("end_date");

  if (!startTime.value || !startDate.value) return;

  // Create a date object from start date and time
  const startDateObj = new Date(`${startDate.value}T${startTime.value}`);

  // Add 1 hour
  const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);

  // Update end date and time inputs
  const endYear = endDateObj.getFullYear();
  const endMonth = String(endDateObj.getMonth() + 1).padStart(2, "0");
  const endDay = String(endDateObj.getDate()).padStart(2, "0");
  const endHours = String(endDateObj.getHours()).padStart(2, "0");
  const endMinutes = String(endDateObj.getMinutes()).padStart(2, "0");

  endDate.value = `${endYear}-${endMonth}-${endDay}`;
  endTime.value = `${endHours}:${endMinutes}`;

  // Refresh min end date validation
  setMinEndDate();
}

startDate.addEventListener("input", setMinEndDate);
document.getElementById("start_time").addEventListener("change", updateEndTime);
document.getElementById("start_date").addEventListener("change", updateEndTime);

let rrule = "";
const freqCheckbox = document.getElementById("checkbox");
freqCheckbox.addEventListener("change", function () {
  const freqContainer = document.getElementById("frequency_container");
  if (freqCheckbox.checked) {
    freqContainer.style.setProperty("display", "block");
  } else {
    freqContainer.style.setProperty("display", "none");
  }
});

// Centralized function to build the RRule string
function updateRRule() {
  // Find which radio is currently checked
  const selectedRadio = document.querySelector(
    'input[name="frequency_type"]:checked',
  );
  if (!selectedRadio) return; // Exit if nothing is selected yet

  const selectedFreq = selectedRadio.value;
  let FREQ = "";
  let interval = "";
  let byday = "";

  // Logic to grab the correct interval based on selection
  switch (selectedFreq) {
    case "daily":
      FREQ = "DAILY";
      interval = document.getElementById("daily_num").value;
      break;
    case "weekly":
      FREQ = "WEEKLY";
      interval = document.getElementById("weekly_num").value;
      const checkedDays = Array.from(
        document.querySelectorAll('input[name="day"]:checked'),
      ).map((cb) => cb.value);
      if (checkedDays.length > 0) {
        byday = `;BYDAY=${checkedDays.join(",")}`;
      }
      break;
    case "yearly":
      FREQ = "YEARLY";
      interval = document.getElementById("yearly_num").value;
      break;
  }

  const count = document.getElementById("count").value;

  // Build the final string
  rrule = `\nRRULE:FREQ=${FREQ};INTERVAL=${interval}${byday};COUNT=${count}\nSEQUENCE:0`;
}

// Attach listeners to Radio Buttons
const freqRadios = document.getElementsByName("frequency_type");
freqRadios.forEach((radio) => {
  radio.addEventListener("click", updateRRule);
  radio.addEventListener("change", updateRRule);
});

// Attach listeners to Text/Number Inputs
const inputs = ["daily_num", "weekly_num", "yearly_num", "count"];
inputs.forEach((id) => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener("input", updateRRule);
  }
});

const dayCheckboxes = document.getElementsByName("day");
dayCheckboxes.forEach((cb) => {
  cb.addEventListener("change", updateRRule);
});

function getEventData(event) {
  console.log("value of event", event);
  console.log("type of event", typeof event);
  event.preventDefault();
  const titleInput = document.getElementById("title").value.trim();
  if (!titleInput) {
    alert("Please enter an event title.");
    return;
  }

  const startDateInput = document.getElementById("start_date");
  const endDateInput = document.getElementById("end_date");
  const startTimeInput = document.getElementById("start_time");
  const endTimeInput = document.getElementById("end_time");
  const descriptionInput = document.getElementById("description");
  const locationInput = document.getElementById("location");

  const startTimestamp = `${startDateInput.value}T${startTimeInput.value}:00`;
  const endTimestamp = `${endDateInput.value}T${endTimeInput.value}:00`;
  const startDateObj = new Date(startTimestamp);
  const endDateObj = new Date(endTimestamp);

  if (endDateObj <= startDateObj) {
    alert("End date and time must be after the start date and time.");
    return;
  }

  const now = new Date();
  const dtStamp = iso8601Basic(now.toISOString()) + "Z";
  const uid = `${now.getTime()}-${Math.random().toString(36).substr(2, 9)}@timo.app`;

  const startT = iso8601Basic(startTimestamp);
  const endT = iso8601Basic(endTimestamp);

  const escapedTitle = escapeICS(titleInput);
  const escapedDesc = escapeICS(descriptionInput.value);
  const escapedLoc = escapeICS(locationInput.value);

  const freqCheckboxChecked = document.getElementById("checkbox").checked;
  if (freqCheckboxChecked) {
    const freqContainer = document.getElementById("frequency_container");
    freqContainer.style.setProperty("display", "block");
  }

  let icsTemplate = `
BEGIN:VCALENDAR
METHOD:PUBLISH
VERSION:2.0
PRODID:-//Timo//EN
BEGIN:VEVENT
DTSTAMP:${dtStamp}
UID:${uid}
DTSTART:${startT}
DTEND:${endT}`;

  let endIcs = `
SUMMARY:${escapedTitle}
DESCRIPTION:${escapedDesc}
LOCATION:${escapedLoc}
END:VEVENT
END:VCALENDAR
   `;

  if (freqCheckboxChecked) {
    icsTemplate = icsTemplate + rrule + endIcs;
  } else {
    icsTemplate = icsTemplate + endIcs;
  }

  let finalIcs = icsTemplate.trim();
  finalIcs = finalIcs.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
  return finalIcs;
}

function testFn(event) {
  const finalIcs = getEventData(event);
  const blob = new Blob([finalIcs], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const download = document.createElement("a");
  download.href = url;
  const titleInput = document.getElementById("title").value.trim();
  const downloadFileName = (titleInput.split(" ")[0] || "Event") + ".ics";
  download.download = downloadFileName;
  document.body.appendChild(download);

  download.click();
  document.body.removeChild(download);
  URL.revokeObjectURL(url);

  // Success Feedback
  const originalText = button.innerText;
  button.innerText = "Done!";
  button.classList.replace("bg-blue-800", "bg-green-600");

  // Clear inputs
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("location").value = "";

  setTimeout(() => {
    button.innerText = originalText;
    button.classList.replace("bg-green-600", "bg-blue-800");
  }, 2000);
}
function sendDataToCloudFlare() {
  // send ics file to cloudflare KV
}

function readDatafromKV() {
  // read the link
  // find the mapping
  // download the file
}
async function shareFile(event) {
  console.log("inside share file!");
  //  const cfLink = "https://calendar-worker.mailto-calra.workers.dev/save";
  const cfLink = "http://localhost:8787/save";
  const icsString = getEventData(event);
  let res = await fetch(cfLink, {
    method: "POST",
    body: icsString,
  });
  const data = await res.json();
  console.log("resp from worker", data);
  const shareLink = `${window.location.origin}${window.location.pathname}e/${data.id}`;

  alert(shareLink);
  // Send this to cloudflare.
  // const encoder = new TextEncoder();
  // const uint8Array = encoder.encode(icsString);
  const compressed = LZString.compressToEncodedURIComponent(icsString);
  //  const base64 = uint8Array.toBase64({ alphabet: "base64url" });
  console.log(compressed);
  //  const shareLink = `${window.location.origin}${window.location.pathname}#data=${base64}`;
  //  const shareLink = `${window.location.origin}${window.location.pathname}#data=${compressed}`;
  // 2. Create File directly from the typed array
  //
  //
  //  const file = new File([uint8Array], "event.ics", { type: "text/calendar" });
  //
  //  // 3. Debugging checks
  //  console.log("File size:", file.size);
  //  if (file.size === 0) return alert("File is empty!");
  //  //  const blob = new Blob([finalIcs], { type: "text/calendar" });
  const titleInput = document.getElementById("title").value.trim() || "Event";
  //  const fileName = title.replace(/[^a-z0-9]/gi, "_") + ".ics";
  //  if (navigator.canShare && navigator.canShare({ files: [file] })) {

  // const file = new File([blob], fileName, { type: "text/plain" });
  if (navigator.canShare) {
    try {
      await navigator.share({
        url: shareLink,
        // url: "https://google.com",
        title: "Event: " + titleInput,
        text: `Hello! I created an event reminder for you :). Download it and add it to your calendar \n`,
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Unable to share", err);
      }
    }
  } else {
    console.warn("Browser does not support sharing files.");
  }
}

const button = document.getElementById("button");
button.addEventListener("click", testFn);

const shareBtn = document.getElementById("share");
shareBtn.addEventListener("click", shareFile);

function iso8601Basic(date) {
  return date.toString().replace(/[-:.]/g, "");
}

function escapeICS(str) {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

// Initialization
setMinEndDate();
