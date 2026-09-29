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
    wakeLock: true
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
    running: false,
    remainingMs: 0,
    endAt: 0,
    workInCycle: clamp(stored.workInCycle, 0, 50, 0),
    sessionNumber: Math.max(1, clamp(stored.sessionNumber, 1, 9999, 1)),
    tasks: Array.isArray(stored.tasks) ? stored.tasks.map(normalizeTask).filter(Boolean) : [],
    activeTaskId: stored.activeTaskId || "",
    stats: normalizeStats(stored.stats),
    history: normalizeHistory(stored.history),
    templates: Array.isArray(stored.templates) ? stored.templates.map(normalizeTemplate).filter(Boolean) : [],
    reportRange: "week",
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
  state.remainingMs = durationMs(state.mode);

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
      wakeLock: input.wakeLock !== false
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
        workInCycle: state.workInCycle,
        sessionNumber: state.sessionNumber,
        tasks: state.tasks,
        activeTaskId: state.activeTaskId,
        stats: state.stats,
        history: state.history,
        templates: state.templates
      }));
    } catch (_) {}
  }
  function durationMs(mode = state.mode) { return state.settings.durations[mode] * 60_000; }
  function formatTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  function activeTask() { return state.tasks.find(t => t.id === state.activeTaskId) || null; }

  function render() {
    syncStatsDay();
    document.body.dataset.pomoMode = state.mode;
    themeMeta?.setAttribute("content", state.mode === "work" ? "#ba4949" : state.mode === "short" ? "#3d7f91" : "#4f7d5b");
    timeEl.textContent = formatTime(state.remainingMs);
    $("[data-phase-copy]").textContent = MODE_COPY[state.mode];
    $("[data-phase-duration]").textContent = `${state.settings.durations[state.mode]} min`;
    $("[data-session-label]").textContent = state.mode === "work" ? `Session ${state.sessionNumber}` : MODE_NAMES[state.mode];
    startBtn.textContent = state.running ? "Pause" : "Démarrer";
    startBtn.setAttribute("aria-pressed", String(state.running));

    $$('[data-mode]').forEach(btn => {
      const active = btn.dataset.mode === state.mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    const interval = state.settings.longInterval;
    $("[data-cycle-summary]").textContent = `${Math.min(state.workInCycle, interval)} / ${interval} pomodoros avant la pause longue`;
    $("[data-cycle-dots]").innerHTML = Array.from({ length: interval }, (_, i) => `<i class="${i < state.workInCycle ? "is-done" : ""}" aria-hidden="true"></i>`).join("");

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
    const empty = $("[data-task-empty]");
    list.innerHTML = state.tasks.map(task => `
      <article class="pomo-task${task.id === state.activeTaskId ? " is-active" : ""}${task.done ? " is-done" : ""}" data-task-id="${escapeHtml(task.id)}" tabindex="0">
        <button type="button" class="pomo-task-check${task.done ? " is-done" : ""}" data-task-done aria-label="${task.done ? "Rouvrir" : "Terminer"} la tâche">${task.done ? "✓" : ""}</button>
        <div class="pomo-task-copy"><strong>${escapeHtml(task.title)}</strong><small>${task.completed} / ${task.estimate} pomodoro${task.estimate > 1 ? "s" : ""}</small></div>
        <div class="pomo-task-actions"><button type="button" data-task-minus title="Retirer un Pomodoro">−</button><button type="button" data-task-plus title="Ajouter un Pomodoro">＋</button><button type="button" data-task-delete title="Supprimer">×</button></div>
      </article>`).join("");
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
    document.title = `${formatTime(state.remainingMs)} · ${MODE_NAMES[state.mode]} — Philosophal`;
  }

  function completePhase() {
    const completedMode = state.mode;
    playAlarm();
    notifyCompletion(completedMode);
    if (completedMode === "work") {
      syncStatsDay();
      state.stats.pomodoros += 1;
      state.stats.focusMinutes += state.settings.durations.work;
      const task = activeTask();
      if (task) {
        task.completed += 1;
        if (task.completed >= task.estimate) task.done = true;
      }
      state.workInCycle += 1;
      state.sessionNumber += 1;
      if (state.workInCycle >= state.settings.longInterval) {
        state.workInCycle = 0;
        switchMode("long", { auto: state.settings.autoBreaks, completed: true });
      } else {
        switchMode("short", { auto: state.settings.autoBreaks, completed: true });
      }
    } else {
      switchMode("work", { auto: state.settings.autoWork, completed: true });
    }
  }

  function switchMode(mode, opts = {}) {
    if (!MODE_NAMES[mode]) return;
    pauseTimer();
    state.mode = mode;
    state.remainingMs = durationMs(mode);
    render();
    if (opts.completed) toast(`${MODE_NAMES[mode]} · ${state.settings.durations[mode]} min`);
    if (opts.auto) window.setTimeout(() => { if (!state.running && state.mode === mode) startTimer(); }, 550);
  }

  function resetTimer() {
    pauseTimer();
    state.remainingMs = durationMs();
    render();
    toast("Minuteur réinitialisé.");
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
      wakeLock: $("[data-setting-wakelock]").checked
    });
    pauseTimer();
    state.settings = next;
    state.workInCycle = Math.min(state.workInCycle, Math.max(0, next.longInterval - 1));
    state.remainingMs = durationMs();
    settingsDialog.close?.();
    render();
    toast("Réglages enregistrés.");
  }

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
    $$(`[data-report-range]`).forEach(btn => btn.classList.toggle("is-active", btn.dataset.reportRange === range));
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
    try { new Notification(`${MODE_NAMES[mode]} terminé`, { body: next, icon: "../../favicon-192.png" }); } catch (_) {}
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
  $("[data-skip]").addEventListener("click", skipPhase);
  $("[data-auto-toggle]").addEventListener("click", toggleAuto);
  $("[data-open-settings]").addEventListener("click", openSettings);
  $("[data-save-settings]").addEventListener("click", saveSettings);
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
  window.addEventListener("beforeunload", () => { stopAmbient(); persist(); });
  window.addEventListener("keydown", e => {
    const typing = e.target instanceof HTMLElement && (e.target.matches("input,textarea,select") || e.target.isContentEditable);
    const dialogOpen = $$("dialog").some(dialog => dialog.open);
    if (typing || dialogOpen) return;
    if (e.code === "Space") { e.preventDefault(); startTimer(); }
    else if (e.key === "1") switchMode("work");
    else if (e.key === "2") switchMode("short");
    else if (e.key === "3") switchMode("long");
    else if (e.key.toLowerCase() === "f") toggleFullscreen();
    else if (e.key.toLowerCase() === "s") openSettings();
  });

  render();
})();
