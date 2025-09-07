

// Create the main application structure
document.querySelector('#app').innerHTML = `
  <div class="container">
    <!-- Header Section -->
    <header class="header">
      <div class="header-content">
        <h1 class="main-title">Dreamy Hair Studio</h1>
        <p class="subtitle">Discover your perfect hair routine with our gentle, loving approach</p>
      </div>
      <div class="floating-elements">
        <div class="float-element float-1"></div>
        <div class="float-element float-2"></div>
        <div class="float-element float-3"></div>
      </div>
    </header>

    <!-- Hair Quiz Section -->
    <section class="quiz-section">
      <div class="section-content">
        <h2 class="section-title">Discover Your Hair Type</h2>
        <p class="section-subtitle">Let's find the perfect routine just for you!</p>
        
        <div class="quiz-container" id="quiz-container">
          <div class="quiz-question">
            <h3>What's your hair texture?</h3>
            <div class="quiz-options">
              <button class="quiz-option" data-type="straight">
                <i class="fas fa-minus"></i>
                <span>Straight</span>
                <small>Sleek and smooth strands</small>
              </button>
              <button class="quiz-option" data-type="wavy">
                <i class="fas fa-water"></i>
                <span>Wavy</span>
                <small>Gentle curves and waves</small>
              </button>
              <button class="quiz-option" data-type="curly">
                <i class="fas fa-sync-alt"></i>
                <span>Curly</span>
                <small>Bouncy spirals and coils</small>
              </button>
              <button class="quiz-option" data-type="coily">
                <i class="fas fa-circle"></i>
                <span>Coily</span>
                <small>Tight coils and kinks</small>
              </button>
            </div>
          </div>
        </div>

        <div class="quiz-result" id="quiz-result" style="display: none;">
          <div class="result-content">
            <h3 class="result-title">Perfect! Here's your personalized routine:</h3>
            <div class="result-text" id="result-text"></div>
            <div class="routine-schedule" id="routine-schedule"></div>
            <div class="reminder-section">
              <h4>Set Your Reminders</h4>
              <div class="reminder-controls">
                <input type="time" id="reminder-time" value="08:00">
                <button class="set-reminder-btn" id="set-reminder">Set Daily Reminder</button>
              </div>
              <div class="active-reminders" id="active-reminders"></div>
            </div>
            <button class="restart-quiz" id="restart-quiz">Try Again</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Haircare Suggestions -->
    <section class="suggestions-section">
      <div class="section-content">
        <h2 class="section-title">Essential Haircare Tips</h2>
        <p class="section-subtitle">Simple steps for beautiful, healthy hair every day</p>
        
        <div class="suggestions-grid">
          <div class="suggestion-card">
            <div class="card-icon">
              <i class="fas fa-tint"></i>
            </div>
            <h3>Stay Hydrated</h3>
            <p>Use a deep conditioning mask once a week to keep your hair moisturized and healthy. Focus on the mid-lengths and ends.</p>
          </div>
          
          <div class="suggestion-card">
            <div class="card-icon">
              <i class="fas fa-cut"></i>
            </div>
            <h3>Regular Trims</h3>
            <p>Trim your hair every 6-8 weeks to prevent split ends and maintain healthy growth. Even a small trim makes a big difference.</p>
          </div>
          
          <div class="suggestion-card">
            <div class="card-icon">
              <i class="fas fa-thermometer-half"></i>
            </div>
            <h3>Heat Protection</h3>
            <p>Always use a heat protectant spray before styling with hot tools. Keep temperatures moderate to prevent damage.</p>
          </div>
          
          <div class="suggestion-card">
            <div class="card-icon">
              <i class="fas fa-moon"></i>
            </div>
            <h3>Silk Pillowcase</h3>
            <p>Sleep on a silk or satin pillowcase to reduce friction and prevent hair breakage while you sleep.</p>
          </div>
          
          <div class="suggestion-card">
            <div class="card-icon">
              <i class="fas fa-leaf"></i>
            </div>
            <h3>Natural Oils</h3>
            <p>Use natural oils like argan or coconut oil as a pre-shampoo treatment or leave-in conditioner for extra nourishment.</p>
          </div>
          
          <div class="suggestion-card">
            <div class="card-icon">
              <i class="fas fa-sun"></i>
            </div>
            <h3>UV Protection</h3>
            <p>Protect your hair from sun damage with UV-protective products or wear a hat during prolonged sun exposure.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Confetti Container -->
    <div class="confetti-container" id="confetti-container"></div>
  </div>
`

