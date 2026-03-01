export let isSimulating = false;
let simulatedHour = 12;
let simulationResetTimeout = null;

export function getPSTTime() {
  if (isSimulating) {
    return { hour: simulatedHour, minute: 0 };
  }

  const pstLocaleOptions = {
    timeZone: "America/Los_Angeles",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  };
  const pstPartsString = new Date().toLocaleString("en-US", pstLocaleOptions);

  const [hourString, minuteString] = pstPartsString.split(":");
  const currentHour = parseInt(hourString, 10) % 24;
  const currentMinute = parseInt(minuteString, 10);

  return { hour: currentHour, minute: currentMinute };
}

export function getCurrentTimeTheme() {
  const { hour } = getPSTTime();
  if (isDaytime(hour)) return "bg-sunny";
  if (isEvening(hour)) return "bg-evening";
  return "bg-dark";
}

function isDaytime(hour) {
  return hour >= 6 && hour < 17;
}

function isEvening(hour) {
  return hour >= 17 && hour < 20;
}

export function formatTimeDisplay(hour) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

const SUNRISE_HOUR = 6;
const SUNSET_HOUR = 18;
const NIGHT_START_HOUR = 20;

export function updateCelestialPosition(hour, minute, instantaneous = false) {
  const celestial = document.querySelector(".celestial-body");
  if (!celestial) return;

  setTransitionStyle(celestial, instantaneous);

  if (isSunVisible(hour)) {
    applyCelestialPosition(
      celestial,
      calculateSunPosition(hour, minute),
      "sun",
    );
  } else if (isCelestialBodyHidden(hour)) {
    hideCelestialBody(celestial);
  } else {
    applyCelestialPosition(
      celestial,
      calculateMoonPosition(hour, minute),
      "moon",
    );
  }
}

function setTransitionStyle(celestial, instantaneous) {
  const transition = instantaneous
    ? "none"
    : "top 0.5s ease-out, left 0.5s ease-out, background 1.5s ease-out, opacity 1s ease";
  celestial.style.transition = transition;
}

function isSunVisible(hour) {
  return hour >= SUNRISE_HOUR && hour < SUNSET_HOUR;
}

function isCelestialBodyHidden(hour) {
  return hour >= SUNSET_HOUR && hour < NIGHT_START_HOUR;
}

function calculateSunPosition(hour, minute) {
  const dayMinutesElapsed = (hour - SUNRISE_HOUR) * 60 + minute;
  const totalDaylightMinutes = (SUNSET_HOUR - SUNRISE_HOUR) * 60;
  const sunProgress = dayMinutesElapsed / totalDaylightMinutes;

  return calculatePositionCoordinates(sunProgress, 70);
}

function calculateMoonPosition(hour, minute) {
  const totalNightDurationHours = 24 - NIGHT_START_HOUR + SUNRISE_HOUR;
  const moonMinutesElapsed = getMoonMinutesElapsed(hour, minute);
  const totalNightMinutes = totalNightDurationHours * 60;
  const moonProgress = moonMinutesElapsed / totalNightMinutes;

  return calculatePositionCoordinates(moonProgress, 60);
}

function getMoonMinutesElapsed(hour, minute) {
  if (hour >= NIGHT_START_HOUR) {
    return (hour - NIGHT_START_HOUR) * 60 + minute;
  }
  return (24 - NIGHT_START_HOUR + hour) * 60 + minute;
}

function calculatePositionCoordinates(progress, arcHeightMultiplier) {
  const minHorizontalPercentage = 5;
  const horizontalSpanPercentage = 90;
  const horizonLevelPercentage = 85;

  const horizontalPosition =
    minHorizontalPercentage + progress * horizontalSpanPercentage;
  const verticalArcOffset = Math.sin(progress * Math.PI) * arcHeightMultiplier;
  const verticalPosition = horizonLevelPercentage - verticalArcOffset;

  return { horizontalPosition, verticalPosition };
}

function applyCelestialPosition(celestial, position, bodyType) {
  celestial.dataset.body = bodyType;
  celestial.style.opacity = "1";
  celestial.style.top = `${position.verticalPosition}%`;
  celestial.style.left = `${position.horizontalPosition}%`;
}

function hideCelestialBody(celestial) {
  celestial.dataset.body = "hidden";
  celestial.style.opacity = "0";
}

export function updatePSTTimeDisplay() {
  const profilesPanel = document.getElementById("profiles-panel");
  if (!profilesPanel || !profilesPanel.classList.contains("active-panel")) {
    return;
  }

  const timeDisplay = document.getElementById("pst-time-display");
  const { hour, minute } = getPSTTime();

  if (timeDisplay) {
    if (isSimulating) {
      timeDisplay.innerHTML = `<span style="animation: blink 2s infinite;">SIMULATED</span>`;
    } else {
      timeDisplay.textContent = getFormattedPSTTime();
    }
  }

  updateCelestialPosition(hour, minute, isSimulating);
}

function getFormattedPSTTime() {
  return (
    new Date().toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
    }) + " PST"
  );
}

export function setupTimeSimulator() {
  const slider = document.getElementById("time-slider");
  const sliderDisplay = document.getElementById("slider-time-display");
  if (!slider || !sliderDisplay) return;

  initializeSlider(slider, sliderDisplay);
  attachSliderListener(slider, sliderDisplay);
}

function initializeSlider(slider, sliderDisplay) {
  if (!isSimulating) {
    const { hour } = getPSTTime();
    slider.value = hour;
    sliderDisplay.textContent = formatTimeDisplay(hour);
  }
}

function attachSliderListener(slider, sliderDisplay) {
  slider.addEventListener("input", (event) => {
    startSimulation(event, sliderDisplay);

    clearTimeout(simulationResetTimeout);
    simulationResetTimeout = setTimeout(() => {
      resetSimulation();
    }, 5000);
  });
}

function startSimulation(event, sliderDisplay) {
  isSimulating = true;
  simulatedHour = parseInt(event.target.value, 10);
  sliderDisplay.textContent = formatTimeDisplay(simulatedHour);

  applyCurrentTheme();
  updatePSTTimeDisplay();
}

export function resetSimulation() {
  if (simulationResetTimeout) {
    clearTimeout(simulationResetTimeout);
    simulationResetTimeout = null;
  }

  isSimulating = false;

  const slider = document.getElementById("time-slider");
  const sliderDisplay = document.getElementById("slider-time-display");

  if (slider && sliderDisplay) {
    const { hour } = getPSTTime();
    slider.value = hour;
    sliderDisplay.textContent = formatTimeDisplay(hour);
  }

  applyCurrentTheme();
  updatePSTTimeDisplay();
}

function applyCurrentTheme() {
  const profilesPanel = document.getElementById("profiles-panel");
  if (!profilesPanel || !profilesPanel.classList.contains("active-panel")) {
    return;
  }

  document.body.className = "";
  document.body.classList.add(getCurrentTimeTheme());
}
