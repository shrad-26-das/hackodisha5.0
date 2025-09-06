const DOM = {
  safeGet(id) {
    if (!id) return null;
    try {
      return document.getElementById(id) || null;
    } catch (e) {
      console.warn(`DOM.safeGet failed for id="${id}"`, e);
      return null;
    }
  },

  safeSetText(id, text) {
    const el = DOM.safeGet(id);
    if (el) el.textContent = text;
  },

  safeSetHTML(id, html) {
    const el = DOM.safeGet(id);
    if (el) el.innerHTML = html;
  },

  safeSetStyle(id, styleProp, value) {
    const el = DOM.safeGet(id);
    if (el) el.style[styleProp] = value;
  },

  safeToggleClass(selector, className, add) {
    try {
      document.querySelectorAll(selector).forEach(el => {
        if (add === undefined) el.classList.toggle(className);
        else if (add) el.classList.add(className);
        else el.classList.remove(className);
      });
    } catch (e) {
      // ignore
    }
  },

  // Find closest matching ancestor that exists (useful when keyboard shortcuts use focused element)
  closestAncestor(el, selector) {
    if (!el) return null;
    try {
      return el.closest(selector);
    } catch (e) {
      return null;
    }
  }
};

/* =========================
   Application State (LocalStorage)
   ========================= */

const AppState = {
  data: {
    steps: 0,
    stepGoal: 10000,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    workoutMinutes: 0,
    workoutGoal: 30,
    calorieGoal: 500,
    activities: [],
    timerState: {
      startTime: null,
      elapsed: 0,
      isRunning: false,
      laps: []
    },
    goals: {
      daily: { steps: 10000, workout: 30, calories: 500 },
      weekly: { steps: 70000, workout: 210, calories: 3500 },
      monthly: { steps: 300000, workout: 900, calories: 15000 }
    }
  },

  storageKey: 'fitTrackerData',

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn('AppState.save failed', e);
    }
  },

  load() {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // shallow-merge top-level only to avoid losing structure
        this.data = { ...this.data, ...parsed };

        // If nested objects exist in parsed, merge them more carefully
        if (parsed.timerState) {
          this.data.timerState = { ...this.data.timerState, ...parsed.timerState };
        }
        if (parsed.goals) {
          this.data.goals = { ...this.data.goals, ...parsed.goals };
        }
      }
    } catch (e) {
      console.warn('AppState.load error', e);
    }
  },

  resetDaily() {
    this.data.steps = 0;
    this.data.caloriesBurned = 0;
    this.data.caloriesConsumed = 0;
    this.data.workoutMinutes = 0;
    this.save();
  }
};

/* =========================
   Activity Tracker Module
   (tracks user actions/messages)
   ========================= */

const activityTracker = {
  init() {
    this.displayActivities();
  },

  addActivity(description) {
    try {
      const activity = {
        time: new Date().toLocaleTimeString(),
        description,
        timestamp: Date.now()
      };
      AppState.data.activities.unshift(activity);
      if (AppState.data.activities.length > 50) {
        AppState.data.activities = AppState.data.activities.slice(0, 50);
      }
      this.displayActivities();
      AppState.save();
    } catch (e) {
      console.warn('activityTracker.addActivity failed', e);
    }
  },

  displayActivities() {
    const activityList = DOM.safeGet('activityList');
    if (!activityList) return;

    if (!AppState.data.activities || AppState.data.activities.length === 0) {
      activityList.innerHTML = `
        <div class="activity-item">
          <div class="activity-time">Just started</div>
          <div class="activity-description">Welcome to FitTracker! Set your first goal to get started.</div>
        </div>`;
      return;
    }

    const activitiesHTML = AppState.data.activities.slice(0, 10).map(activity => `
      <div class="activity-item">
        <div class="activity-time">${activity.time}</div>
        <div class="activity-description">${activity.description}</div>
      </div>
    `).join('');
    activityList.innerHTML = activitiesHTML;
  },

  clearActivity() {
    AppState.data.activities = [];
    this.displayActivities();
    AppState.save();
  }
};

/* =========================
   Step Tracker Module
   ========================= */

