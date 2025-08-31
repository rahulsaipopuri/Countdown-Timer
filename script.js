let timer = null;
let timeLeft = 0;
let totalTime = 0;

function updateMinTime() {
    const dateInput = document.getElementById("countdownDate");
    const timeInput = document.getElementById("countdownInput");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    dateInput.min = todayStr;
    if (!dateInput.value) dateInput.value = todayStr;

    let minTime = "";
    if (dateInput.value === todayStr) {
        const nextMinute = new Date();
        nextMinute.setMinutes(nextMinute.getMinutes() + 1);
        minTime = nextMinute.toTimeString().slice(0, 5);
    } else {
        minTime = "00:00";
    }

    timeInput.min = minTime;
    if (!timeInput.value || timeInput.value < minTime) {
        timeInput.value = minTime;
    }
}

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
    totalTime = timeLeft;

    timer = setInterval(() => {
        timeLeft -= 1000;
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("timer1").textContent = "00:00:00";
            document.getElementById("timer1").classList.add("finished");
            document.querySelector('.progress-circle-fg').style.strokeDashoffset = 0;

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
    display += `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    document.getElementById("timer1").textContent = display;
    document.getElementById("timer1").classList.remove("finished");

    // Update progress ring
    const progress = (timeLeft / totalTime) * 598;
    document.querySelector('.progress-circle-fg').style.strokeDashoffset = progress;
}

function resetTimer() {
    clearInterval(timer);
    document.getElementById("timer1").textContent = "00:00:00";
    document.querySelector('.progress-circle-fg').style.strokeDashoffset = 598;
    updateMinTime();
    document.getElementById("timer1").classList.remove("finished");

    const alarm = document.getElementById("alarmSound");
    alarm.pause();
    alarm.currentTime = 0;
}