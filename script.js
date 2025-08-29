let timer = null;
let timeLeft = 0;

function updateMinTime() {
  const dateInput = document.getElementById("countdownDate");
  const timeInput = document.getElementById("countdownInput");

  const now = new Date();

  // set default date = today
  const todayStr = now.toISOString().split("T")[0];
  dateInput.min = todayStr;
  if (!dateInput.value) dateInput.value = todayStr;

  // set min time = current time + 1 min (if today is chosen)
  let minTime = "";
  if (dateInput.value === todayStr) {
    const nextMinute = new Date();
    nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    minTime = nextMinute.toTimeString().slice(0, 5);
  } else {
    minTime = "00:00"; // no restriction for future dates
  }

  timeInput.min = minTime;
  if (!timeInput.value || timeInput.value < minTime) {
    timeInput.value = minTime;
  }
}

// Keep min updated every 30s
setInterval(updateMinTime, 30 * 1000);
window.onload = updateMinTime;

function startCountdown() {
  if (timer) clearInterval(timer);
  updateMinTime();

  const dateInput = document.getElementById("countdownDate").value;
  const timeInput = document.getElementById("countdownInput").value;

  if (!dateInput || !timeInput) {
    alert("Please select both date and time!");
    return;
  }

  const [hours, minutes] = timeInput.split(":").map(Number);
  const [year, month, day] = dateInput.split("-").map(Number);

  let countdownDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const now = new Date();

  if (countdownDate <= now) {
    alert("Please select a future date/time!");
    return;
  }

  timeLeft = countdownDate.getTime() - now.getTime();

  timer = setInterval(() => {
    timeLeft -= 1000;
    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("timer1").textContent = "00:00:00";
      document.getElementById("timer1").classList.add("finished");

      // Play alarm in loop
      const alarm = document.getElementById("alarmSound");
      alarm.currentTime = 0;
      alarm.play();

      alert("Timer has finished!");
      return;
    }
    updateTimer();
  }, 1000);

  updateTimer();
}

function updateTimer() {
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  let display = "";
  if (days > 0) {
    display += days + "d ";
  }
  display +=
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  document.getElementById("timer1").textContent = display;
  document.getElementById("timer1").classList.remove("finished");
}

function resetTimer() {
  clearInterval(timer);
  document.getElementById("timer1").textContent = "00:00:00";
  updateMinTime();
  document.getElementById("timer1").classList.remove("finished");

  // Stop alarm
  const alarm = document.getElementById("alarmSound");
  alarm.pause();
  alarm.currentTime = 0;
}
