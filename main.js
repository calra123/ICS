 let rrule =""
  const freq_checkbox = document.getElementById("checkbox")
  freq_checkbox.addEventListener("change", function(){

   const freq_container = document.getElementById("frequency_container")
   if (freq_checkbox.checked){
     console.log("we are in here!!!!");
    freq_container.style.setProperty("display", "block");
   }
    else {
    freq_container.style.setProperty("display", "none");
    console.log("HIde n ow!")
    }
  })

 const daily_radio = document.getElementById("daily");

 function handleFreqSelection(event) {
   const selectedFreq = event.target.value;
   console.log(selectedFreq);
   let FREQ = "";
   let interval = "";
   let days = [];
  switch(selectedFreq) {
   case "daily":
    FREQ = "DAILY";
    interval = document.getElementById("daily_num").value
    break;
   case "weekly":
     FREQ = "WEEKLY";
     interval = document.getElementById("weekly_num").value
     break;
   case "yearly":
     FREQ = "YEARLY"
     interval = document.getElementById("yearly_num").value
     break;
 }
   const count = document.getElementById("count").value
   rrule =
 `
RRULE:FREQ=${FREQ};INTERVAL=${interval};COUNT=${count}
 `
rrule = rrule.trim()
console.log(rrule);
}
 const freqRadios = document.getElementsByName("frequency_type")
freqRadios.forEach( radio =>{
   radio.addEventListener("change", handleFreqSelection)
 }
   
 )
 let FREQ = "";
function testFn(){
  console.log("submit triggered!");
  event.preventDefault();
  const title = document.getElementById("title").value;
  console.log("tile > ",title)
  const start_date= document.getElementById("start_date");
  console.log("hellooo")
  console.log(start_date.value)
  const end_date= document.getElementById("end_date");
  const start_time= document.getElementById("start_time");
  console.log(start_time.value)
  const end_time= document.getElementById("end_time");
  console.log("end time >>>>>", end_time.value);
  const description= document.getElementById("description");
  const start_timestamp = `${start_date.value}T${start_time.value}:00`
  const end_timestamp = `${end_date.value}T${end_time.value}:00`
  console.log(start_timestamp)
  console.log(end_timestamp)
  const start_T = iso8601Basic(start_timestamp);
  const end_T = iso8601Basic(end_timestamp);
  console.log(start_T);
  const freq_checkbox = document.getElementById("checkbox").checked
  if (freq_checkbox){
    const freq_container = document.getElementById("frequency_container")
    freq_container.style.setProperty("display", "block");
  }
  let ics_template =
   `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CalraCal//EN
BEGIN:VEVENT
DTSTAMP:${start_T} 
UID:${start_T}@CalraCal
DTSTART:${start_T}
DTEND:${end_T}
`

let end_ics =
`
SUMMARY:${title}
DESCRIPTION: ${description.value}
LOCATION: home
END:VEVENT
END:VCALENDAR
   `
end_ics.trim()
  if (freq_checkbox) {
    console.log(rrule);
    ics_template = ics_template + rrule + end_ics;
  }
  else {
    ics_template = ics_template + end_ics;
  }

  console.log(ics_template.trim());


  const final_ics = ics_template.trim(); 
  const blob = new Blob([final_ics], {type: "text/plain"});
  const url = URL.createObjectURL(blob);
  const download = document.createElement("a")
  download.href = url;
  const downloadFileName = title.split(" ")[0] + "Event.ics";
  download.download = downloadFileName;
  document.body.appendChild(download);
  download.click();
  document.body.removeChild(download)
  URL.revokeObjectURL(url);
  console.log(url); console.log("it worked!")
}

const form = document.getElementById("form");
//form.addEventListener("submit", testFn);
button.addEventListener("click", testFn)

function iso8601Basic(date) {
  // Note to self: this gives UTC time
  const  tempdate = new Date(date).toISOString();
  console.log(tempdate);
  const basicDate = tempdate.toString().replace(/[-:.]/g, "");
  return basicDate
}


// form.addEventListener("submit", saveFile);
