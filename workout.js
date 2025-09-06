// ===== GLOBAL STATE MANAGEMENT =====
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
    
    // Save data to localStorage
    save() {
        localStorage.setItem('fitTrackerData', JSON.stringify(this.data));
    },
    
    // Load data from localStorage
    load() {
        const savedData = localStorage.getItem('fitTrackerData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.data = { ...this.data, ...parsed };
        }
    },
    
    // Reset daily data (called at midnight)
    resetDaily() {
        this.data.steps = 0;
        this.data.caloriesBurned = 0;
        this.data.caloriesConsumed = 0;
        this.data.workoutMinutes = 0;
        this.save();
    }
};

// ===== STEP TRACKER MODULE =====
const stepTracker = {
    init() {
        this.updateDisplay();
    },
    
    addSteps(count) {
        AppState.data.steps += count;
        this.updateDisplay();
        this.checkGoal();
        activityTracker.addActivity(`Added ${count} steps`);
        AppState.save();
    },
    
    resetSteps() {
        AppState.data.steps = 0;
        this.updateDisplay();
        activityTracker.addActivity('Reset step counter');
        AppState.save();
    },
    
    updateDisplay() {
        const stepCount = document.getElementById('stepCount');
        const stepGoal = document.getElementById('stepGoal');
        const quickSteps = document.getElementById('quickSteps');
        const stepProgress = document.getElementById('stepProgress');
        
        if (stepCount) stepCount.textContent = AppState.data.steps.toLocaleString();
        if (stepGoal) stepGoal.textContent = AppState.data.stepGoal.toLocaleString();
        if (quickSteps) quickSteps.textContent = AppState.data.steps.toLocaleString();
        
        // Update progress bar
        const percentage = Math.min((AppState.data.steps / AppState.data.stepGoal) * 100, 100);
        if (stepProgress) stepProgress.style.width = `${percentage}%`;
        
        // Update progress overview
        progressOverview.updateProgress();
    },
    
    checkGoal() {
        if (AppState.data.steps >= AppState.data.stepGoal) {
            this.showGoalAchievement('Steps goal achieved! 🎉');
        }
    },
    
    showGoalAchievement(message) {
        activityTracker.addActivity(message);
    }
};

// ===== CALORIE TRACKER MODULE =====
const calorieTracker = {
    init() {
        this.updateDisplay();
    },
    
    addBurnedCalories() {
        const input = document.getElementById('burnCaloriesInput');
        const calories = parseInt(input.value) || 0;
        
        if (calories > 0) {
            AppState.data.caloriesBurned += calories;
            input.value = '';
            this.updateDisplay();
            this.checkGoal();
            activityTracker.addActivity(`Burned ${calories} calories`);
            AppState.save();
        }
    },
    
    addConsumedCalories() {
        const input = document.getElementById('consumeCaloriesInput');
        const calories = parseInt(input.value) || 0;
        
        if (calories > 0) {
            AppState.data.caloriesConsumed += calories;
            input.value = '';
            this.updateDisplay();
            activityTracker.addActivity(`Consumed ${calories} calories`);
            AppState.save();
        }
    },
    
    updateDisplay() {
        const burnedEl = document.getElementById('caloriesBurned');
        const consumedEl = document.getElementById('caloriesConsumed');
        const netEl = document.getElementById('caloriesNet');
        const quickCalories = document.getElementById('quickCalories');
        
        const net = AppState.data.caloriesBurned - AppState.data.caloriesConsumed;
        
        if (burnedEl) burnedEl.textContent = AppState.data.caloriesBurned;
        if (consumedEl) consumedEl.textContent = AppState.data.caloriesConsumed;
        if (netEl) netEl.textContent = net;
        if (quickCalories) quickCalories.textContent = AppState.data.caloriesBurned;
        
        // Update net calorie styling
        if (netEl) {
            netEl.style.color = net >= 0 ? '#48BB78' : '#F56565';
        }
        
        // Update progress overview
        progressOverview.updateProgress();
    },
    
    checkGoal() {
        if (AppState.data.caloriesBurned >= AppState.data.calorieGoal) {
            activityTracker.addActivity('Calorie burn goal achieved! 🔥');
        }
    }
};