const stepTracker = {
  init() {
    this.updateDisplay();
    // Bind quick-add buttons if present
    this.attachQuickButtons();
  },

  attachQuickButtons() {
    const add100Btn = DOM.safeGet('add100Steps');
    if (add100Btn) add100Btn.addEventListener('click', () => this.addSteps(100));

    const add500Btn = DOM.safeGet('add500Steps');
    if (add500Btn) add500Btn.addEventListener('click', () => this.addSteps(500));

    const resetBtn = DOM.safeGet('resetStepsBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetSteps());
  },

  addSteps(count) {
    try {
      AppState.data.steps = (AppState.data.steps || 0) + Number(count || 0);
      this.updateDisplay();
      this.checkGoal();
      activityTracker.addActivity(`Added ${count.toLocaleString ? count.toLocaleString() : count} steps`);
      AppState.save();
    } catch (e) {
      console.warn('stepTracker.addSteps error', e);
    }
  },

  resetSteps() {
    AppState.data.steps = 0;
    this.updateDisplay();
    activityTracker.addActivity('Reset step counter');
    AppState.save();
  },

  updateDisplay() {
    DOM.safeSetText('stepCount', (AppState.data.steps || 0).toLocaleString());
    DOM.safeSetText('stepGoal', (AppState.data.stepGoal || 0).toLocaleString());
    DOM.safeSetText('quickSteps', (AppState.data.steps || 0).toLocaleString());

    // Update progress bar width if element exists
    const percentage = Math.min(((AppState.data.steps || 0) / (AppState.data.stepGoal || 1)) * 100, 100);
    DOM.safeSetStyle('stepProgress', 'width', `${percentage}%`);

    // update progress module
    if (typeof progressOverview !== 'undefined') {
      try { progressOverview.updateProgress(); } catch (e) { /* ignore */ }
    }
  },

  checkGoal() {
    if ((AppState.data.steps || 0) >= (AppState.data.stepGoal || 0)) {
      this.showGoalAchievement('Steps goal achieved! 🎉');
    }
  },

  showGoalAchievement(message) {
    activityTracker.addActivity(message);
    // Optionally show UI toast if element exists
    const toast = DOM.safeGet('goalToast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }
};

/* =========================
   Calorie Tracker Module
   ========================= */

const calorieTracker = {
  init() {
    this.updateDisplay();

    const burnBtn = DOM.safeGet('burnCaloriesBtn');
    if (burnBtn) burnBtn.addEventListener('click', () => this.addBurnedCalories());

    const consumeBtn = DOM.safeGet('consumeCaloriesBtn');
    if (consumeBtn) consumeBtn.addEventListener('click', () => this.addConsumedCalories());
  },

  addBurnedCalories() {
    try {
      const input = DOM.safeGet('burnCaloriesInput');
      if (!input) return;
      const calories = parseInt(input.value, 10) || 0;
      if (calories > 0) {
        AppState.data.caloriesBurned = (AppState.data.caloriesBurned || 0) + calories;
        input.value = '';
        this.updateDisplay();
        this.checkGoal();
        activityTracker.addActivity(`Burned ${calories} calories`);
        AppState.save();
      }
    } catch (e) {
      console.warn('calorieTracker.addBurnedCalories error', e);
    }
  },

  addConsumedCalories() {
    try {
      const input = DOM.safeGet('consumeCaloriesInput');
      if (!input) return;
      const calories = parseInt(input.value, 10) || 0;
      if (calories > 0) {
        AppState.data.caloriesConsumed = (AppState.data.caloriesConsumed || 0) + calories;
        input.value = '';
        this.updateDisplay();
        activityTracker.addActivity(`Consumed ${calories} calories`);
        AppState.save();
      }
    } catch (e) {
      console.warn('calorieTracker.addConsumedCalories error', e);
    }
  },

  updateDisplay() {
    const burned = AppState.data.caloriesBurned || 0;
    const consumed = AppState.data.caloriesConsumed || 0;
    const net = burned - consumed;

    DOM.safeSetText('caloriesBurned', burned);
    DOM.safeSetText('caloriesConsumed', consumed);
    DOM.safeSetText('caloriesNet', net);
    DOM.safeSetText('quickCalories', burned);

    // color styling for net calories if element exists
    const netEl = DOM.safeGet('caloriesNet');
    if (netEl) netEl.style.color = net >= 0 ? '#48BB78' : '#F56565';

    // update progress module
    if (typeof progressOverview !== 'undefined') {
      try { progressOverview.updateProgress(); } catch (e) { /* ignore */ }
    }
  },

  checkGoal() {
    if ((AppState.data.caloriesBurned || 0) >= (AppState.data.calorieGoal || 0)) {
      activityTracker.addActivity('Calorie burn goal achieved! 🔥');
    }
  }
};

/* =========================
   Goal Setter Module
   (supports daily/weekly/monthly tabs)
   ========================= */

const goalSetter = {
  currentTab: 'daily',

  init() {
    // Attach tab button event listeners safely
    document.querySelectorAll('.goal-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.dataset.tab || btn.getAttribute('data-tab') || 'daily';
        this.switchTab(tab, btn);
      });
    });

    const saveStepsBtn = DOM.safeGet('saveStepsGoalBtn');
    if (saveStepsBtn) saveStepsBtn.addEventListener('click', () => this.updateStepsGoal());

    const saveWorkoutBtn = DOM.safeGet('saveWorkoutGoalBtn');
    if (saveWorkoutBtn) saveWorkoutBtn.addEventListener('click', () => this.updateWorkoutGoal());

    const saveCalBtn = DOM.safeGet('saveCalorieGoalBtn');
    if (saveCalBtn) saveCalBtn.addEventListener('click', () => this.updateCalorieGoal());

    // Initialize with daily tab
    this.switchTab('daily', document.querySelector('.goal-tab[data-tab="daily"]'));
  },

  switchTab(tab, btnElement) {
    this.currentTab = tab || 'daily';

    // Update tab UI: remove active from all, add to clicked
    try {
      document.querySelectorAll('.goal-tab').forEach(b => b.classList.remove('active'));
      if (btnElement) btnElement.classList.add('active');
      else {
        const el = document.querySelector(`.goal-tab[data-tab="${this.currentTab}"]`);
        if (el) el.classList.add('active');
      }
    } catch (e) {
      // ignore DOM problems
    }

    // Update content inputs
    this.updateGoalContent(this.currentTab);
  },

  updateGoalContent(tab) {
    try {
      const goals = (AppState.data.goals && AppState.data.goals[tab]) ? AppState.data.goals[tab] : { steps: 10000, workout: 30, calories: 500 };

      // Use generic IDs that are prefixed by tab (supports daily/weekly/monthly)
      // For simplicity we use daily* IDs in UI; ensure they exist in HTML
      if (tab === 'daily') {
        const elSteps = DOM.safeGet('dailyStepsGoal');
        if (elSteps) elSteps.value = goals.steps;
        const elWorkout = DOM.safeGet('dailyWorkoutGoal');
        if (elWorkout) elWorkout.value = goals.workout;
        const elCalories = DOM.safeGet('dailyCalorieGoal');
        if (elCalories) elCalories.value = goals.calories;
      } else {
        // If UI uses separate inputs for weekly/monthly, update them similarly (IDs can be weeklyStepsGoal etc.)
        const prefix = tab;
        const stepsEl = DOM.safeGet(`${prefix}StepsGoal`);
        if (stepsEl) stepsEl.value = goals.steps;
        const workoutEl = DOM.safeGet(`${prefix}WorkoutGoal`);
        if (workoutEl) workoutEl.value = goals.workout;
        const calEl = DOM.safeGet(`${prefix}CalorieGoal`);
        if (calEl) calEl.value = goals.calories;
      }
    } catch (e) {
      console.warn('goalSetter.updateGoalContent error', e);
    }
  },

  updateStepsGoal() {
    try {
      const input = DOM.safeGet('dailyStepsGoal') || DOM.safeGet(`${this.currentTab}StepsGoal`);
      const value = parseInt(input && input.value, 10) || 10000;
      AppState.data.goals[this.currentTab] = AppState.data.goals[this.currentTab] || { steps: 10000, workout: 30, calories: 500 };
      AppState.data.goals[this.currentTab].steps = value;

      if (this.currentTab === 'daily') {
        AppState.data.stepGoal = value;
        stepTracker.updateDisplay();
      }

      activityTracker.addActivity(`Updated ${this.currentTab} steps goal to ${value.toLocaleString()}`);
      AppState.save();
    } catch (e) {
      console.warn('goalSetter.updateStepsGoal error', e);
    }
  },

  updateWorkoutGoal() {
    try {
      const input = DOM.safeGet('dailyWorkoutGoal') || DOM.safeGet(`${this.currentTab}WorkoutGoal`);
      const value = parseInt(input && input.value, 10) || 30;
      AppState.data.goals[this.currentTab] = AppState.data.goals[this.currentTab] || { steps: 10000, workout: 30, calories: 500 };
      AppState.data.goals[this.currentTab].workout = value;

      if (this.currentTab === 'daily') {
        AppState.data.workoutGoal = value;
      }

      activityTracker.addActivity(`Updated ${this.currentTab} workout goal to ${value} minutes`);
      if (typeof progressOverview !== 'undefined') { try { progressOverview.updateProgress(); } catch (e) { } }
      AppState.save();
    } catch (e) {
      console.warn('goalSetter.updateWorkoutGoal error', e);
    }
  },

  updateCalorieGoal() {
    try {
      const input = DOM.safeGet('dailyCalorieGoal') || DOM.safeGet(`${this.currentTab}CalorieGoal`);
      const value = parseInt(input && input.value, 10) || 500;
      AppState.data.goals[this.currentTab] = AppState.data.goals[this.currentTab] || { steps: 10000, workout: 30, calories: 500 };
      AppState.data.goals[this.currentTab].calories = value;

      if (this.currentTab === 'daily') {
        AppState.data.calorieGoal = value;
      }

      activityTracker.addActivity(`Updated ${this.currentTab} calorie goal to ${value}`);
      if (typeof progressOverview !== 'undefined') { try { progressOverview.updateProgress(); } catch (e) { } }
      AppState.save();
    } catch (e) {
      console.warn('goalSetter.updateCalorieGoal error', e);
    }
  }
};