// Hair type routines and advice data
const hairRoutines = {
  straight: {
    title: "Straight Hair Routine",
    advice: "Your sleek strands are naturally smooth! Focus on lightweight products that won't weigh your hair down.",
    routine: {
      daily: [
        "Use a gentle volumizing shampoo",
        "Apply lightweight conditioner to mid-lengths and ends",
        "Use dry shampoo for volume between washes"
      ],
      weekly: [
        "Deep cleanse with clarifying shampoo once a week",
        "Apply a lightweight hair mask",
        "Trim every 6-8 weeks to maintain shape"
      ],
      styling: [
        "Use volumizing mousse on damp hair",
        "Blow dry with a round brush for lift",
        "Finish with light-hold hairspray"
      ]
    }
  },
  wavy: {
    title: "Wavy Hair Routine", 
    advice: "Your beautiful waves need just the right balance of moisture and hold to enhance your natural texture.",
    routine: {
      daily: [
        "Use sulfate-free shampoo 2-3 times per week",
        "Apply leave-in conditioner to damp hair",
        "Scrunch with curl-enhancing cream"
      ],
      weekly: [
        "Deep condition once a week",
        "Use a protein treatment bi-weekly",
        "Sleep with hair in a loose bun or silk scarf"
      ],
      styling: [
        "Apply products to soaking wet hair",
        "Use the 'plopping' method to dry",
        "Diffuse on low heat or air dry"
      ]
    }
  },
  curly: {
    title: "Curly Hair Routine",
    advice: "Your gorgeous curls thrive with moisture and gentle care! Embrace the curl pattern and avoid disrupting it.",
    routine: {
      daily: [
        "Co-wash or use sulfate-free shampoo",
        "Apply generous leave-in conditioner",
        "Use curl cream with praying hands method"
      ],
      weekly: [
        "Deep condition with protein-free mask",
        "Detangle only when wet with conditioner",
        "Sleep on silk pillowcase or use silk bonnet"
      ],
      styling: [
        "Never brush dry curls",
        "Scrunch out excess water with microfiber towel",
        "Use gel for hold and scrunch out crunch when dry"
      ]
    }
  },
  coily: {
    title: "Coily Hair Routine",
    advice: "Your beautiful coils need extra love and moisture! Focus on hydration and gentle handling to maintain healthy hair.",
    routine: {
      daily: [
        "Refresh with water and leave-in conditioner",
        "Seal with natural oils like jojoba or argan",
        "Use protective styles to retain moisture"
      ],
      weekly: [
        "Shampoo once a week with sulfate-free cleanser",
        "Deep condition for 20-30 minutes",
        "Pre-poo with oils before washing"
      ],
      styling: [
        "Detangle only when soaking wet with conditioner",
        "Use the LOC method (Leave-in, Oil, Cream)",
        "Sleep with silk scarf or bonnet"
      ]
    }
  }
}

// Reminder storage
let activeReminders = JSON.parse(localStorage.getItem('hairReminders') || '[]')

// Quiz functionality
function initializeQuiz() {
  const quizOptions = document.querySelectorAll('.quiz-option')
  const quizResult = document.getElementById('quiz-result')
  const resultText = document.getElementById('result-text')
  const routineSchedule = document.getElementById('routine-schedule')
  const restartButton = document.getElementById('restart-quiz')
  const setReminderBtn = document.getElementById('set-reminder')
  const reminderTime = document.getElementById('reminder-time')

  quizOptions.forEach(option => {
    option.addEventListener('click', () => {
      const hairType = option.getAttribute('data-type')
      showResult(hairType)
    })
  })

  restartButton.addEventListener('click', () => {
    quizResult.style.display = 'none'
    document.getElementById('quiz-container').style.display = 'block'
  })

  setReminderBtn.addEventListener('click', () => {
    const time = reminderTime.value
    if (time) {
      setReminder(time)
    }
  })

  function showResult(hairType) {
    const routine = hairRoutines[hairType]
    
    resultText.innerHTML = `
      <h4>${routine.title}</h4>
      <p>${routine.advice}</p>
    `
    
    routineSchedule.innerHTML = `
      <div class="routine-tabs">
        <button class="routine-tab active" data-tab="daily">Daily</button>
        <button class="routine-tab" data-tab="weekly">Weekly</button>
        <button class="routine-tab" data-tab="styling">Styling</button>
      </div>
      <div class="routine-content">
        <div class="routine-list active" id="daily-routine">
          ${routine.routine.daily.map(step => `<div class="routine-step">${step}</div>`).join('')}
        </div>
        <div class="routine-list" id="weekly-routine">
          ${routine.routine.weekly.map(step => `<div class="routine-step">${step}</div>`).join('')}
        </div>
        <div class="routine-list" id="styling-routine">
          ${routine.routine.styling.map(step => `<div class="routine-step">${step}</div>`).join('')}
        </div>
      </div>
    `
    
    // Initialize routine tabs
    initializeRoutineTabs()
    
    document.getElementById('quiz-container').style.display = 'none'
    quizResult.style.display = 'block'
    
    // Update active reminders display
    updateRemindersDisplay()
    
    // Trigger confetti animation
    createConfetti()
  }
}