// ===== GOAL SETTER MODULE =====
const goalSetter = {
    currentTab: 'daily',
    
    init() {
        this.switchTab('daily');
    },
    
    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.goal-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update content based on selected tab
        this.updateGoalContent(tab);
    },
    
    updateGoalContent(tab) {
        const goals = AppState.data.goals[tab];
        document.getElementById('dailyStepsGoal').value = goals.steps;
        document.getElementById('dailyWorkoutGoal').value = goals.workout;
        document.getElementById('dailyCalorieGoal').value = goals.calories;
    },
    
    updateStepsGoal() {
        const value = parseInt(document.getElementById('dailyStepsGoal').value) || 10000;
        AppState.data.goals[this.currentTab].steps = value;
        
        if (this.currentTab === 'daily') {
            AppState.data.stepGoal = value;
            stepTracker.updateDisplay();
        }
        
        activityTracker.addActivity(`Updated ${this.currentTab} steps goal to ${value.toLocaleString()}`);
        AppState.save();
    },
    
    updateWorkoutGoal() {
        const value = parseInt(document.getElementById('dailyWorkoutGoal').value) || 30;
        AppState.data.goals[this.currentTab].workout = value;
        
        if (this.currentTab === 'daily') {
            AppState.data.workoutGoal = value;
        }
        
        activityTracker.addActivity(`Updated ${this.currentTab} workout goal to ${value} minutes`);
        progressOverview.updateProgress();
        AppState.save();
    },
    
    updateCalorieGoal() {
        const value = parseInt(document.getElementById('dailyCalorieGoal').value) || 500;
        AppState.data.goals[this.currentTab].calories = value;
        
        if (this.currentTab === 'daily') {
            AppState.data.calorieGoal = value;
        }
        
        activityTracker.addActivity(`Updated ${this.currentTab} calorie goal to ${value}`);
        progressOverview.updateProgress();
        AppState.save();
    }
};

