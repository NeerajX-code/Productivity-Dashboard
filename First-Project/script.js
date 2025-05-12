let weatherDetails = () => {
  fetch(
    `http://api.weatherapi.com/v1/current.json?key=061f571a72db499e8cf32917250805&q=gwalior`
  )
    .then((res) => res.json())
    .then((data) => {
      let sec1Left = document.querySelector(".sec1-left");
      let sec1right = document.querySelector(".sec1-right");

      sec1Left.innerHTML = `<p>${data.location.localtime}</p>
    <h1>${data.location.name}</h1>
    <h2>${data.location.region}</h2>
    <h2>${data.location.country}</h2>`;

      sec1right.innerHTML = `<div class="cloud"><img src="${data.current.condition.icon}">
    <h1>${data.current.condition.text}</h1></div>
    <h2>Humidity:${data.current.humidity}</h2>
    <h2>Temperature:${data.current.feelslike_c}<sup>Cel.</sup></h2>`;
      console.log(data);
    })
    .catch((err) => console.error("Error:", err));
};
weatherDetails();

let elemAll = document.querySelectorAll(".elem");
let AlldetailedElem = document.querySelectorAll(".detailedElem");

elemAll.forEach((elem, id) => {
  elem.addEventListener("click", (e) => {
    AlldetailedElem[id].style.display = "flex";
    document.querySelector("main").style.display = "none";
  });
});

let form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = document.querySelector("#taskInput");
  const areaInput = document.querySelector("#taskArea");
  const check = document.querySelector("#check");

  const titleValue = titleInput.value.trim();
  const areaValue = areaInput.value.trim();

  if (titleValue.length > 0) {
    const task = {
      titleInput: titleValue,
      areaInput: areaValue,
      important: check.checked,
    };

    // Get existing tasks or create new array
    let allTasks = JSON.parse(localStorage.getItem("TaskDetails")) || [];
    allTasks.push(task);
    localStorage.setItem("TaskDetails", JSON.stringify(allTasks));

    renderSingleTask(task);

    // Clear form inputs
    titleInput.value = "";
    areaInput.value = "";
    check.checked = false;
  }
});

let backBtn = document.querySelectorAll(".back");

backBtn.forEach((Btn) => {
  Btn.addEventListener("click", () => {
    let DetailedElem = Btn.closest(".detailedElem");
    DetailedElem.style.display = "none";
    document.querySelector("main").style.display = "flex";
  });
});

function renderSingleTask(data) {
  const importanceTag = data.important
    ? "<sup style='display:inline;'>Imp</sup>"
    : "";

  const todoCard = document.createElement("div");
  todoCard.className = "todo-card";
  todoCard.innerHTML = `
      <div class="todo-header">
        <h2>${data.titleInput}${importanceTag}</h2>
        <div><p>Marked as Complete</p><input type="checkbox" class="completeCheck"></div>
        <button class="todo-Btn">
          <i class="ri-arrow-down-s-line"></i>
        </button>
      </div>
      <div class="hiddenDetail" style="display: none;">
        <p>${
          data.areaInput.length === 0 ? "Details Not Given" : data.areaInput
        }</p>
      </div>
    `;
  let todoRight = document.querySelector(".todo-right");
  todoRight.appendChild(todoCard);

  const btn = todoCard.querySelector(".todo-Btn");
  const detail = todoCard.querySelector(".hiddenDetail");
  const completeCheck = todoCard.querySelector(".completeCheck");
  let todoHeader = document.querySelector(".todo-header");
  btn.addEventListener("click", () => {
    detail.style.display = detail.style.display === "block" ? "none" : "block";
    if (detail.style.display === "block") {
      todoHeader.style.borderBottomLeftRadius = "0px";
      todoHeader.style.borderBottomRightRadius = "0px";
    } else {
      todoHeader.style.borderBottomLeftRadius = "8px";
      todoHeader.style.borderBottomRightRadius = "8px";
    }
  });

  completeCheck.addEventListener("change", () => {
    if (completeCheck.checked) {
      todoCard.style.display = "none";

      // Get all tasks from localStorage
      let allTasks = JSON.parse(localStorage.getItem("TaskDetails")) || [];

      // Remove the matching task
      allTasks = allTasks.filter((t) => {
        return !(
          t.titleInput === data.titleInput && t.areaInput === data.areaInput
        );
      });

      // Save the updated list back
      localStorage.setItem("TaskDetails", JSON.stringify(allTasks));
    }
  });
}

function RenderTask() {
  try {
    const data = JSON.parse(localStorage.getItem("TaskDetails"));

    if (!Array.isArray(data)) {
      console.warn("TaskDetails is not an array. Resetting.");
      localStorage.setItem("TaskDetails", JSON.stringify([]));
      return;
    }

    data.forEach((task) => renderSingleTask(task));
  } catch (error) {
    console.log("Error parsing tasks from localStorage:", error);
    localStorage.setItem("TaskDetails", JSON.stringify([]));
  }
}

RenderTask();

