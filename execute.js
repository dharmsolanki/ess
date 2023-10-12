var sevenHr;
var Four;
var six;

// content.js

// Define the HTML code you want to append

(function () {
  if (localStorage) {
    hourstime();
    wikTime();
  }
})();

function hourstime() {
  var today = new Date();
  var date =
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  const url = `https://ess.infibeam-inc.ooo/cosec/api/Common/InitializeData?cntrlPageName=Asp.WebForms_frmDailyAttendanceView_aspx&pDate=${date}&userId=${[
    localStorage["SecurityManager.username"],
  ]}`;
  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      Token: localStorage["SecurityManager.token"],
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data?.modal) {
        const [datePart, timePart] =
          data?.modal?.GrdPunchDetail[0]?.comments.split(" ");
        if (data?.modal?.TxtNetWrkHrs === "     ") {
          sevenHr = addTime(timePart, 7, 30);
          Four = addTime(timePart, 4, 0);
          six = addTime(timePart, 6, 0);
        } else {
          const reversedArray = data?.modal?.GrdPunchDetail.reverse();
          const [datePart, lastintime] = reversedArray[0]?.comments.split(" ");

          sevenHr = calculateRemainingTime(
            data?.modal?.TxtNetWrkHrs,
            "07:30",
            lastintime
          );

          six = calculateRemainingTime(
            data?.modal?.TxtNetWrkHrs,
            "06:00",
            lastintime
          );
          Four = calculateRemainingTime(
            data?.modal?.TxtNetWrkHrs,
            "04:00",
            lastintime
          );
        }

        const customHTMLForSeven = `
        <div class="text-center">
        <div class="d-flex justify-content-center align-items-center">
  <table class="table table-bordered" style="position: relative; display: inline-table; width: 94%;">
    <thead>
      <tr>
        <th class="text-center" style="background-color: rgb(221, 221, 221);">Hours</th>
        <th class="text-center" style="background-color: rgb(221, 221, 221);">Time</th>
        <th class="text-center" style="background-color: rgb(221, 221, 221);">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>7:30 Hours</td>
        <td class="seven_hours"></td>
        <td class="seven_hours_status"></td>
      </tr>
      <tr>
        <td>6:00 Hours</td>
        <td class="six_hours"></td>
        <td class="six_hours_status"></td>
      </tr>
      <tr>
        <td>4:00 Hours</td>
        <td class="four_hours"></td>
        <td class="four_hours_status"></td>
      </tr>
    </tbody>
  </table>
</div>
</div>
      `;

        // Find the target element where you want to append the custom HTML
        const targetElement = document.querySelector(".modal-body"); // Replace with the actual class name of the target element

        if (targetElement) {
          // Create a new HTML element from the custom HTML string
          const customElement = document.createElement("div");
          customElement.innerHTML = customHTMLForSeven;
          // customElement.innerHTML = customHTMLForSix;

          // Append the custom element to the target element
          targetElement.appendChild(customElement);

          // Find the input element with class 'hours' within the custom element
          const title = customElement.querySelector(".heading");
          const input1 = customElement.querySelector(".seven_hours");
          const input2 = customElement.querySelector(".six_hours");
          const input3 = customElement.querySelector(".four_hours");
          input1.textContent = sevenHr["timeDifference"];
          input2.textContent = six["timeDifference"];
          input3.textContent = Four["timeDifference"];
          const status1 = customElement.querySelector(".seven_hours_status");
          const status2 = customElement.querySelector(".six_hours_status");
          const status3 = customElement.querySelector(".four_hours_status");

          // Specify the target time in 12-hour format (e.g., "5:30 PM")
          const targetTime1 = sevenHr["timeDifference"];
          const targetTime2 = six["timeDifference"];
          const targetTime3 = Four["timeDifference"];

          // Get the current date and time
          const currentTime = new Date();

          // Format the current time to match the target time format (h:mm a)
          const currentFormattedTime = currentTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          
          if (currentFormattedTime > targetTime1) {
            status1.innerHTML =
              '<span class="completed-text" style="color:rgb(108,242,108)">&nbsp;Allowed</span>';
          } else {
            status1.innerHTML =
              '<span class="completed-text" style="color:rgb(240, 55, 55)">&nbsp;Not Allowed</span>';
          }

          if (currentFormattedTime > targetTime2) {
            status2.innerHTML =
              '<span class="completed-text" style="color:rgb(108,242,108)">&nbsp;Allowed</span>';
          } else {
            status2.innerHTML =
              '<span class="completed-text" style="color:rgb(240, 55, 55)">&nbsp;Not Allowed</span>';
          }

          if (currentFormattedTime > targetTime3) {
            status3.innerHTML =
              '<span class="completed-text" style="color:rgb(108,242,108)">&nbsp;Allowed</span>';
          } else {
            status3.innerHTML =
              '<span class="completed-text" style="color:rgb(240, 55, 55)">&nbsp;Not Allowed</span>';
          }

          // Calculate remainingHours and remainingMinutes here
          const remainingHours = 7; // Replace with your calculation
          const remainingMinutes = 30; // Replace with your calculation

          // Call Todayhtml and pass the calculated values as arguments
          Todayhtml(remainingHours, remainingMinutes, data);
        }
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function wikTime() {
  var today = new Date();
  var date = today.getFullYear();
  const url = `https://ess.infibeam-inc.ooo/cosec/api/DailyAttendanceView/getDataForUserId?IsDatePicker=false&Para1=10&Para2=${date}&TemplateId=1&userId=${[
    localStorage["SecurityManager.username"],
  ]}`;
  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      Token: localStorage["SecurityManager.token"],
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      calculateAndAddFields(data.result.AttendanceDetail);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function calculateRemainingTime(breakTime, initialTime, lastintime) {
  const [workHours, workMinutes] = initialTime.split(":").map(Number);
  const difference = getTimeDifference(initialTime, breakTime);
  const sum = addTimes(difference?.hours, difference?.minutes, lastintime);
  const result = {
    totalHours: `${workHours}:${workMinutes}`,
    timeDifference: `${convertTo12HourFormat(sum.hours, sum.minutes)} `,
  };

  return result;
}

function addTimes(hours1, minutes1, timeString2) {
  if ((hours1, minutes1, timeString2)) {
    const [hours2, minutes2] = timeString2.split(":").map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    const totalMinutesSum = totalMinutes1 + totalMinutes2;

    const hoursSum = Math.floor(totalMinutesSum / 60);
    const minutesSum = totalMinutesSum % 60;

    return {
      hours: hoursSum,
      minutes: minutesSum,
    };
  }
}

function getTimeDifference(timeString1, timeString2) {
  const [hours1, minutes1] = timeString1.split(":").map(Number);
  const [hours2, minutes2] = timeString2.split(":").map(Number);

  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  const differenceInMinutes = totalMinutes1 - totalMinutes2;

  const hoursDifference = Math.floor(differenceInMinutes / 60);
  const minutesDifference = differenceInMinutes % 60;

  return {
    hours: hoursDifference,
    minutes: minutesDifference,
  };
}

function convertTo12HourFormat(hours, minutes) {
  if ((hours, minutes)) {
    let period = "AM";
    let formattedHours = hours;

    if (hours >= 12) {
      period = "PM";
      formattedHours = hours === 12 ? hours : hours - 12;
    }

    if (formattedHours === 0) {
      formattedHours = 12;
    }

    return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
  }
}

function addTime(initialTime, hoursToAdd, minutesToAdd) {
  const [initialHours, initialMinutes] = initialTime.split(":").map(Number);
  const totalHoursToAdd = initialHours + hoursToAdd;
  const totalMinutesToAdd = initialMinutes + minutesToAdd;
  const additionalHours = Math.floor(totalMinutesToAdd / 60);
  const updatedMinutes = totalMinutesToAdd % 60;
  const finalHours = totalHoursToAdd + additionalHours;
  const finalMinutes = updatedMinutes;
  const formattedTime = `${String(finalHours).padStart(2, "0")}:${String(
    finalMinutes
  ).padStart(2, "0")}`;

  const hours = String(finalHours).padStart(2, "0");
  const minutes = String(finalMinutes).padStart(2, "0");

  const result = {
    totalHours: `${hoursToAdd}:${minutesToAdd}`,
    timeDifference: `${convertTo12HourFormat(hours, minutes)}. `,
  };

  return result;
}

// totel

function calculateAndAddFields(data) {
  var today = new Date();
  var date =
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  for (let i = 0; i < data.length; i++) {
    const entry = data[i];

    if (entry.FirstHalf === "PR" && entry.SecondHalf === "PR") {
      entry.TotalTime = calculateTimeDifference("7:30", entry.NetWorkTime);
    } else if (entry.FirstHalf === "PR" && entry.SecondHalf === "AB") {
      entry.TotalTime = calculateTimeDifference("4:15", entry.NetWorkTime);
    } else if (entry.FirstHalf === "AB" && entry.SecondHalf === "PR") {
      entry.TotalTime = calculateTimeDifference("4:15", entry.NetWorkTime);
    } else if (entry.FirstHalf === "AB" && entry.SecondHalf === "AB") {
      entry.TotalTime = entry.NetWorkTime;
    } else if (entry.FirstHalf === "WO" && entry.SecondHalf === "WO") {
      entry.TotalTime = entry.NetWorkTime;
    }
  }
  calculateTotalWorkingHours(data);
  localStorage.setItem("dt", JSON.stringify(data));
  return data;
}

function calculateTimeDifference(time1, time2) {
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);

  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  const differenceMinutes = totalMinutes2 - totalMinutes1;

  const sign = differenceMinutes >= 0 ? "+" : "-";
  const absoluteDifferenceMinutes = Math.abs(differenceMinutes);

  const hoursDifference = Math.floor(absoluteDifferenceMinutes / 60);
  const minutesDifference = absoluteDifferenceMinutes % 60;

  const formattedHours = hoursDifference.toString().padStart(2, "0");
  const formattedMinutes = minutesDifference.toString().padStart(2, "0");

  return `${sign}${formattedHours}:${formattedMinutes}`;
}

function calculateTotalWorkingHours(data) {
  let totalTimeInMinutes = 0;

  for (const item of data) {
    if (item.TotalTime) {
      let operation = item.TotalTime[0];
      if (operation != "-" && operation != "+") {
        operation = "+";
      }
      const timeString = item.TotalTime.substring(1);
      totalTimeInMinutes += performTimeOperation(operation, timeString);
    }
  }

  const totalHours = Math.trunc(Math.abs(totalTimeInMinutes) / 60);
  const totalMinutesRemaining = Math.abs(totalTimeInMinutes) % 60;

  const totalTimeString = `${
    totalTimeInMinutes < 0 ? "-" : "+"
  }${totalHours}:${totalMinutesRemaining}`;

  const customHTMLForSeven = `
  <div class="text-center" style="margin-top:5px">
  <div class="d-flex justify-content-center align-items-center">
  <table
    class="table table-bordered"
    style="position: relative; display: inline-table; width: 94%; border-collapse: collapse;"
  >
    <thead>
      <tr>
        <th class="text-center" style="background-color: rgb(221, 221, 221); padding: 10px;">
          Extra Hours
        </th>
        <th class="text-center extra_hours" style="padding: 10px;">
          <span class="extra-hours-text"></span>
        </th>
      </tr>
    </thead>
  </table>
  </div>
  </div>
  `;
  
  const targetElement = document.querySelector(".modal-body");
  if (targetElement) {
    // Create a new HTML element from the custom HTML string
    const customElement = document.createElement("div");
    customElement.innerHTML = customHTMLForSeven;
  
    // Append the custom element to the target element
    targetElement.appendChild(customElement);
    const extraHoursText = customElement.querySelector(".extra-hours-text");
    const [hours,minutes] = totalTimeString.split(':');
    const formattedTime = `${hours} Hours ${minutes} Minutes`
  
    if (formattedTime) {
      extraHoursText.textContent = formattedTime;
  
      // Check the prefix of totalTimeString and set the text color accordingly
      if (formattedTime.startsWith("+")) {
        extraHoursText.style.color = "green";
      } else if (formattedTime.startsWith("-")) {
        extraHoursText.style.color = "red";
      }
    }
  }
}

function performTimeOperation(operation, timeString) {
  const sign = operation === "+" ? 1 : -1;
  const [hours, minutes] = timeString.split(":").map(Number);
  const totalMinutes = sign * (hours * 60 + minutes);
  return totalMinutes;
}

function Todayhtml(remainingHours, remainingMinutes, data) {
  var today = new Date();
  var date =
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

  const formattedDate = formatDate(date);
  const message = `Greetings! On ${formattedDate}, your this month's extra time is ${remainingHours} hours and ${remainingMinutes} minutes.`;

  // Rest of your code for displaying the message
}

function formatDate(inputDate) {
  const dateComponents = inputDate.split("/");
  const day = parseInt(dateComponents[0], 10);
  const month = parseInt(dateComponents[1], 10);
  const year = parseInt(dateComponents[2], 10);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dayString;
  if (day >= 11 && day <= 13) {
    dayString = day + "th";
  } else {
    switch (day % 10) {
      case 1:
        dayString = day + "st";
        break;
      case 2:
        dayString = day + "nd";
        break;
      case 3:
        dayString = day + "rd";
        break;
      default:
        dayString = day + "th";
        break;
    }
  }

  const formattedDate = `${dayString} of ${monthNames[month - 1]} ${year}`;

  return formattedDate;
}