// ===== PROGRESS OVERVIEW MODULE =====
const progressOverview = {
    init() {
        this.updateProgress();
        this.updateWeeklySummary();
    },
    
    updateProgress() {
        // Steps progress
        const stepsPercentage = Math.min((AppState.data.steps / AppState.data.stepGoal) * 100, 100);
        this.updateCircularProgress('stepsProgressCircle', 'stepsPercentage', stepsPercentage);
        
        // Workout progress
        const workoutPercentage = Math.min((AppState.data.workoutMinutes / AppState.data.workoutGoal) * 100, 100);
        this.updateCircularProgress('workoutProgressCircle', 'workoutPercentage', workoutPercentage);
        
        // Calorie progress
        const caloriePercentage = Math.min((AppState.data.caloriesBurned / AppState.data.calorieGoal) * 100, 100);
        this.updateCircularProgress('calorieProgressCircle', 'caloriePercentage', caloriePercentage);
    },
    
    updateCircularProgress(circleId, textId, percentage) {
        const circle = document.getElementById(circleId);
        const text = document.getElementById(textId);
        
        if (circle) {
            const circumference = 157; // 2 * π * 25
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
        
        if (text) {
            text.textContent = `${Math.round(percentage)}%`;
        }
    },
    
    updateWeeklySummary() {
        // This would normally pull from a week's worth of data
        // For demo purposes, using current day's data
        document.getElementById('weeklySteps').textContent = (AppState.data.steps * 7).toLocaleString();
        document.getElementById('weeklyWorkouts').textContent = AppState.data.workoutMinutes * 7;
        document.getElementById('weeklyCalories').textContent = AppState.data.caloriesBurned * 7;
        
        // Calculate goals hit
        let goalsHit = 0;
        if (AppState.data.steps >= AppState.data.stepGoal) goalsHit++;
        if (AppState.data.workoutMinutes >= AppState.data.workoutGoal) goalsHit++;
        if (AppState.data.caloriesBurned >= AppState.data.calorieGoal) goalsHit++;
        
        document.getElementById('weeklyGoalsHit').textContent = goalsHit;
    }
};

// ===== WORKOUT TIMER MODULE =====
const workoutTimer = {
    init() {
        this.updateDisplay();
    },
    
    toggleTimer() {
        const timerState = AppState.data.timerState;
        const startPauseBtn = document.getElementById('startPauseBtn');
        
        if (!timerState.isRunning) {
            // Start timer
            timerState.startTime = Date.now() - timerState.elapsed;
            timerState.isRunning = true;
            startPauseBtn.textContent = 'Pause';
            document.getElementById('timerStatus').textContent = 'Workout in progress';
            document.querySelector('.timer-display').classList.add('active');
            
            this.timerInterval = setInterval(() => this.updateTimer(), 100);
            activityTracker.addActivity(`Started ${document.getElementById('workoutType').value} workout`);
        } else {
            // Pause timer
            this.pauseTimer();
        }
        
        AppState.save();
    },
    
    pauseTimer() {
        const timerState = AppState.data.timerState;
        const startPauseBtn = document.getElementById('startPauseBtn');
        
        timerState.isRunning = false;
        startPauseBtn.textContent = 'Resume';
        document.getElementById('timerStatus').textContent = 'Workout paused';
        document.querySelector('.timer-display').classList.remove('active');
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        activityTracker.addActivity('Paused workout');
    },
    
    resetTimer() {
        const timerState = AppState.data.timerState;
        
        // Add workout minutes to total before resetting
        if (timerState.elapsed > 0) {
            const minutes = Math.floor(timerState.elapsed / 60000);
            AppState.data.workoutMinutes += minutes;
            document.getElementById('quickWorkoutTime').textContent = AppState.data.workoutMinutes;
            
            if (minutes > 0) {
                activityTracker.addActivity(`Completed ${minutes} minute workout`);
                this.checkWorkoutGoal();
            }
        }
        
        timerState.startTime = null;
        timerState.elapsed = 0;
        timerState.isRunning = false;
        timerState.laps = [];
        
        document.getElementById('startPauseBtn').textContent = 'Start';
        document.getElementById('timerStatus').textContent = 'Ready to start';
        document.querySelector('.timer-display').classList.remove('active');
        document.getElementById('lapTimes').innerHTML = '';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.updateDisplay();
        progressOverview.updateProgress();
        AppState.save();
    },
    
    lapTimer() {
        const timerState = AppState.data.timerState;
        
        if (timerState.isRunning) {
            const lapTime = timerState.elapsed;
            timerState.laps.push(lapTime);
            this.displayLap(timerState.laps.length, lapTime);
            activityTracker.addActivity(`Lap ${timerState.laps.length}: ${this.formatTime(lapTime)}`);
        }
    },
    
    updateTimer() {
        const timerState = AppState.data.timerState;
        
        if (timerState.isRunning && timerState.startTime) {
            timerState.elapsed = Date.now() - timerState.startTime;
            this.updateDisplay();
        }
    },
    
    updateDisplay() {
        const timerDisplay = document.getElementById('timerDisplay');
        const elapsed = AppState.data.timerState.elapsed;
        
        if (timerDisplay) {
            timerDisplay.textContent = this.formatTime(elapsed);
        }
    },
    
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000) % 60;
        const minutes = Math.floor(milliseconds / 60000) % 60;
        const hours = Math.floor(milliseconds / 3600000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    displayLap(lapNumber, lapTime) {
        const lapTimes = document.getElementById('lapTimes');
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-time';
        lapElement.innerHTML = `
            <span>Lap ${lapNumber}</span>
            <span>${this.formatTime(lapTime)}</span>
        `;
        lapTimes.appendChild(lapElement);
    },
    
    checkWorkoutGoal() {
        if (AppState.data.workoutMinutes >= AppState.data.workoutGoal) {
            activityTracker.addActivity('Daily workout goal achieved! 💪');
        }
    }
};

// ===== ACTIVITY TRACKER MODULE =====
const activityTracker = {
    init() {
        this.displayActivities();
    },
    
    addActivity(description) {
        const activity = {
            time: new Date().toLocaleTimeString(),
            description: description,
            timestamp: Date.now()
        };
        
        AppState.data.activities.unshift(activity);
        
        // Keep only last 50 activities
        if (AppState.data.activities.length > 50) {
            AppState.data.activities = AppState.data.activities.slice(0, 50);
        }
        
        this.displayActivities();
        AppState.save();
    },
    
    displayActivities() {
        const activityList = document.getElementById('activityList');
        
        if (!activityList) return;
        
        if (AppState.data.activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-time">Just started</div>
                    <div class="activity-description">Welcome to FitTracker! Set your first goal to get started.</div>
                </div>
            `;
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

// ===== UTILITY FUNCTIONS =====
const utils = {
    updateCurrentDate() {
        const dateDisplay = document.getElementById('currentDate');
        if (dateDisplay) {
            const today = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateDisplay.textContent = today.toLocaleDateString('en-US', options);
        }
    },
    
    // Check if it's a new day and reset daily data if needed
    checkNewDay() {
        const lastDate = localStorage.getItem('lastAccessDate');
        const today = new Date().toDateString();
        
        if (lastDate !== today) {
            if (lastDate) {
                // It's a new day, reset daily data
                AppState.resetDaily();
                activityTracker.addActivity('New day started! Daily stats reset.');
            }
            localStorage.setItem('lastAccessDate', today);
        }
    }
};

// ===== MAIN APPLICATION INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    AppState.load();
    
    // Check for new day
    utils.checkNewDay();
    
    // Update current date
    utils.updateCurrentDate();
    
    // Initialize all modules
    stepTracker.init();
    calorieTracker.init();
    goalSetter.init();
    progressOverview.init();
    workoutTimer.init();
    activityTracker.init();
    
    // Add welcome message if it's the first time
    if (AppState.data.activities.length === 0) {
        activityTracker.addActivity('Welcome to FitTracker! Start logging your fitness journey today.');
    }
    
    console.log('FitTracker initialized successfully! 💪');
});

// ===== EVENT LISTENERS =====
// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar to toggle timer when focused on timer section
    if (e.code === 'Space' && document.activeElement.closest('.workout-timer')) {
        e.preventDefault();
        workoutTimer.toggleTimer();
    }
    
    // Enter key to add steps when focused on step counter
    if (e.code === 'Enter' && document.activeElement.closest('.step-counter')) {
        e.preventDefault();
        stepTracker.addSteps(100);
    }
});

// Handle input field enter key submissions
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (e.target.id === 'burnCaloriesInput') {
            calorieTracker.addBurnedCalories();
        } else if (e.target.id === 'consumeCaloriesInput') {
            calorieTracker.addConsumedCalories();
        }
    }
});

// Save data when page is about to unload
window.addEventListener('beforeunload', function() {
    AppState.save();
});

// Update date every minute
setInterval(() => {
    utils.updateCurrentDate();
    utils.checkNewDay();
}, 60000);