function RenderDayPlanner() {
  let hours = Array.from({ length: 18 }, function (_, idx) {
    return `${6 + idx}:00 - ${7 + idx}:00`;
  });

  let wholeDaySum = "";

  hours.forEach((elem, id) => {
    wholeDaySum += ` <div class="day-time">
                <h1>${elem}</h1>
                <input type="text" placeholder="...." id="${id}">
            </div>`;
  });

  let DaySchedular = document.querySelector(".schedularBox");
  DaySchedular.innerHTML = wholeDaySum;

  let HoursInput = document.querySelectorAll(".day-time input");

  let HoursDetails = JSON.parse(localStorage.getItem("hoursDetails")) || {};
  HoursInput.forEach((input, id) => {
    input.addEventListener("input", function () {
      HoursDetails[id] = input.value;
      localStorage.setItem("hoursDetails", JSON.stringify(HoursDetails));
    });
  });
  HoursInput.forEach((input) => {
    input.value = HoursDetails[input.id] || "";
  });
}

RenderDayPlanner();

function RenderFocusMusic() {
  document.addEventListener("DOMContentLoaded", () => {
    function PomodoroTimer() {
      let timerange = null;
      let totalSeconds = 25 * 60;
      let Timer = document.querySelector(".timer");
      let start = document.querySelector(".start");
      let pause = document.querySelector(".pause");
      let reset = document.querySelector(".reset");

      function UpdateTimes() {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        Timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`;
      }

      start.addEventListener("click", () => {
        start.disabled = true;
        timerange = setInterval(() => {
          if (totalSeconds >= 0) {
            UpdateTimes();
            totalSeconds--;
          } else {
            clearInterval(timerange);
          }
        }, 1000);
      });

      pause.addEventListener("click", () => {
        start.disabled = false;
        clearInterval(timerange);
      });

      reset.addEventListener("click", () => {
        start.disabled = false;
        clearInterval(timerange);
        totalSeconds = 25 * 60;
        UpdateTimes();
      });
      UpdateTimes();
    }
    PomodoroTimer();
  });

  let audio = new Audio();

  const sounds = {
    rain: {
      name: "/First project/media/rain.mp3",
      duration: 30.01,
      isplaying: false,
    },
    forest: {
      name: "/First project/media/forest.mp3",
      duration: 28.03,
      isplaying: false,
    }, // Forest ambience
    lofi: {
      name: "/First project/media/Lofi songs.mp3",
      duration: 35.29,
      isplaying: false,
    }, // Fireplace crackling
  };
  let soundImg = document.querySelectorAll(".sound-img");
  soundImg.forEach((sound) => {
    sound.addEventListener("click", (e) => {
      // console.log(e.target.id.toLowerCase());
      startStopSound(e.target.id.toLowerCase());
    });
  });

  let playPause = document.querySelector("#startStop");
  let timeline = null;
  let isplaying = false;

  function startStopSound(song) {
  if (sounds[song]) {
    audio.loop = true;
    if (isplaying) {
      audio.pause();
      playPause.innerHTML = `<i class="ri-play-large-fill"></i> Play`;
      isplaying = false;
    } else {
      audio.pause(); // stop any previously playing audio
      audio = new Audio(sounds[song].name);
      audio.play();
      isplaying = true;

      // Remove previous sound class and add current one
      Object.keys(sounds).forEach(soundKey => {
        playPause.classList.remove(soundKey);
      });
      playPause.classList.add(song);

      playPause.innerHTML = `<i class="ri-pause-line"></i> Pause`;
    }
  }
}

  playPause.addEventListener("click", () => {
    let target = playPause.className;
    if (sounds[target]) {
      if (isplaying) {
        audio.pause();
        isplaying = false;
        playPause.innerHTML = `<i class="ri-play-large-fill"> Play`;
      } else {
        audio.play();
        isplaying = true;
        playPause.innerHTML = `<i class="ri-pause-line"></i> Pause`;
      }
    }
  });
}
RenderFocusMusic();


let themeBtn = document.querySelector(".theme");
let root = document.documentElement;
let key = 0;

themeBtn.addEventListener("click", function () {
  const themes = [
    {
      pri: "#e74c3c",
      pribackground: "#F93827",
      secBackground: "#fbeec1",
      triBackground: "#2c3e50",
    },
    {
      pri: "#2ecc71",
      pribackground: "#27ae60",
      secBackground: "#ecf0f1",
      triBackground: "#34495e",
    },
    {
      pri: "#9b59b6",
      pribackground: "#8e44ad",
      secBackground: "#fdf2ff",
      triBackground: "#2d074d",
    },
    {
      pri: "#f39c12",
      pribackground: "#f1c40f",
      secBackground: "#fff9e6",
      triBackground: "#7f6000",
    },
     {
      pri: "#3498db",
      pribackground: "#219B9D",
      secBackground: "#F2EFE7",
      triBackground: "#16404D",
    }
  ];

  const theme = themes[key];
  root.style.setProperty("--pri", theme.pri);
  root.style.setProperty("--pribackground", theme.pribackground);
  root.style.setProperty("--secBackground", theme.secBackground);
  root.style.setProperty("--triBackground", theme.triBackground);

  key = (key + 1) % themes.length; // cycle through themes
});