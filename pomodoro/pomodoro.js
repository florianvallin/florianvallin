(() => {
  "use strict";

  const STORAGE = "philosophal-pomodoro-v1";
  const DEFAULTS = {
    durations: { work: 25, short: 5, long: 15 },
    longInterval: 4,
    autoBreaks: false,
    autoWork: false,
    volume: 60,
    alarm: "digital",
    background: "off",
    backgroundVolume: 18,
    wakeLock: true,
    continueWhenClosed: true,
    newDayPrompt: true
  };
  const MODE_COPY = {
    work: "Concentrez-vous sur une seule tâche.",
    short: "Respirez, bougez et laissez l’attention se relâcher.",
    long: "Prenez une vraie coupure avant de repartir."
  };
  const MODE_NAMES = { work: "Pomodoro", short: "Pause courte", long: "Pause longue" };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (n, min, max, fallback) => {
    const v = Number(n);
    return Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;
  };
  const uid = () => `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const stored = readStore();
  const state = {
    settings: normalizeSettings(stored.settings),
    mode: ["work", "short", "long"].includes(stored.mode) ? stored.mode : "work",
    running: Boolean(stored.running),
    remainingMs: 0,
    endAt: Number(stored.endAt) || 0,
    workInCycle: clamp(stored.workInCycle, 0, 50, 0),
    treeComplete: Boolean(stored.treeComplete),
    sessionNumber: Math.max(1, clamp(stored.sessionNumber, 1, 9999, 1)),
    tasks: Array.isArray(stored.tasks) ? stored.tasks.map(normalizeTask).filter(Boolean) : [],
    activeTaskId: stored.activeTaskId || "",
    stats: normalizeStats(stored.stats),
    history: normalizeHistory(stored.history),
    templates: Array.isArray(stored.templates) ? stored.templates.map(normalizeTemplate).filter(Boolean) : [],
    reportRange: "week",
    sessionDate: /^\d{4}-\d{2}-\d{2}$/.test(String(stored.sessionDate || "")) ? String(stored.sessionDate) : todayKey(),
    lastTouched: Number(stored.lastTouched) || Date.now(),
    intention: String(stored.intention || "").slice(0, 180),
    resumeNote: String(stored.resumeNote || "").slice(0, 180),
    interruptions: Array.isArray(stored.interruptions) ? stored.interruptions.slice(-100) : [],
    overrideMinutes: clamp(stored.overrideMinutes, 0, 180, 0),
    phaseStartedAt: Number(stored.phaseStartedAt) || 0,
    phaseInitialMs: Number(stored.phaseInitialMs) || 0,
    ambient: null,
    wakeLock: null,
    tickHandle: null,
    toastHandle: null,
    immersiveFallback: false
  };
  if (stored.stats && /^\d{4}-\d{2}-\d{2}$/.test(String(stored.stats.date || ""))) {
    state.history[String(stored.stats.date)] = {
      pomodoros: clamp(stored.stats.pomodoros, 0, 9999, 0),
      focusMinutes: clamp(stored.stats.focusMinutes, 0, 999999, 0)
    };
  }
  const storedRemaining = Number(stored.remainingMs);
  state.remainingMs = Number.isFinite(storedRemaining) && storedRemaining >= 0 ? storedRemaining : durationMs(state.mode);
  const staleSession = state.sessionDate !== todayKey();
  state.staleOnLoad = staleSession && (state.workInCycle > 0 || state.sessionNumber > 1 || state.mode !== "work" || state.remainingMs < durationMs(state.mode));
  state.expiredOnLoad = false;
  if (state.running) {
    if (state.settings.continueWhenClosed && state.endAt > Date.now() && !state.staleOnLoad) state.remainingMs = Math.max(0, state.endAt - Date.now());
    else if (state.settings.continueWhenClosed && state.endAt > 0 && state.endAt <= Date.now() && !state.staleOnLoad) { state.remainingMs = 0; state.running = false; state.expiredOnLoad = true; }
    else { state.running = false; state.endAt = 0; }
  }

  const timeEl = $("[data-time]");
  const startBtn = $("[data-start]");
  const themeMeta = $("[data-theme-color]");
  const settingsDialog = $("[data-settings]");

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORAGE) || "{}") || {}; }
    catch (_) { return {}; }
  }
  function normalizeSettings(input = {}) {
    const d = input.durations || {};
    return {
      durations: {
        work: clamp(d.work, 1, 180, DEFAULTS.durations.work),
        short: clamp(d.short, 1, 60, DEFAULTS.durations.short),
        long: clamp(d.long, 1, 90, DEFAULTS.durations.long)
      },
      longInterval: clamp(input.longInterval, 1, 12, DEFAULTS.longInterval),
      autoBreaks: Boolean(input.autoBreaks),
      autoWork: Boolean(input.autoWork),
      volume: clamp(input.volume, 0, 100, DEFAULTS.volume),
      alarm: ["digital", "bell", "soft"].includes(input.alarm) ? input.alarm : DEFAULTS.alarm,
      background: ["off", "white", "brown"].includes(input.background) ? input.background : DEFAULTS.background,
      backgroundVolume: clamp(input.backgroundVolume, 0, 60, DEFAULTS.backgroundVolume),
      wakeLock: input.wakeLock !== false,
      continueWhenClosed: input.continueWhenClosed !== false,
      newDayPrompt: input.newDayPrompt !== false
    };
  }
  function normalizeTask(t) {
    if (!t || typeof t.title !== "string") return null;
    return {
      id: String(t.id || uid()),
      title: t.title.trim().slice(0, 160),
      estimate: clamp(t.estimate, 1, 20, 1),
      completed: clamp(t.completed, 0, 999, 0),
      done: Boolean(t.done),
      createdAt: Number(t.createdAt) || Date.now()
    };
  }
  function normalizeStats(input = {}) {
    const key = todayKey();
    if (input.date !== key) return { date: key, pomodoros: 0, focusMinutes: 0 };
    return { date: key, pomodoros: clamp(input.pomodoros, 0, 9999, 0), focusMinutes: clamp(input.focusMinutes, 0, 999999, 0) };
  }
  function normalizeHistory(input = {}) {
    const out = {};
    if (!input || typeof input !== "object" || Array.isArray(input)) return out;
    Object.entries(input).forEach(([date, row]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      out[date] = {
        pomodoros: clamp(row?.pomodoros, 0, 9999, 0),
        focusMinutes: clamp(row?.focusMinutes, 0, 999999, 0)
      };
    });
    return out;
  }
  function normalizeTemplate(t) {
    if (!t || typeof t.name !== "string" || !Array.isArray(t.tasks)) return null;
    const tasks = t.tasks.map(row => {
      if (!row || typeof row.title !== "string" || !row.title.trim()) return null;
      return { title: row.title.trim().slice(0, 160), estimate: clamp(row.estimate, 1, 20, 1) };
    }).filter(Boolean);
    if (!tasks.length) return null;
    return { id: String(t.id || uid().replace(/^task-/, "tpl-")), name: t.name.trim().slice(0, 80) || "Modèle", tasks };
  }
  function syncStatsDay() {
    const key = todayKey();
    if (state.stats.date !== key) {
      if (state.stats.date) {
        state.history[state.stats.date] = { pomodoros: state.stats.pomodoros, focusMinutes: state.stats.focusMinutes };
      }
      state.stats = { date: key, pomodoros: 0, focusMinutes: 0 };
    }
    state.history[key] = { pomodoros: state.stats.pomodoros, focusMinutes: state.stats.focusMinutes };
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({
        settings: state.settings,
        mode: state.mode,
        running: state.running,
        remainingMs: state.running ? Math.max(0, state.endAt - Date.now()) : state.remainingMs,
        endAt: state.endAt,
        sessionDate: state.sessionDate,
        lastTouched: Date.now(),
        intention: state.intention,
        resumeNote: state.resumeNote,
        interruptions: state.interruptions,
        overrideMinutes: state.overrideMinutes,
        phaseStartedAt: state.phaseStartedAt,
        phaseInitialMs: state.phaseInitialMs,
        workInCycle: state.workInCycle,
        treeComplete: state.treeComplete,
        sessionNumber: state.sessionNumber,
        tasks: state.tasks,
        activeTaskId: state.activeTaskId,
        stats: state.stats,
        history: state.history,
        templates: state.templates
      }));
    } catch (_) {}
  }
  function durationMs(mode = state.mode) {
    if (mode === "work" && state.overrideMinutes > 0) return state.overrideMinutes * 60_000;
    return state.settings.durations[mode] * 60_000;
  }
  function durationMinutes(mode = state.mode) { return Math.round(durationMs(mode) / 60_000); }
  function stageLabel() {
    if (state.mode === "work") return `T${Math.min(state.settings.longInterval, state.workInCycle + 1)}`;
    if (state.mode === "long") return "Pause longue";
    return `P${Math.max(1, state.workInCycle)}`;
  }
  function remainingSessionMs() {
    const interval = state.settings.longInterval;
    let total = state.remainingMs;
    if (state.mode === "work") {
      const afterThis = Math.max(0, interval - (state.workInCycle + 1));
      if (afterThis === 0) total += state.settings.durations.long * 60_000;
      else total += afterThis * state.settings.durations.work * 60_000 + Math.max(0, afterThis - 1) * state.settings.durations.short * 60_000 + state.settings.durations.short * 60_000 + state.settings.durations.long * 60_000;
    } else if (state.mode === "short") {
      const remainingWork = Math.max(0, interval - state.workInCycle);
      total += remainingWork * state.settings.durations.work * 60_000 + Math.max(0, remainingWork - 1) * state.settings.durations.short * 60_000 + state.settings.durations.long * 60_000;
    }
    return total;
  }
  function humanDuration(ms) { const m=Math.max(0,Math.round(ms/60000)); const h=Math.floor(m/60),r=m%60; return h ? `${h} h ${String(r).padStart(2,"0")}` : `${m} min`; }
  function formatTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  function activeTask() { return state.tasks.find(t => t.id === state.activeTaskId) || null; }

  const TREE_ART = [
    "                   .       .                   ",
    "            .     ***     .       .            ",
    "          *****  *****  *****   .              ",
    "        **   \\ *****|***** /   **             ",
    "      .***    \\  ***|***  /    ***.           ",
    "    .******----\\---*|*---/----******.         ",
    "        ****     \\  |  /     ****             ",
    "      *******-----\\-|-/-----*******           ",
    "         *****     \\|/     *****               ",
    "            ***----\\|/----***                  ",
    "              **   /|\\   **                    ",
    "                  / | \\                        ",
    "                    |                          ",
    "                    |                          ",
    "                    |                          ",
    "                 ___|___                      ",
    "              __/   |   \\__                   ",
    "           __/      |      \\__                "
  ];

  function treeGrowthProgress() {
    const interval = Math.max(1, state.settings.longInterval);
    if (state.treeComplete) return 1;
    const completed = Math.max(0, Math.min(interval, state.workInCycle));
    let current = 0;
    if (state.mode === "work") {
      const total = Math.max(1, durationMs("work"));
      current = Math.max(0, Math.min(1, 1 - state.remainingMs / total));
    }
    return Math.max(0, Math.min(1, (completed + current) / interval));
  }

  function revealTree(progress) {
    const rows = TREE_ART;
    const height = rows.length;
    const width = Math.max(...rows.map(r => r.length));
    const center = width / 2;
    return rows.map((row, y) => {
      const level = (height - 1 - y) / Math.max(1, height - 1);
      return [...row.padEnd(width, " ")].map((ch, x) => {
        if (ch === " ") return " ";
        const distance = Math.min(1, Math.abs(x - center) / Math.max(1, center));
        const leaf = ch === "*" || ch === ".";
        const root = y >= height - 3;
        let threshold;
        if (root) threshold = 0.015 + distance * 0.045;
        else if (leaf) threshold = 0.10 + level * 0.72 + distance * 0.15;
        else threshold = 0.025 + level * 0.50 + distance * 0.10;
        return progress + 0.002 >= threshold ? ch : " ";
      }).join("").replace(/\s+$/,"");
    }).join("\n");
  }

  function renderTree() {
    const art = $("[data-tree-art]");
    if (!art) return;
    const progress = treeGrowthProgress();
    art.textContent = revealTree(progress);
    const percent = Math.round(progress * 100);
    const p = $("[data-tree-progress]");
    if (p) p.textContent = `${percent} %`;
    const interval = Math.max(1, state.settings.longInterval);
    const caption = $("[data-tree-caption]");
    if (caption) {
      if (progress >= 0.999) caption.textContent = "Arbre complet · cycle terminé.";
      else if (state.mode === "work") caption.textContent = `T${Math.min(interval, state.workInCycle + 1)} fait pousser l’arbre.`;
      else if (state.mode === "short") caption.textContent = `Pause · ${state.workInCycle} branche${state.workInCycle > 1 ? "s" : ""} consolidée${state.workInCycle > 1 ? "s" : ""}.`;
      else caption.textContent = "Pause longue · la croissance est conservée.";
    }
    const steps = $("[data-tree-steps]");
    if (steps) {
      steps.innerHTML = Array.from({length: interval}, (_, i) => {
        const done = state.treeComplete || i < state.workInCycle;
        const current = !state.treeComplete && state.mode === "work" && i === state.workInCycle;
        return `<span class="${done ? "is-grown" : current ? "is-growing" : ""}" title="T${i+1}">T${i+1}</span>`;
      }).join("");
    }
  }

  function render() {
    syncStatsDay();
    document.body.dataset.pomoMode = state.mode;
    themeMeta?.setAttribute("content", "#f7f7fb");
    timeEl.textContent = formatTime(state.remainingMs);
    $("[data-phase-copy]").textContent = MODE_COPY[state.mode];
    $("[data-phase-duration]").textContent = `${durationMinutes(state.mode)} min`;
    $("[data-session-label]").textContent = state.mode === "work" ? `Session ${state.sessionNumber}` : MODE_NAMES[state.mode];
    const totalForPhase = Math.max(1, durationMs(state.mode));
    const progress = Math.max(0, Math.min(1, 1 - state.remainingMs / totalForPhase));
    $("[data-ring]")?.style.setProperty("--progress", `${progress * 360}deg`);
    const phaseEnd = new Date(Date.now() + state.remainingMs);
    if ($("[data-end-time]")) $("[data-end-time]").textContent = `Fin du bloc ${phaseEnd.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" })}`;
    if ($("[data-session-total]")) $("[data-session-total]").textContent = humanDuration(remainingSessionMs());
    if ($("[data-session-finish]")) $("[data-session-finish]").textContent = new Date(Date.now() + remainingSessionMs()).toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" });
    if ($("[data-step-label]")) $("[data-step-label]").textContent = stageLabel();
    if ($("[data-intention]") && document.activeElement !== $("[data-intention]")) $("[data-intention]").value = state.intention;
    if ($("[data-resume-note]") && document.activeElement !== $("[data-resume-note]")) $("[data-resume-note]").value = state.resumeNote;
    startBtn.textContent = state.running ? "Pause" : "Démarrer";
    startBtn.setAttribute("aria-pressed", String(state.running));

    $$('[data-mode]').forEach(btn => {
      const active = btn.dataset.mode === state.mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    const interval = state.settings.longInterval;
    $("[data-cycle-summary]").textContent = `${Math.min(state.workInCycle, interval)} / ${interval} pomodoros avant la pause longue`;
    $("[data-cycle-dots]").innerHTML = Array.from({ length: interval }, (_, i) => `<button type="button" data-cycle-jump="${i}" class="${i < state.workInCycle ? "is-done" : i === state.workInCycle && state.mode === "work" ? "is-current" : ""}" aria-label="Aller à T${i+1}" title="Aller à T${i+1}"></button>`).join("");
    renderTree();

    const bothAuto = state.settings.autoBreaks && state.settings.autoWork;
    const autoSome = state.settings.autoBreaks || state.settings.autoWork;
    const autoBtn = $("[data-auto-toggle]");
    autoBtn.setAttribute("aria-pressed", String(bothAuto));
    $("[data-auto-label]").textContent = bothAuto ? "Auto : oui" : autoSome ? "Auto : partiel" : "Auto : non";

    $("[data-today-pomos]").textContent = state.stats.pomodoros;
    $("[data-today-minutes]").textContent = state.stats.focusMinutes;
    renderTasks();
    renderActiveTask();
    document.title = state.running ? `${formatTime(state.remainingMs)} · ${MODE_NAMES[state.mode]} — Philosophal` : `Pomodoro — Philosophal`;
    persist();
  }

  function renderActiveTask() {
    const box = $("[data-active-task]");
    const task = activeTask();
    box.hidden = !task;
    if (!task) return;
    $("[data-active-task-title]").textContent = task.title;
    $("[data-active-task-progress]").textContent = `${task.completed} / ${task.estimate} pomodoro${task.estimate > 1 ? "s" : ""} prévu${task.estimate > 1 ? "s" : ""}`;
  }

  function renderTasks() {
    const list = $("[data-task-list]");
    const active=document.activeElement,taskId=active?.closest?.("[data-task-id]")?.dataset.taskId,focusAttribute=["data-task-select","data-task-done","data-task-minus","data-task-plus","data-task-delete"].find(name=>active?.hasAttribute?.(name));
    const empty = $("[data-task-empty]");
    list.innerHTML = state.tasks.map(task => `
      <article class="pomo-task${task.id === state.activeTaskId ? " is-active" : ""}${task.done ? " is-done" : ""}" data-task-id="${escapeHtml(task.id)}">
        <button type="button" class="pomo-task-check${task.done ? " is-done" : ""}" data-task-done aria-label="${task.done ? "Rouvrir" : "Terminer"} la tâche">${task.done ? "✓" : ""}</button>
        <button type="button" class="pomo-task-copy" data-task-select aria-pressed="${task.id===state.activeTaskId}"><strong>${escapeHtml(task.title)}</strong><small>${task.completed} / ${task.estimate} pomodoro${task.estimate > 1 ? "s" : ""}</small></button>
        <div class="pomo-task-actions"><button type="button" data-task-minus title="Retirer un Pomodoro">−</button><button type="button" data-task-plus title="Ajouter un Pomodoro">+</button><button type="button" data-task-delete title="Supprimer">×</button></div>
      </article>`).join("");
    if(taskId&&focusAttribute)list.querySelector(`[data-task-id="${CSS.escape(taskId)}"] [${focusAttribute}]`)?.focus({preventScroll:true});
    empty.hidden = state.tasks.length > 0;
    const estimates = state.tasks.filter(t => !t.done).reduce((sum, t) => sum + Math.max(0, t.estimate - t.completed), 0);
    let finish = "";
    if (estimates > 0) {
      const work = state.settings.durations.work;
      const short = state.settings.durations.short;
      const long = state.settings.durations.long;
      const interval = state.settings.longInterval;
      const longBreaks = Math.floor(Math.max(0, state.workInCycle + estimates - 1) / interval);
      const shortBreaks = Math.max(0, estimates - 1 - longBreaks);
      const totalMinutes = estimates * work + shortBreaks * short + longBreaks * long;
      const eta = new Date(Date.now() + totalMinutes * 60_000);
      finish = ` · fin estimée ${eta.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    }
    $("[data-task-footer]").textContent = `${state.tasks.length} tâche${state.tasks.length > 1 ? "s" : ""} · ${estimates} pomodoro${estimates > 1 ? "s" : ""} restant${estimates > 1 ? "s" : ""}${finish}`;
  }

  function escapeHtml(v = "") {
    return String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  async function startTimer() {
    if (state.running) return pauseTimer();
    if (state.remainingMs <= 0) state.remainingMs = durationMs();
    state.running = true;
    if (!state.phaseStartedAt) state.phaseStartedAt = Date.now();
    if (!state.phaseInitialMs) state.phaseInitialMs = Math.max(state.remainingMs, durationMs());
    state.sessionDate = todayKey();
    state.endAt = Date.now() + state.remainingMs;
    state.tickHandle = window.setInterval(tick, 250);
    await requestWakeLock();
    if (state.mode === "work") startAmbient();
    render();
  }
  function pauseTimer() {
    if (!state.running) return;
    state.remainingMs = Math.max(0, state.endAt - Date.now());
    state.running = false;
    state.endAt = 0;
    if (state.tickHandle) clearInterval(state.tickHandle);
    state.tickHandle = null;
    releaseWakeLock();
    stopAmbient();
    render();
  }
  function tick() {
    if (!state.running) return;
    state.remainingMs = Math.max(0, state.endAt - Date.now());
    if (state.remainingMs <= 0) {
      state.remainingMs = 0;
      if (state.tickHandle) clearInterval(state.tickHandle);
      state.tickHandle = null;
      state.running = false;
      releaseWakeLock();
      stopAmbient();
      completePhase();
      return;
    }
    timeEl.textContent = formatTime(state.remainingMs);
    const liveTotal = Math.max(1, durationMs(state.mode));
    const liveProgress = Math.max(0, Math.min(1, 1 - state.remainingMs / liveTotal));
    $("[data-ring]")?.style.setProperty("--progress", `${liveProgress * 360}deg`);
    renderTree();
    document.title = `${formatTime(state.remainingMs)} · ${MODE_NAMES[state.mode]} — Philosophal`;
  }

  function completePhase(opts = {}) {
    const completedMode = state.mode;
    playAlarm();
    notifyCompletion(completedMode);
    state.phaseStartedAt = 0;
    state.phaseInitialMs = 0;
    if (completedMode === "work") {
      syncStatsDay();
      state.stats.pomodoros += 1;
      state.stats.focusMinutes += clamp(opts.focusMinutes, 0, 9999, durationMinutes("work"));
      const task = activeTask();
      if (task) {
        task.completed += 1;
        if (task.completed >= task.estimate) task.done = true;
      }
      state.workInCycle += 1;
      state.sessionNumber += 1;
      state.overrideMinutes = 0;
      if (state.workInCycle >= state.settings.longInterval) {
        state.treeComplete = true;
        state.workInCycle = 0;
        switchMode("long", { auto: state.settings.autoBreaks, completed: true });
      } else {
        state.treeComplete = false;
        switchMode("short", { auto: state.settings.autoBreaks, completed: true });
      }
    } else {
      switchMode("work", { auto: state.settings.autoWork, completed: true });
    }
  }

  function switchMode(mode, opts = {}) {
    if (!MODE_NAMES[mode]) return;
    const previousMode = state.mode;
    pauseTimer();
    if (mode !== "work" || !opts.keepOverride) state.overrideMinutes = 0;
    if (mode === "work" && previousMode === "long" && state.treeComplete) state.treeComplete = false;
    state.mode = mode;
    state.phaseStartedAt = 0;
    state.phaseInitialMs = 0;
    state.remainingMs = durationMs(mode);
    render();
    if (opts.completed) toast(`${MODE_NAMES[mode]} · ${durationMinutes(mode)} min`);
    if (opts.auto) window.setTimeout(() => { if (!state.running && state.mode === mode) startTimer(); }, 550);
  }

  function resetTimer() {
    pauseTimer();
    state.phaseStartedAt = 0;
    state.phaseInitialMs = 0;
    state.remainingMs = durationMs();
    render();
    toast("Bloc actuel réinitialisé.");
  }
  function resetSession(force = false) {
    if (!force && !window.confirm("Recommencer toute la session à T1 ? Les réglages, tâches et statistiques seront conservés.")) return;
    pauseTimer();
    state.mode = "work";
    state.workInCycle = 0;
    state.treeComplete = false;
    state.sessionNumber = 1;
    state.overrideMinutes = 0;
    state.phaseStartedAt = 0;
    state.phaseInitialMs = 0;
    state.remainingMs = state.settings.durations.work * 60_000;
    state.sessionDate = todayKey();
    state.intention = "";
    state.resumeNote = "";
    render();
    toast("Nouvelle session prête · T1.");
  }
  function finishEarly() {
    if (state.mode !== "work") return skipPhase();
    if (state.running) pauseTimer();
    const total = state.phaseInitialMs || durationMs("work");
    const elapsed = Math.max(0, total - state.remainingMs);
    if (elapsed < 30_000 && !window.confirm("Très peu de temps s’est écoulé. Compter quand même ce bloc comme terminé ?")) return;
    state.remainingMs = 0;
    completePhase({ focusMinutes: Math.max(1, Math.round(elapsed / 60_000)) });
    toast("Bloc compté comme terminé.");
  }
  function skipPhase() {
    const from = state.mode;
    pauseTimer();
    if (from === "work") {
      const next = state.workInCycle >= state.settings.longInterval ? "long" : "short";
      switchMode(next);
    } else switchMode("work");
    toast("Phase suivante prête.");
  }

  function toggleAuto() {
    const enable = !(state.settings.autoBreaks && state.settings.autoWork);
    state.settings.autoBreaks = enable;
    state.settings.autoWork = enable;
    render();
    toast(enable ? "Mode automatique activé." : "Mode automatique désactivé.");
  }

  function openSettings() {
    $("[data-setting-work]").value = state.settings.durations.work;
    $("[data-setting-short]").value = state.settings.durations.short;
    $("[data-setting-long]").value = state.settings.durations.long;
    $("[data-setting-interval]").value = state.settings.longInterval;
    $("[data-setting-auto-breaks]").checked = state.settings.autoBreaks;
    $("[data-setting-auto-work]").checked = state.settings.autoWork;
    $("[data-setting-alarm]").value = state.settings.alarm;
    $("[data-setting-volume]").value = state.settings.volume;
    $("[data-volume-label]").textContent = `${state.settings.volume} %`;
    $("[data-setting-background]").value = state.settings.background;
    $("[data-setting-background-volume]").value = state.settings.backgroundVolume;
    $("[data-background-volume-label]").textContent = `${state.settings.backgroundVolume} %`;
    $("[data-setting-wakelock]").checked = state.settings.wakeLock;
    $("[data-setting-continue-closed]").checked = state.settings.continueWhenClosed;
    $("[data-setting-new-day]").checked = state.settings.newDayPrompt;
    if (typeof settingsDialog.showModal === "function") settingsDialog.showModal();
    else settingsDialog.setAttribute("open", "");
  }
  function saveSettings(e) {
    e.preventDefault();
    const next = normalizeSettings({
      durations: {
        work: $("[data-setting-work]").value,
        short: $("[data-setting-short]").value,
        long: $("[data-setting-long]").value
      },
      longInterval: $("[data-setting-interval]").value,
      autoBreaks: $("[data-setting-auto-breaks]").checked,
      autoWork: $("[data-setting-auto-work]").checked,
      alarm: $("[data-setting-alarm]").value,
      volume: $("[data-setting-volume]").value,
      background: $("[data-setting-background]").value,
      backgroundVolume: $("[data-setting-background-volume]").value,
      wakeLock: $("[data-setting-wakelock]").checked,
      continueWhenClosed: $("[data-setting-continue-closed]").checked,
      newDayPrompt: $("[data-setting-new-day]").checked
    });
    pauseTimer();
    state.settings = next;
    state.workInCycle = Math.min(state.workInCycle, Math.max(0, next.longInterval - 1));
    state.remainingMs = durationMs();
    settingsDialog.close?.();
    render();
    toast("Réglages enregistrés.");
  }

  const PRESETS = {
    classic: { work:25, short:5, long:15, interval:4, label:"Classique 25/5" },
    deep: { work:50, short:10, long:20, interval:4, label:"Concentration 50/10" },
    light: { work:20, short:5, long:15, interval:4, label:"Léger 20/5" },
    focus: { work:45, short:10, long:20, interval:4, label:"Profond 45/10" }
  };
  function applyPreset(name, fromSettings = false) {
    const p = PRESETS[name]; if (!p) return;
    if (fromSettings) {
      $("[data-setting-work]").value=p.work; $("[data-setting-short]").value=p.short; $("[data-setting-long]").value=p.long; $("[data-setting-interval]").value=p.interval;
      return;
    }
    pauseTimer();
    state.settings.durations={work:p.work,short:p.short,long:p.long}; state.settings.longInterval=p.interval; resetSession(true); toast(`${p.label} appliqué.`);
  }
  function buildAvailablePlan() {
    const minutes=clamp($("[data-available-minutes]")?.value,10,360,50);
    let cycles=minutes<35?1:minutes<75?2:minutes<110?3:4;
    const short=minutes<30?5:Math.min(10,Math.max(5,Math.round(minutes*.08)));
    const work=Math.max(5,Math.floor((minutes-Math.max(0,cycles-1)*short)/cycles));
    pauseTimer(); state.settings.durations.work=work; state.settings.durations.short=short; state.settings.longInterval=cycles; state.settings.durations.long=Math.min(30,Math.max(15,short*2)); resetSession(true);
    toast(`${cycles} bloc${cycles>1?"s":""} de ${work} min · pause ${short} min.`);
  }
  function quickTen() { pauseTimer(); state.mode="work"; state.overrideMinutes=10; state.remainingMs=600_000; state.phaseStartedAt=0; state.phaseInitialMs=0; render(); toast("Bloc libre de 10 min prêt."); }
  function jumpCycle(index) { pauseTimer(); const i=clamp(index,0,state.settings.longInterval-1,0); state.mode="work"; state.workInCycle=i; state.treeComplete=false; state.sessionNumber=i+1; state.overrideMinutes=0; state.remainingMs=durationMs("work"); state.phaseStartedAt=0; state.phaseInitialMs=0; render(); toast(`T${i+1} prêt.`); }
  function changeCycleCount(delta) { pauseTimer(); state.settings.longInterval=clamp(state.settings.longInterval+delta,1,12,4); state.workInCycle=Math.min(state.workInCycle,state.settings.longInterval-1); render(); }
  function logInterruption(reason) { state.interruptions.push({time:Date.now(),reason,mode:state.mode,step:stageLabel()}); state.interruptions=state.interruptions.slice(-100); persist(); $("[data-interruption-dialog]")?.close?.(); toast(`Interruption notée : ${reason}.`); }
  function openInterruption() { if(state.running) pauseTimer(); const d=$("[data-interruption-dialog]"); if(typeof d?.showModal==="function") d.showModal(); else d?.setAttribute("open",""); }
  function maybeOfferResume() {
    if (!state.settings.newDayPrompt || !state.staleOnLoad) return;
    const d=$("[data-resume-dialog]");
    const c=$("[data-resume-copy]"); if(c)c.textContent=`La session sauvegardée date d’un autre jour et se trouve à ${stageLabel()}. Tu peux la continuer ou repartir proprement à T1.`;
    if(typeof d?.showModal==="function") d.showModal(); else d?.setAttribute("open","");
  }
  function restoreDefaultSettings() {
    state.settings=normalizeSettings(DEFAULTS); resetSession(true); openSettings(); toast("Réglages d’origine restaurés.");
  }
  function exportPomo() { const blob=new Blob([JSON.stringify({version:4,exportedAt:new Date().toISOString(),data:JSON.parse(localStorage.getItem(STORAGE)||"{}")},null,2)],{type:"application/json"}); const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`philosophal-pomodoro-${todayKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
  async function importPomo(file) { if(!file)return; const parsed=JSON.parse(await file.text()); if(!parsed?.data)throw new Error("Format non reconnu"); localStorage.setItem(STORAGE,JSON.stringify(parsed.data)); window.location.reload(); }

  function addTask(e) {
    e.preventDefault();
    const title = $("[data-task-title]").value.trim();
    if (!title) { $("[data-task-title]").focus(); return; }
    const task = { id: uid(), title, estimate: clamp($("[data-task-estimate]").value, 1, 20, 1), completed: 0, done: false, createdAt: Date.now() };
    state.tasks.push(task);
    if (!state.activeTaskId) state.activeTaskId = task.id;
    $("[data-task-title]").value = "";
    $("[data-task-estimate]").value = "1";
    $("[data-task-form]").hidden = true;
    render();
  }

  function onTaskClick(e) {
    const row = e.target.closest("[data-task-id]");
    if (!row) return;
    const task = state.tasks.find(t => t.id === row.dataset.taskId);
    if (!task) return;
    if (e.target.closest("[data-task-done]")) task.done = !task.done;
    else if (e.target.closest("[data-task-plus]")) task.completed += 1;
    else if (e.target.closest("[data-task-minus]")) task.completed = Math.max(0, task.completed - 1);
    else if (e.target.closest("[data-task-delete]")) {
      state.tasks = state.tasks.filter(t => t.id !== task.id);
      if (state.activeTaskId === task.id) state.activeTaskId = state.tasks.find(t => !t.done)?.id || state.tasks[0]?.id || "";
    } else state.activeTaskId = task.id;
    render();
  }

  function dateKeyFrom(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function lastDateKeys(count = 7) {
    const days = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      days.push({ key: dateKeyFrom(d), date: d });
    }
    return days;
  }
  function reportDaysFor(range) {
    if (range === "day") return lastDateKeys(1);
    if (range === "month") return lastDateKeys(30);
    return lastDateKeys(7);
  }
  function renderReport() {
    syncStatsDay();
    const range = state.reportRange;
    const days = reportDaysFor(range);
    const rows = days.map(day => ({ ...day, ...(state.history[day.key] || { pomodoros: 0, focusMinutes: 0 }) }));
    const totalPomos = rows.reduce((sum, row) => sum + row.pomodoros, 0);
    const totalMinutes = rows.reduce((sum, row) => sum + row.focusMinutes, 0);
    const activeDays = rows.filter(row => row.pomodoros > 0).length;
    const avg = activeDays ? Math.round(totalMinutes / activeDays) : 0;
    const periodLabel = range === "day" ? "Aujourd’hui" : range === "month" ? "30 jours" : "7 jours";
    $(`[data-report-summary]`).innerHTML = `
      <div><span>${periodLabel}</span><strong>${totalPomos}</strong><small>pomodoros terminés</small></div>
      <div><span>Concentration</span><strong>${totalMinutes}</strong><small>minutes cumulées</small></div>
      <div><span>Moyenne</span><strong>${avg}</strong><small>min / jour actif</small></div>`;
    $(`[data-report-title]`).textContent = range === "day" ? "Aujourd’hui" : range === "month" ? "30 derniers jours" : "7 derniers jours";
    $$(`[data-report-range]`).forEach(btn => {const selected=btn.dataset.reportRange===range;btn.classList.toggle("is-active",selected);btn.setAttribute("aria-selected",String(selected));});
    const chart = $(`[data-report-chart]`);
    chart.classList.toggle("is-day", range === "day");
    chart.classList.toggle("is-month", range === "month");
    const maxMinutes = Math.max(1, ...rows.map(row => row.focusMinutes));
    chart.innerHTML = rows.map(row => {
      const height = row.focusMinutes > 0 ? Math.max(4, Math.round((row.focusMinutes / maxMinutes) * 100)) : 2;
      const label = range === "month"
        ? String(row.date.getDate())
        : row.date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
      return `<div class="pomo-report-day"><div class="pomo-report-bar-wrap"><div class="pomo-report-bar" style="height:${height}%" data-value="${row.focusMinutes}m" title="${row.pomodoros} pomodoro${row.pomodoros > 1 ? "s" : ""} · ${row.focusMinutes} min"></div></div><small>${escapeHtml(label)}</small></div>`;
    }).join("");
  }
  function openReport() {
    renderReport();
    const dialog = $(`[data-report]`);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function renderTemplates() {
    const list = $(`[data-template-list]`);
    const empty = $(`[data-template-empty]`);
    list.innerHTML = state.templates.map(template => {
      const total = template.tasks.reduce((sum, task) => sum + task.estimate, 0);
      return `<article class="pomo-template-row" data-template-id="${escapeHtml(template.id)}"><div><strong>${escapeHtml(template.name)}</strong><small>${template.tasks.length} tâche${template.tasks.length > 1 ? "s" : ""} · ${total} pomodoro${total > 1 ? "s" : ""}</small></div><button type="button" data-template-use>Charger</button><button type="button" class="is-danger" data-template-delete>Supprimer</button></article>`;
    }).join("");
    empty.hidden = state.templates.length > 0;
  }
  function openTemplates() {
    renderTemplates();
    const dialog = $(`[data-templates]`);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  function saveTemplate() {
    const source = state.tasks.filter(task => !task.done);
    if (!source.length) return toast("Ajoutez au moins une tâche non terminée avant d’enregistrer un modèle.");
    const input = $(`[data-template-name]`);
    const name = input.value.trim().slice(0, 80) || `Modèle ${state.templates.length + 1}`;
    const template = normalizeTemplate({
      id: uid().replace(/^task-/, "tpl-"),
      name,
      tasks: source.map(task => ({ title: task.title, estimate: Math.max(1, task.estimate - task.completed) }))
    });
    if (!template) return;
    state.templates.push(template);
    input.value = "";
    renderTemplates();
    persist();
    toast(`Modèle « ${name} » enregistré.`);
  }
  function onTemplateClick(e) {
    const row = e.target.closest(`[data-template-id]`);
    if (!row) return;
    const template = state.templates.find(item => item.id === row.dataset.templateId);
    if (!template) return;
    if (e.target.closest(`[data-template-delete]`)) {
      state.templates = state.templates.filter(item => item.id !== template.id);
      renderTemplates();
      persist();
      toast("Modèle supprimé.");
      return;
    }
    if (e.target.closest(`[data-template-use]`)) {
      const tasks = template.tasks.map(item => ({
        id: uid(), title: item.title, estimate: item.estimate, completed: 0, done: false, createdAt: Date.now()
      }));
      state.tasks.push(...tasks);
      if (!state.activeTaskId && tasks[0]) state.activeTaskId = tasks[0].id;
      $(`[data-templates]`).close?.();
      render();
      toast(`${tasks.length} tâche${tasks.length > 1 ? "s" : ""} ajoutée${tasks.length > 1 ? "s" : ""}.`);
    }
  }

  function playAlarm() {
    const volume = state.settings.volume / 100;
    if (volume <= 0) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = Math.min(.18, .18 * volume);
      gain.connect(ctx.destination);
      const pattern = state.settings.alarm === "bell"
        ? [{ f: 1046, t: 0, d: .42 }, { f: 1318, t: .36, d: .65 }]
        : state.settings.alarm === "soft"
          ? [{ f: 523, t: 0, d: .28 }, { f: 659, t: .26, d: .28 }, { f: 784, t: .52, d: .4 }]
          : [{ f: 660, t: 0, d: .18 }, { f: 880, t: .22, d: .18 }];
      pattern.forEach(note => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.frequency.value = note.f;
        osc.type = state.settings.alarm === "bell" ? "sine" : state.settings.alarm === "soft" ? "triangle" : "sine";
        noteGain.gain.setValueAtTime(1, ctx.currentTime + note.t);
        noteGain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + note.t + note.d);
        osc.connect(noteGain); noteGain.connect(gain);
        osc.start(ctx.currentTime + note.t);
        osc.stop(ctx.currentTime + note.t + note.d);
      });
      setTimeout(() => ctx.close?.(), 1600);
    } catch (_) {}
  }

  function startAmbient() {
    stopAmbient();
    if (state.settings.background === "off" || state.settings.backgroundVolume <= 0 || state.mode !== "work" || !state.running) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const seconds = 2;
      const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < length; i += 1) {
        const white = Math.random() * 2 - 1;
        if (state.settings.background === "brown") {
          last = (last + .02 * white) / 1.02;
          data[i] = Math.max(-1, Math.min(1, last * 3.4));
        } else data[i] = white * .45;
      }
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer; source.loop = true;
      gain.gain.value = Math.min(.12, (state.settings.backgroundVolume / 100) * .12);
      source.connect(gain); gain.connect(ctx.destination);
      source.start();
      state.ambient = { ctx, source };
    } catch (_) { state.ambient = null; }
  }
  function stopAmbient() {
    if (!state.ambient) return;
    try { state.ambient.source?.stop?.(); } catch (_) {}
    try { state.ambient.ctx?.close?.(); } catch (_) {}
    state.ambient = null;
  }

  async function requestNotifications() {
    if (!("Notification" in window)) return toast("Les notifications ne sont pas disponibles sur ce navigateur.");
    if (Notification.permission === "granted") return toast("Notifications déjà autorisées.");
    const result = await Notification.requestPermission();
    toast(result === "granted" ? "Notifications activées." : "Notifications non autorisées.");
  }
  function notifyCompletion(mode) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const next = mode === "work" ? "Temps de faire une pause." : "Prêt à reprendre le travail ?";
    try { new Notification(`${MODE_NAMES[mode]} terminé`, { body: next, icon: "../favicon-192.png" }); } catch (_) {}
  }

  async function requestWakeLock() {
    if (!state.settings.wakeLock || !navigator.wakeLock?.request) return;
    try { state.wakeLock = await navigator.wakeLock.request("screen"); }
    catch (_) { state.wakeLock = null; }
  }
  function releaseWakeLock() {
    try { state.wakeLock?.release?.(); } catch (_) {}
    state.wakeLock = null;
  }

  async function toggleFullscreen() {
    const btn = $("[data-fullscreen]");
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      else {
        state.immersiveFallback = !state.immersiveFallback;
        document.body.classList.toggle("is-immersive", state.immersiveFallback);
        btn.setAttribute("aria-pressed", String(state.immersiveFallback));
        btn.textContent = state.immersiveFallback ? "Quitter" : "Plein écran";
      }
    } catch (_) {
      state.immersiveFallback = !state.immersiveFallback;
      document.body.classList.toggle("is-immersive", state.immersiveFallback);
    }
  }
  function syncFullscreenButton() {
    const active = Boolean(document.fullscreenElement) || state.immersiveFallback;
    const btn = $("[data-fullscreen]");
    btn.setAttribute("aria-pressed", String(active));
    btn.textContent = active ? "Quitter" : "Plein écran";
  }

  function toast(message) {
    const el = $("[data-toast]");
    el.textContent = message;
    el.hidden = false;
    clearTimeout(state.toastHandle);
    state.toastHandle = setTimeout(() => { el.hidden = true; }, 2400);
  }

  startBtn.addEventListener("click", startTimer);
  $("[data-reset]").addEventListener("click", resetTimer);
  $("[data-reset-session]").addEventListener("click", () => resetSession(false));
  $("[data-new-session]").addEventListener("click", () => resetSession(false));
  $("[data-finish-early]").addEventListener("click", finishEarly);
  $("[data-interruption]").addEventListener("click", openInterruption);
  $("[data-skip]").addEventListener("click", skipPhase);
  $("[data-auto-toggle]").addEventListener("click", toggleAuto);
  $("[data-open-settings]").addEventListener("click", openSettings);
  $("[data-save-settings]").addEventListener("click", saveSettings);
  $$('[data-setting-preset]').forEach(btn => btn.addEventListener("click", () => applyPreset(btn.dataset.settingPreset, true)));
  $$('[data-preset]').forEach(btn => btn.addEventListener("click", () => applyPreset(btn.dataset.preset)));
  $("[data-test-alarm]")?.addEventListener("click", playAlarm);
  $("[data-default-settings]")?.addEventListener("click", restoreDefaultSettings);
  $("[data-export-pomo]")?.addEventListener("click", exportPomo);
  $("[data-import-pomo]")?.addEventListener("change", async e => { try { await importPomo(e.target.files?.[0]); } catch (_) { toast("Import impossible."); } });
  $("[data-build-available]")?.addEventListener("click", buildAvailablePlan);
  $("[data-quick-ten]")?.addEventListener("click", quickTen);
  $("[data-cycle-minus]")?.addEventListener("click", () => changeCycleCount(-1));
  $("[data-cycle-plus]")?.addEventListener("click", () => changeCycleCount(1));
  $("[data-cycle-dots]")?.addEventListener("click", e => { const b=e.target.closest("[data-cycle-jump]"); if(b) jumpCycle(Number(b.dataset.cycleJump)); });
  $("[data-intention]")?.addEventListener("input", e => { state.intention=e.target.value.slice(0,180); persist(); });
  $("[data-resume-note]")?.addEventListener("input", e => { state.resumeNote=e.target.value.slice(0,180); persist(); });
  $("[data-close-interruption]")?.addEventListener("click", () => $("[data-interruption-dialog]")?.close?.());
  $$('[data-interruption-reason]').forEach(btn => btn.addEventListener("click", () => logInterruption(btn.dataset.interruptionReason)));
  $("[data-resume-continue]")?.addEventListener("click", () => { state.sessionDate=todayKey(); state.staleOnLoad=false; $("[data-resume-dialog]")?.close?.(); render(); });
  $("[data-resume-new]")?.addEventListener("click", () => { $("[data-resume-dialog]")?.close?.(); resetSession(true); });
  $("[data-fullscreen]").addEventListener("click", toggleFullscreen);
  $("[data-notifications]").addEventListener("click", requestNotifications);
  $("[data-setting-volume]").addEventListener("input", e => $("[data-volume-label]").textContent = `${e.target.value} %`);
  $("[data-setting-background-volume]").addEventListener("input", e => $("[data-background-volume-label]").textContent = `${e.target.value} %`);
  $("[data-add-task]").addEventListener("click", () => { const form = $("[data-task-form]"); form.hidden = false; $("[data-task-title]").focus(); });
  $("[data-cancel-task]").addEventListener("click", () => { $("[data-task-form]").hidden = true; });
  $("[data-task-form]").addEventListener("submit", addTask);
  $("[data-task-list]").addEventListener("click", onTaskClick);
  $("[data-task-list]").addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-task-id]")) { e.preventDefault(); state.activeTaskId = e.target.dataset.taskId; render(); } });
  $("[data-clear-done]").addEventListener("click", () => { state.tasks = state.tasks.filter(t => !t.done); if (!state.tasks.some(t => t.id === state.activeTaskId)) state.activeTaskId = state.tasks[0]?.id || ""; render(); });
  $$('[data-mode]').forEach(btn => btn.addEventListener("click", () => switchMode(btn.dataset.mode)));
  $("[data-open-report]").addEventListener("click", openReport);
  $$('[data-report-range]').forEach(btn => btn.addEventListener("click", () => { state.reportRange = btn.dataset.reportRange; renderReport(); }));
  $$('[data-close-report]').forEach(btn => btn.addEventListener("click", () => $("[data-report]").close?.()));
  $("[data-open-templates]").addEventListener("click", openTemplates);
  $$('[data-close-templates]').forEach(btn => btn.addEventListener("click", () => $("[data-templates]").close?.()));
  $("[data-save-template]").addEventListener("click", saveTemplate);
  $("[data-template-list]").addEventListener("click", onTemplateClick);
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (state.running) tick();
      if (state.running) requestWakeLock();
    }
  });
  window.addEventListener("beforeunload", () => {
    stopAmbient();
    if (state.running && !state.settings.continueWhenClosed) { state.remainingMs=Math.max(0,state.endAt-Date.now()); state.running=false; state.endAt=0; }
    persist();
  });
  function appPath(path) {
    const localHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    const localMain = localHost && /^\/main(?:\/|$)/.test(window.location.pathname);
    return `${localMain ? "/main" : ""}${path}`;
  }

  window.addEventListener("keydown", e => {
    const key=String(e.key||"").toLowerCase(),code=e.code||"";
    const typing=e.target instanceof HTMLElement && (e.target.matches("input,textarea,select") || e.target.isContentEditable);
    const dialogOpen=$$("dialog").some(dialog=>dialog.open);
    if (typing || dialogOpen || e.defaultPrevented || e.target.closest?.("button,a,summary,[data-task-id]")) return;
    let handled=true;
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (code==="KeyC"||key==="c")) window.location.assign(appPath("/mediatheque/"));
    else if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (code==="KeyH"||key==="h")) window.location.assign(appPath("/"));
    else if (!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&(code==="KeyH"||key==="h")) window.location.assign(appPath("/"));
    else if (e.code==="Space") startTimer();
    else if (e.key==="ArrowRight") skipPhase();
    else if (key==="r") resetTimer();
    else if (key==="f") toggleFullscreen();
    else if (key==="s") openSettings();
    else handled=false;
    if(handled){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
  }, true);

  function consumeAtelierTask() {
    try {
      const h = JSON.parse(localStorage.getItem("philosophal-pomodoro-handoff-v1") || "null");
      if (!h || Date.now() - Number(h.createdAt || 0) > 30 * 60 * 1000 || !String(h.title || "").trim()) return;
      localStorage.removeItem("philosophal-pomodoro-handoff-v1");
      const title = String(h.title).trim().slice(0, 160);
      let task = state.tasks.find(t => !t.done && t.title === title);
      if (!task) {
        task = { id: uid(), title, estimate: clamp(h.estimate, 1, 20, 1), completed: 0, done: false, createdAt: Date.now() };
        state.tasks.unshift(task);
      }
      state.activeTaskId = task.id;
      state.intention = title.slice(0, 180);
      persist();
    } catch (_) {}
  }
  consumeAtelierTask();
  render();
  if (state.running && !state.staleOnLoad) { state.tickHandle=window.setInterval(tick,250); requestWakeLock(); }
  if (state.expiredOnLoad) window.setTimeout(() => completePhase(), 150);
  window.setTimeout(maybeOfferResume, 180);
})();

