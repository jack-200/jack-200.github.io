let isSimulatingMoon = false;
let moonSimulationResetTimeout = null;

const LUNAR_CYCLE_DAYS = 29.53058868;
const EPOCH_MS = new Date("2000-01-06T18:14:00Z").getTime();
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const RESET_TIMEOUT_MS = 5000;

export function getLiveMoonPhasePercent() {
  const nowMs = new Date().getTime();
  const diffDays = (nowMs - EPOCH_MS) / MILLISECONDS_PER_DAY;
  const phasePercent = (diffDays % LUNAR_CYCLE_DAYS) / LUNAR_CYCLE_DAYS;
  return normalizePhasePercent(phasePercent);
}

function normalizePhasePercent(phasePercent) {
  return phasePercent < 0 ? phasePercent + 1 : phasePercent;
}

export function updateGlobalBackgroundMoon() {
  const slider = document.getElementById("moon-slider");
  let phase = getLiveMoonPhasePercent();
  if (isSimulatingMoon && slider) {
    phase = parseFloat(slider.value) / LUNAR_CYCLE_DAYS;
  }
  updateBackgroundMoonPhase(phase);
}

function isNewMoonDetail(phase) {
  return phase < 0.03 || phase >= 0.97;
}
function isWaxingCrescentDetail(phase) {
  return phase >= 0.03 && phase < 0.22;
}
function isFirstQuarterDetail(phase) {
  return phase >= 0.22 && phase < 0.28;
}
function isWaxingGibbousDetail(phase) {
  return phase >= 0.28 && phase < 0.47;
}
function isFullMoonDetail(phase) {
  return phase >= 0.47 && phase < 0.53;
}
function isWaningGibbousDetail(phase) {
  return phase >= 0.53 && phase < 0.72;
}
function isLastQuarterDetail(phase) {
  return phase >= 0.72 && phase < 0.78;
}

export function getMoonPhaseDetails(phasePercent) {
  const phase = phasePercent % 1.0;

  if (isNewMoonDetail(phase)) return { name: "New Moon", icon: "🌑" };
  if (isWaxingCrescentDetail(phase)) {
    return { name: "Waxing Crescent", icon: "🌒" };
  }
  if (isFirstQuarterDetail(phase)) return { name: "First Quarter", icon: "🌓" };
  if (isWaxingGibbousDetail(phase)) {
    return { name: "Waxing Gibbous", icon: "🌔" };
  }
  if (isFullMoonDetail(phase)) return { name: "Full Moon", icon: "🌕" };
  if (isWaningGibbousDetail(phase)) {
    return { name: "Waning Gibbous", icon: "🌖" };
  }
  if (isLastQuarterDetail(phase)) return { name: "Last Quarter", icon: "🌗" };
  return { name: "Waning Crescent", icon: "🌘" };
}

export function setupMoonSimulator() {
  const slider = document.getElementById("moon-slider");
  const display = document.getElementById("slider-moon-display");
  if (!slider || !display) return;

  resetMoonSimulation();

  slider.addEventListener("input", (e) => {
    isSimulatingMoon = true;
    const cycleDay = parseFloat(e.target.value);
    const phasePercent = cycleDay / LUNAR_CYCLE_DAYS;

    renderMoonDisplay(phasePercent, true);

    clearTimeout(moonSimulationResetTimeout);
    moonSimulationResetTimeout = setTimeout(() => {
      resetMoonSimulation();
    }, RESET_TIMEOUT_MS);
  });
}

function resetMoonSimulation() {
  if (moonSimulationResetTimeout) {
    clearTimeout(moonSimulationResetTimeout);
    moonSimulationResetTimeout = null;
  }
  isSimulatingMoon = false;

  const slider = document.getElementById("moon-slider");
  if (slider) {
    const livePhase = getLiveMoonPhasePercent();
    slider.value = livePhase * LUNAR_CYCLE_DAYS;
    renderMoonDisplay(livePhase, false);
  }
}

function renderMoonDisplay(phasePercent, isSimulating) {
  const display = document.getElementById("slider-moon-display");
  const nameDisplay = document.getElementById("slider-moon-name");
  if (!display) return;

  const details = getMoonPhaseDetails(phasePercent);

  if (isSimulating) {
    display.innerHTML = createSimulatingMoonHtml(details.icon);
  } else {
    display.innerHTML = createLiveMoonHtml(details.icon);
  }

  if (nameDisplay) {
    nameDisplay.textContent = "- " + details.name;
  }

  updateBackgroundMoonPhase(phasePercent);
}

function createSimulatingMoonHtml(icon) {
  return `<span style="animation: blink 2s infinite; font-size: 0.8rem; margin-right: 4px;">SIM</span> <span style="font-size: 1.5rem;">${icon}</span>`;
}

function createLiveMoonHtml(icon) {
  return `<span style="font-size: 1.5rem;">${icon}</span>`;
}