/* =========================
   Progress Overview Module
   (circular progress, weekly summary)
   ========================= */

const progressOverview = {
  init() {
    this.updateProgress();
    this.updateWeeklySummary();
  },

  updateProgress() {
    try {
      // Steps
      const stepsPercentage = Math.min(((AppState.data.steps || 0) / (AppState.data.stepGoal || 1)) * 100, 100);
      this.updateCircularProgress('stepsProgressCircle', 'stepsPercentage', stepsPercentage);

      // Workout minutes
      const workoutPercentage = Math.min(((AppState.data.workoutMinutes || 0) / (AppState.data.workoutGoal || 1)) * 100, 100);
      this.updateCircularProgress('workoutProgressCircle', 'workoutPercentage', workoutPercentage);

      // Calories
      const caloriePercentage = Math.min(((AppState.data.caloriesBurned || 0) / (AppState.data.calorieGoal || 1)) * 100, 100);
      this.updateCircularProgress('calorieProgressCircle', 'caloriePercentage', caloriePercentage);
    } catch (e) {
      console.warn('progressOverview.updateProgress error', e);
    }
  },

  updateCircularProgress(circleId, textId, percentage) {
    try {
      const circle = DOM.safeGet(circleId);
      const text = DOM.safeGet(textId);
      if (circle) {
        // circumference for a circle with r = 25 (matching earlier code)
        const circumference = 2 * Math.PI * 25;
        const offset = circumference - (percentage / 100) * circumference;
        // Support style or attribute based stroke-dashoffset depending on implementation
        try {
          circle.style.strokeDashoffset = offset;
        } catch (e) {
          try { circle.setAttribute('stroke-dashoffset', offset); } catch (e2) { /* ignore */ }
        }
      }
      if (text) text.textContent = `${Math.round(percentage)}%`;
    } catch (e) {
      console.warn('progressOverview.updateCircularProgress error', e);
    }
  },

  updateWeeklySummary() {
    try {
      // Demo: extrapolate 7x daily as placeholder
      DOM.safeSetText('weeklySteps', ((AppState.data.steps || 0) * 7).toLocaleString());
      DOM.safeSetText('weeklyWorkouts', (AppState.data.workoutMinutes || 0) * 7);
      DOM.safeSetText('weeklyCalories', (AppState.data.caloriesBurned || 0) * 7);

      let goalsHit = 0;
      if ((AppState.data.steps || 0) >= (AppState.data.stepGoal || 0)) goalsHit++;
      if ((AppState.data.workoutMinutes || 0) >= (AppState.data.workoutGoal || 0)) goalsHit++;
      if ((AppState.data.caloriesBurned || 0) >= (AppState.data.calorieGoal || 0)) goalsHit++;

      DOM.safeSetText('weeklyGoalsHit', goalsHit);
    } catch (e) {
      console.warn('progressOverview.updateWeeklySummary error', e);
    }
  }
};

