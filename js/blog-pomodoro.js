(() => {
  "use strict";

  const root = document.querySelector("[data-pomodoro-timer]");
  if (!root) return;

  const display = root.querySelector("[data-pomodoro-display]");
  const label = root.querySelector("[data-pomodoro-label]");
  const phaseBadge = root.querySelector("[data-pomodoro-phase]");
  const progressBadge = root.querySelector("[data-pomodoro-progress]");
  const stepsRoot = root.querySelector("[data-pomodoro-steps]");
  const status = root.querySelector("[data-pomodoro-status]");
  const start = root.querySelector("[data-pomodoro-start]");
  const reset = root.querySelector("[data-pomodoro-reset]");
  const ring = root.querySelector("[data-pomodoro-ring]");
  const modeButtons = [...root.querySelectorAll("[data-pomodoro-mode]")];
  const cyclesInput = root.querySelector("[data-pomodoro-cycles]");
  const workInput = root.querySelector("[data-pomodoro-work]");
  const breakInput = root.querySelector("[data-pomodoro-break]");
  const options = root.querySelector("[data-pomodoro-options]");
  const configNote = root.querySelector("[data-pomodoro-config-note]");

  let modeKey = "work";
  let phaseIndex = 0;
  let remaining = 25 * 60;
  let interval = null;
  let running = false;

  const defaultTitle = "Méthode Pomodoro : mieux se concentrer et organiser son travail — Philosophal";
  const clamp = (value, min, max, fallback) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, Math.round(n)));
  };

  const format = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const getSettings = () => {
    const cycles = clamp(cyclesInput?.value, 1, 12, 4);
    const work = clamp(workInput?.value, 5, 120, 25);
    const pause = clamp(breakInput?.value, 0, 30, 5);
    if (cyclesInput) cyclesInput.value = cycles;
    if (workInput) workInput.value = work;
    if (breakInput) breakInput.value = pause;
    return { cycles, work, pause };
  };

  const buildPhases = (workMinutes, breakMinutes, cycles) => {
    const phases = [];
    for (let i = 1; i <= cycles; i += 1) {
      phases.push({ type: "work", label: `Travail · cycle ${i}`, short: `T${i}`, seconds: workMinutes * 60 });
      if (breakMinutes > 0) {
        phases.push({ type: "break", label: `Pause · cycle ${i}`, short: `P${i}`, seconds: breakMinutes * 60 });
      }
    }
    return phases;
  };

  const getModeState = () => {
    const { cycles, work, pause } = getSettings();
    if (modeKey === "work") {
      return {
        progress: "Bloc simple · 25 min",
        finishStatus: "Bloc terminé. Prenez maintenant une vraie pause de 5 minutes.",
        phases: [{ type: "work", label: "Bloc de travail", short: "Travail", seconds: 25 * 60 }]
      };
    }
    if (modeKey === "cycle") {
      return {
        progress: "1 cycle complet · 30 min",
        finishStatus: "Cycle terminé. Vous pouvez recommencer ou passer à autre chose.",
        phases: buildPhases(25, 5, 1)
      };
    }
    if (modeKey === "session") {
      const total = cycles * (25 + 5);
      return {
        progress: `Session · ${cycles} cycles · ${total} min`,
        finishStatus: "Session terminée. Prenez une pause longue de 15 à 20 minutes.",
        phases: buildPhases(25, 5, cycles)
      };
    }
    const total = cycles * (work + pause);
    return {
      progress: `Libre · ${cycles} cycle${cycles > 1 ? "s" : ""} · ${total} min`,
      finishStatus: "Séance libre terminée. Vous pouvez ajuster les réglages et relancer un autre bloc.",
      phases: buildPhases(work, pause, cycles)
    };
  };

  const currentMode = () => getModeState();
  const currentPhase = () => currentMode().phases[Math.min(phaseIndex, currentMode().phases.length - 1)];

  const setProgressRing = () => {
    if (!ring) return;
    const total = currentPhase().seconds || 1;
    const ratio = 1 - remaining / total;
    ring.style.setProperty("--timer-progress", `${Math.max(0, Math.min(1, ratio)) * 360}deg`);
  };

  const buildSteps = () => {
    if (!stepsRoot) return;
    const phases = currentMode().phases;
    stepsRoot.innerHTML = phases.map((phase, index) => {
      const classes = ["pomodoro-timer-step", phase.type === "work" ? "is-work" : "is-break"];
      if (index < phaseIndex) classes.push("is-done");
      if (index === phaseIndex) classes.push("is-current");
      return `<button type="button" class="${classes.join(" ")}" data-phase-index="${index}" title="Aller à ${phase.label}">${phase.short}</button>`;
    }).join("");
  };

  const refreshOptionVisibility = () => {
    const cycleField = options?.querySelector('[data-field="cycles"]');
    const workField = options?.querySelector('[data-field="work"]');
    const breakField = options?.querySelector('[data-field="break"]');
    if (cycleField) cycleField.hidden = !(modeKey === "session" || modeKey === "custom");
    if (workField) workField.hidden = modeKey !== "custom";
    if (breakField) breakField.hidden = modeKey !== "custom";

    if (!configNote) return;
    if (modeKey === "session") {
      configNote.textContent = "Choisissez ici le nombre de cycles : 4 par défaut, mais vous pouvez le modifier librement.";
    } else if (modeKey === "custom") {
      configNote.textContent = "Mode libre : choisissez la durée du travail, de la pause et le nombre de cycles. Vous pouvez faire du 20 / 5, 30 / 5, 50 / 10, etc.";
    } else if (modeKey === "cycle") {
      configNote.textContent = "Cycle standard : 25 minutes de travail, puis 5 minutes de pause.";
    } else {
      configNote.textContent = "Bloc simple : un seul bloc de 25 minutes pour commencer sans complexifier.";
    }
  };

  const statusForIdle = () => {
    const { cycles, work, pause } = getSettings();
    if (modeKey === "work") return "Bloc simple : 25 minutes de travail, puis une vraie pause.";
    if (modeKey === "cycle") return "Cycle complet : 25 minutes de travail, puis 5 minutes de pause.";
    if (modeKey === "session") return `Session complète : ${cycles} cycle${cycles > 1 ? "s" : ""} successif${cycles > 1 ? "s" : ""}.`;
    return `Mode libre : ${work} min de travail, ${pause} min de pause, ${cycles} cycle${cycles > 1 ? "s" : ""}.`;
  };

  const statusForRunning = () => {
    const phase = currentPhase();
    if (phase.type === "work") return "Travail en cours. Une seule tâche, pas de notifications.";
    return "Pause en cours. Levez-vous, regardez au loin, ne replongez pas dans le téléphone.";
  };

  const renderMeta = () => {
    const phase = currentPhase();
    label.textContent = phase.label;
    phaseBadge.textContent = phase.type === "work" ? "Travail" : "Pause";
    progressBadge.textContent = currentMode().progress;
  };

  const render = () => {
    const phases = currentMode().phases;
    if (phaseIndex >= phases.length) phaseIndex = phases.length - 1;
    if (phaseIndex < 0) phaseIndex = 0;
    display.textContent = format(remaining);
    renderMeta();
    buildSteps();
    refreshOptionVisibility();
    setProgressRing();
    document.title = running ? `${format(remaining)} · Pomodoro — Philosophal` : defaultTitle;
  };

  const stop = () => {
    if (interval) window.clearInterval(interval);
    interval = null;
    running = false;
    start.textContent = remaining > 0 ? "Démarrer" : "Terminé";
  };

  const beep = () => {
    try {
      const audio = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.frequency.value = 660;
      gain.gain.value = 0.06;
      osc.start();
      osc.stop(audio.currentTime + 0.18);
    } catch (_) {}
  };

  const moveToPhase = (index) => {
    const phases = currentMode().phases;
    phaseIndex = Math.min(Math.max(index, 0), phases.length - 1);
    remaining = phases[phaseIndex].seconds;
    render();
  };

  const finish = () => {
    stop();
    remaining = 0;
    render();
    status.textContent = currentMode().finishStatus;
    start.textContent = "Terminé";
    beep();
  };

  const nextPhase = () => {
    beep();
    const phases = currentMode().phases;
    if (phaseIndex >= phases.length - 1) {
      finish();
      return;
    }
    moveToPhase(phaseIndex + 1);
    status.textContent = statusForRunning();
  };

  const tick = () => {
    remaining -= 1;
    if (remaining <= 0) {
      nextPhase();
      return;
    }
    render();
  };

  const setMode = (nextMode) => {
    modeKey = nextMode;
    phaseIndex = 0;
    remaining = currentMode().phases[0].seconds;
    stop();
    modeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.pomodoroMode === nextMode));
    start.textContent = "Démarrer";
    status.textContent = statusForIdle();
    render();
  };

  const refreshCurrentMode = () => {
    const phases = currentMode().phases;
    if (phaseIndex >= phases.length) phaseIndex = phases.length - 1;
    if (!running) remaining = phases[phaseIndex].seconds;
    status.textContent = running ? statusForRunning() : statusForIdle();
    render();
  };

  start.addEventListener("click", () => {
    if (remaining <= 0) return;
    if (running) {
      stop();
      status.textContent = "Minuteur en pause.";
      render();
      return;
    }
    running = true;
    start.textContent = "Mettre en pause";
    status.textContent = statusForRunning();
    interval = window.setInterval(tick, 1000);
    render();
  });

  reset.addEventListener("click", () => {
    setMode(modeKey);
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.pomodoroMode || "work"));
  });

  [cyclesInput, workInput, breakInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("change", () => {
      stop();
      refreshCurrentMode();
      status.textContent = "Réglages mis à jour. Cliquez sur Démarrer pour lancer ce nouveau rythme.";
    });
  });

  stepsRoot?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-phase-index]");
    if (!target) return;
    stop();
    moveToPhase(Number(target.dataset.phaseIndex || 0));
    status.textContent = `Phase sélectionnée : ${currentPhase().label}. Cliquez sur Démarrer pour repartir d’ici.`;
  });

  setMode("work");
})();