export function updateBackgroundMoonPhase(phasePercent) {
  const celestial = document.querySelector(".celestial-body");
  if (!celestial) return;

  if (!isCelestialBodyMoon(celestial)) {
    clearCelestialStyles(celestial);
    return;
  }

  applyCelestialTransformations(celestial);

  const litColor = "#e0e0e0";
  const unlitColor = "#1a2a3a";

  if (isNewMoonBackground(phasePercent)) {
    renderNewMoonBackground(celestial);
    return;
  }

  if (isFullMoonBackground(phasePercent)) {
    renderFullMoonBackground(celestial, litColor);
    return;
  }

  if (isFirstQuarterBackground(phasePercent)) {
    renderFirstQuarterBackground(celestial, litColor);
    return;
  }

  if (isLastQuarterBackground(phasePercent)) {
    renderLastQuarterBackground(celestial, litColor);
    return;
  }

  renderIntermediatePhaseBackground(
    celestial,
    phasePercent,
    litColor,
    unlitColor,
  );
}

function isCelestialBodyMoon(celestial) {
  return celestial.dataset.body === "moon";
}

function clearCelestialStyles(celestial) {
  celestial.style.background = "";
  celestial.style.boxShadow = "";
  celestial.style.transform = "";
  celestial.style.opacity = "";
}

function applyCelestialTransformations(celestial) {
  celestial.style.transform = "scale(0.7) rotate(0deg)";
  celestial.style.opacity = "0.85";
}

function isNewMoonBackground(phasePercent) {
  return phasePercent < 0.03 || phasePercent > 0.97;
}

function isFullMoonBackground(phasePercent) {
  return phasePercent >= 0.47 && phasePercent <= 0.53;
}

function isFirstQuarterBackground(phasePercent) {
  return phasePercent >= 0.23 && phasePercent <= 0.27;
}

function isLastQuarterBackground(phasePercent) {
  return phasePercent >= 0.73 && phasePercent <= 0.77;
}

function renderNewMoonBackground(celestial) {
  celestial.style.background = "transparent";
  celestial.style.boxShadow = "none";
}

function renderFullMoonBackground(celestial, litColor) {
  celestial.style.background = litColor;
  celestial.style.boxShadow = "0 0 20px 5px rgba(224, 224, 224, 0.4)";
}

function renderFirstQuarterBackground(celestial, litColor) {
  celestial.style.background = `linear-gradient(to right, transparent 50%, ${litColor} 50%)`;
  celestial.style.boxShadow = "none";
}

function renderLastQuarterBackground(celestial, litColor) {
  celestial.style.background = `linear-gradient(to left, transparent 50%, ${litColor} 50%)`;
  celestial.style.boxShadow = "none";
}

function renderIntermediatePhaseBackground(
  celestial,
  phasePercent,
  litColor,
  unlitColor,
) {
  if (phasePercent < 0.25) {
    renderWaxingCrescentBackground(celestial, phasePercent, litColor);
  } else if (phasePercent >= 0.25 && phasePercent < 0.5) {
    renderWaxingGibbousBackground(
      celestial,
      phasePercent,
      litColor,
      unlitColor,
    );
  } else if (phasePercent >= 0.5 && phasePercent < 0.75) {
    renderWaningGibbousBackground(
      celestial,
      phasePercent,
      litColor,
      unlitColor,
    );
  } else {
    renderWaningCrescentBackground(celestial, phasePercent, litColor);
  }
}

function renderWaxingCrescentBackground(celestial, phasePercent, litColor) {
  const progress = phasePercent / 0.25;
  const insetX = -150 * progress * 0.5;
  celestial.style.background = "transparent";
  celestial.style.boxShadow = `inset ${insetX}px 0px 0 0px ${litColor}`;
}

function renderWaxingGibbousBackground(
  celestial,
  phasePercent,
  litColor,
  unlitColor,
) {
  const progress = (0.5 - phasePercent) / 0.25;
  const insetX = 150 * progress * 0.5;
  celestial.style.background = litColor;
  celestial.style.boxShadow = `inset ${insetX}px 0px 0 0px ${unlitColor}`;
}

function renderWaningGibbousBackground(
  celestial,
  phasePercent,
  litColor,
  unlitColor,
) {
  const progress = (phasePercent - 0.5) / 0.25;
  const insetX = -150 * progress * 0.5;
  celestial.style.background = litColor;
  celestial.style.boxShadow = `inset ${insetX}px 0px 0 0px ${unlitColor}`;
}

function renderWaningCrescentBackground(celestial, phasePercent, litColor) {
  const progress = (1.0 - phasePercent) / 0.25;
  const insetX = 150 * progress * 0.5;
  celestial.style.background = "transparent";
  celestial.style.boxShadow = `inset ${insetX}px 0px 0 0px ${litColor}`;
}