/* =========================
   Workout Timer Module
   (start/pause/reset/lap)
   ========================= */

const workoutTimer = {
  timerInterval: null,

  init() {
    // Attach buttons if they exist
    const startPause = DOM.safeGet('startPauseBtn');
    if (startPause) startPause.addEventListener('click', () => this.toggleTimer());

    const resetBtn = DOM.safeGet('resetTimerBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetTimer());

    const lapBtn = DOM.safeGet('lapBtn');
    if (lapBtn) lapBtn.addEventListener('click', () => this.lapTimer());

    this.updateDisplay();
  },

  toggleTimer() {
    try {
      const timerState = AppState.data.timerState;
      const startPauseBtn = DOM.safeGet('startPauseBtn');

      if (!timerState.isRunning) {
        // Start
        timerState.startTime = Date.now() - (timerState.elapsed || 0);
        timerState.isRunning = true;
        if (startPauseBtn) startPauseBtn.textContent = 'Pause';
        DOM.safeSetText('timerStatus', 'Workout in progress');
        const displayWrapper = DOM.safeGet('timerWrapper');
        if (displayWrapper) displayWrapper.classList.add('active');

        this.timerInterval = setInterval(() => this.updateTimer(), 100);
        const workoutType = (DOM.safeGet('workoutType') && DOM.safeGet('workoutType').value) || 'Workout';
        activityTracker.addActivity(`Started ${workoutType} workout`);
      } else {
        // Pause
        this.pauseTimer();
      }

      AppState.save();
    } catch (e) {
      console.warn('workoutTimer.toggleTimer error', e);
    }
  },

  pauseTimer() {
    try {
      const timerState = AppState.data.timerState;
      const startPauseBtn = DOM.safeGet('startPauseBtn');

      timerState.isRunning = false;
      if (startPauseBtn) startPauseBtn.textContent = 'Resume';
      DOM.safeSetText('timerStatus', 'Workout paused');
      const displayWrapper = DOM.safeGet('timerWrapper');
      if (displayWrapper) displayWrapper.classList.remove('active');

      if (this.timerInterval) clearInterval(this.timerInterval);

      activityTracker.addActivity('Paused workout');
      AppState.save();
    } catch (e) {
      console.warn('workoutTimer.pauseTimer error', e);
    }
  },

  resetTimer() {
    try {
      const timerState = AppState.data.timerState;

      // Add workout minutes to total before resetting
      if (timerState.elapsed > 0) {
        const minutes = Math.floor(timerState.elapsed / 60000);
        if (minutes > 0) {
          AppState.data.workoutMinutes = (AppState.data.workoutMinutes || 0) + minutes;
          DOM.safeSetText('quickWorkoutTime', (AppState.data.workoutMinutes || 0));
          activityTracker.addActivity(`Completed ${minutes} minute workout`);
          this.checkWorkoutGoal();
        }
      }

      timerState.startTime = null;
      timerState.elapsed = 0;
      timerState.isRunning = false;
      timerState.laps = [];

      const startBtn = DOM.safeGet('startPauseBtn');
      if (startBtn) startBtn.textContent = 'Start';
      DOM.safeSetText('timerStatus', 'Ready to start');
      const displayWrapper = DOM.safeGet('timerWrapper');
      if (displayWrapper) displayWrapper.classList.remove('active');

      const lapTimes = DOM.safeGet('lapTimes');
      if (lapTimes) lapTimes.innerHTML = '';

      if (this.timerInterval) clearInterval(this.timerInterval);

      this.updateDisplay();
      if (typeof progressOverview !== 'undefined') { try { progressOverview.updateProgress(); } catch (e) { } }
      AppState.save();
    } catch (e) {
      console.warn('workoutTimer.resetTimer error', e);
    }
  },

  lapTimer() {
    try {
      const timerState = AppState.data.timerState;
      if (timerState.isRunning) {
        const lapTime = timerState.elapsed || 0;
        timerState.laps.push(lapTime);
        this.displayLap(timerState.laps.length, lapTime);
        activityTracker.addActivity(`Lap ${timerState.laps.length}: ${this.formatTime(lapTime)}`);
      }
    } catch (e) {
      console.warn('workoutTimer.lapTimer error', e);
    }
  },

  updateTimer() {
    try {
      const timerState = AppState.data.timerState;
      if (timerState.isRunning && timerState.startTime) {
        timerState.elapsed = Date.now() - timerState.startTime;
        this.updateDisplay();
      }
    } catch (e) {
      console.warn('workoutTimer.updateTimer error', e);
    }
  },

  updateDisplay() {
    const timerDisplay = DOM.safeGet('timerDisplay');
    const elapsed = AppState.data.timerState.elapsed || 0;
    if (timerDisplay) timerDisplay.textContent = this.formatTime(elapsed);
  },

  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 60000) % 60;
    const hours = Math.floor(milliseconds / 3600000);
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  },

  displayLap(lapNumber, lapTime) {
    const lapTimes = DOM.safeGet('lapTimes');
    if (!lapTimes) return;
    const lapElement = document.createElement('div');
    lapElement.className = 'lap-time';
    lapElement.innerHTML = `
      <span>Lap ${lapNumber}</span>
      <span>${this.formatTime(lapTime)}</span>
    `;
    lapTimes.appendChild(lapElement);
  },

  checkWorkoutGoal() {
    if ((AppState.data.workoutMinutes || 0) >= (AppState.data.workoutGoal || 0)) {
      activityTracker.addActivity('Daily workout goal achieved! 💪');
    }
  }
};