// Routine tabs functionality
function initializeRoutineTabs() {
  const tabs = document.querySelectorAll('.routine-tab')
  const routineLists = document.querySelectorAll('.routine-list')
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and lists
      tabs.forEach(t => t.classList.remove('active'))
      routineLists.forEach(list => list.classList.remove('active'))
      
      // Add active class to clicked tab
      tab.classList.add('active')
      
      // Show corresponding routine list
      const tabType = tab.getAttribute('data-tab')
      document.getElementById(`${tabType}-routine`).classList.add('active')
    })
  })
}

// Reminder functionality
function setReminder(time) {
  const reminder = {
    id: Date.now(),
    time: time,
    message: "Time for your hair care routine!",
    created: new Date().toLocaleDateString()
  }
  
  activeReminders.push(reminder)
  localStorage.setItem('hairReminders', JSON.stringify(activeReminders))
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  updateRemindersDisplay()
  scheduleNotification(reminder)
}

function scheduleNotification(reminder) {
  const now = new Date()
  const [hours, minutes] = reminder.time.split(':')
  const reminderTime = new Date()
  reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  
  // If the time has passed today, schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1)
  }
  
  const timeUntilReminder = reminderTime.getTime() - now.getTime()
  
  setTimeout(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hair Care Reminder', {
        body: reminder.message,
        icon: '/vite.svg'
      })
    }
    
    // Schedule for next day
    setTimeout(() => scheduleNotification(reminder), 24 * 60 * 60 * 1000)
  }, timeUntilReminder)
}

function removeReminder(id) {
  activeReminders = activeReminders.filter(reminder => reminder.id !== id)
  localStorage.setItem('hairReminders', JSON.stringify(activeReminders))
  updateRemindersDisplay()
}

function updateRemindersDisplay() {
  const remindersContainer = document.getElementById('active-reminders')
  
  if (activeReminders.length === 0) {
    remindersContainer.innerHTML = '<p class="no-reminders">No active reminders</p>'
    return
  }
  
  remindersContainer.innerHTML = `
    <h5>Active Reminders:</h5>
    <div class="reminders-list">
      ${activeReminders.map(reminder => `
        <div class="reminder-item">
          <span class="reminder-time">${reminder.time}</span>
          <span class="reminder-message">${reminder.message}</span>
          <button class="remove-reminder" onclick="removeReminder(${reminder.id})">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('')}
    </div>
  `
}

// Make removeReminder globally accessible
window.removeReminder = removeReminder

// Confetti animation
function createConfetti() {
  const confettiContainer = document.getElementById('confetti-container')
  confettiContainer.innerHTML = ''
  
  const colors = ['#F8BBD9', '#A8E6CF', '#B4A7D6', '#AED6F1', '#FFD3A5']
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.left = Math.random() * 100 + '%'
    confetti.style.animationDelay = Math.random() * 2 + 's'
    confetti.style.animationDuration = (Math.random() * 2 + 3) + 's'
    confettiContainer.appendChild(confetti)
  }
  
  // Remove confetti after animation
  setTimeout(() => {
    confettiContainer.innerHTML = ''
  }, 5000)
}

// Suggestion cards interactions
function initializeSuggestions() {
  const suggestionCards = document.querySelectorAll('.suggestion-card')
  
  suggestionCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)'
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)'
    })
    
    // Add click interaction for mobile
    card.addEventListener('click', () => {
      card.classList.toggle('active')
    })
  })
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeQuiz()
  initializeSuggestions()
  
  // Schedule existing reminders
  activeReminders.forEach(reminder => {
    scheduleNotification(reminder)
  })
})

// Initialize immediately since we're using innerHTML
setTimeout(() => {
  initializeQuiz()
  initializeSuggestions()
  
  // Schedule existing reminders
  activeReminders.forEach(reminder => {
    scheduleNotification(reminder)
  })
}, 100)