/* =========================
   Utilities (date / new day detection)
   ========================= */

const utils = {
  updateCurrentDate() {
    const dateDisplay = DOM.safeGet('currentDate');
    if (!dateDisplay) return;
    try {
      const today = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateDisplay.textContent = today.toLocaleDateString('en-US', options);
    } catch (e) {
      console.warn('utils.updateCurrentDate error', e);
    }
  },

  checkNewDay() {
    try {
      const lastDate = localStorage.getItem('lastAccessDate');
      const todayStr = new Date().toDateString();
      if (lastDate !== todayStr) {
        if (lastDate) {
          // It's a new day — reset daily stats
          AppState.resetDaily();
          activityTracker.addActivity('New day started! Daily stats reset.');
        }
        localStorage.setItem('lastAccessDate', todayStr);
      }
    } catch (e) {
      console.warn('utils.checkNewDay error', e);
    }
  }
};

/* =========================
   Initialization & Event Wiring
   ========================= */

document.addEventListener('DOMContentLoaded', function() {
  try {
    // Load saved data and update UI
    AppState.load();

    // Daily reset detection & date
    utils.checkNewDay();
    utils.updateCurrentDate();

    // Initialize modules in safe order
    activityTracker.init();
    stepTracker.init();
    calorieTracker.init();
    goalSetter.init();
    progressOverview.init();
    workoutTimer.init();

    // Add welcome message if there are no activities
    if (!Array.isArray(AppState.data.activities) || AppState.data.activities.length === 0) {
      activityTracker.addActivity('Welcome to FitTracker! Start logging your fitness journey today.');
    }

    console.log('FitTracker initialized successfully! 💪');

    // Keyboard shortcuts (safe)
    document.addEventListener('keydown', function(e) {
      // Space toggles timer when focus is inside timer wrapper area
      try {
        if (e.code === 'Space') {
          const focused = document.activeElement;
          const timerAncestor = DOM.closestAncestor(focused, '.workout-timer');
          if (timerAncestor) {
            e.preventDefault();
            workoutTimer.toggleTimer();
            return;
          }
        }

        // Enter in step-counter triggers quick add (example)
        if (e.code === 'Enter') {
          const focused = document.activeElement;
          const stepAncestor = DOM.closestAncestor(focused, '.step-counter');
          if (stepAncestor) {
            e.preventDefault();
            // Add a default increment (100) as example when user presses Enter in step counter
            stepTracker.addSteps(100);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
    });

    // Enter key for calorie inputs (keypress is deprecated in some contexts; use keydown)
    document.addEventListener('keydown', function(e) {
      try {
        if (e.key === 'Enter') {
          const id = e.target && e.target.id;
          if (id === 'burnCaloriesInput') {
            calorieTracker.addBurnedCalories();
          } else if (id === 'consumeCaloriesInput') {
            calorieTracker.addConsumedCalories();
          }
        }
      } catch (e) { /* ignore */ }
    });

    // Save data on unload
    window.addEventListener('beforeunload', function() {
      AppState.save();
    });

    // Update date/check new day every minute
    setInterval(() => {
      utils.updateCurrentDate();
      utils.checkNewDay();
    }, 60000);

    // Optional: attempt ServiceWorker registration (will fail if not served over HTTPS/localhost)
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register('/service-worker.js').then(reg => {
          console.log('ServiceWorker registered with scope:', reg.scope);
        }).catch(err => {
          console.warn('ServiceWorker registration failed:', err);
        });
      } catch (e) {
        console.warn('ServiceWorker registration threw:', e);
      }
    }
  } catch (e) {
    console.error('FitTracker initialization failed', e);
  }
});

/* =========================
   Public API (optional)
   ========================= */

// Expose a small API for debugging in the console
window.FitTracker = {
  AppState,
  stepTracker,
  calorieTracker,
  goalSetter,
  workoutTimer,
  activityTracker,
  progressOverview,
  utils,
  DOM
};
