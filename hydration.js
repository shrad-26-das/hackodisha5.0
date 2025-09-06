class HydrationTracker {
    constructor() {
        this.dailyGoal = 3000; // 3 liters in ml
        this.currentIntake = 0;
        this.currentDate = new Date().toDateString();
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();

        // Water facts array
        this.waterFacts = [
            "Did you know that drinking water can boost your mood and energy levels? Stay hydrated, stay happy! 😊",
            "Your body is about 60% water! Staying hydrated helps every cell function properly. 💪",
            "Drinking water before meals can help with digestion and portion control. Smart hydration! 🍽",
            "Even mild dehydration can affect your concentration and memory. Keep that brain hydrated! 🧠",
            "Cold water can boost your metabolism temporarily as your body works to warm it up. Cool fact! ❄",
            "Your kidneys filter about 50 gallons of blood daily with the help of water. Give them support! 🫘",
            "Proper hydration helps maintain healthy, glowing skin from the inside out. Natural beauty! ✨",
            "Athletes can lose up to 3 liters of water per hour during intense exercise. Hydrate to perform! 🏃‍♂",
            "Drinking water first thing in the morning jumpstarts your metabolism and rehydrates your body. Rise and hydrate! 🌅",
            "Your muscles are about 76% water. Stay hydrated for better strength and endurance! 💪",
            "Headaches are often a sign of dehydration. Try drinking water before reaching for pain relief! 🤕",
            "Water helps regulate body temperature through sweating and respiration. Natural cooling system! 🌡",
            "Proper hydration can improve joint lubrication and reduce stiffness. Keep moving smoothly! 🦴",
            "Your blood is about 90% water. Hydration keeps your circulation flowing perfectly! ❤",
            "Drinking enough water can help prevent kidney stones and urinary tract infections. Protective hydration! 🛡"
        ];

        this.currentFactIndex = 0;

        this.initializeElements();
        this.loadData();
        this.updateDisplay();
        this.bindEvents();
        this.updateDate();
        this.updateCalendar();
        this.showRandomFact();
    }

    initializeElements() {
        // Main elements
        this.waterFillElement = document.getElementById('water-fill');
        this.currentAmountElement = document.getElementById('current-amount');
        this.percentageElement = document.getElementById('percentage');
        this.progressBarFillElement = document.getElementById('progress-bar-fill');
        this.currentDateElement = document.getElementById('current-date');
        this.factTextElement = document.getElementById('fact-text');
        this.calendarGridElement = document.getElementById('calendar-grid');
        this.currentMonthElement = document.getElementById('current-month');

        // Buttons
        this.quickButtons = document.querySelectorAll('.quick-btn[data-amount]');
        this.customButton = document.getElementById('custom-btn');
        this.newFactButton = document.getElementById('new-fact-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.prevMonthButton = document.getElementById('prev-month');
        this.nextMonthButton = document.getElementById('next-month');

        // Modals
        this.customModal = document.getElementById('custom-modal');
        this.achievementModal = document.getElementById('achievement-modal');
        this.customInput = document.getElementById('custom-input');
        this.addCustomButton = document.getElementById('add-custom-btn');
        this.cancelButton = document.getElementById('cancel-btn');
        this.celebrateButton = document.getElementById('celebrate-btn');
    }

    bindEvents() {
        // Quick add buttons
        this.quickButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const amount = parseInt(e.currentTarget.dataset.amount);
                this.addWater(amount);
            });
        });

        // Custom amount button
        this.customButton.addEventListener('click', () => this.showCustomModal());

        // Custom modal events
        this.addCustomButton.addEventListener('click', () => this.addCustomAmount());
        this.cancelButton.addEventListener('click', () => this.hideCustomModal());
        this.customInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addCustomAmount();
        });

        // Achievement modal
        this.celebrateButton.addEventListener('click', () => this.hideAchievementModal());

        // New fact button
        this.newFactButton.addEventListener('click', () => this.showRandomFact());

        // Reset button
        this.resetButton.addEventListener('click', () => this.resetDay());

        // Month navigation
        this.prevMonthButton.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthButton.addEventListener('click', () => this.changeMonth(1));

        // Modal outside click
        this.customModal.addEventListener('click', (e) => {
            if (e.target === this.customModal) this.hideCustomModal();
        });

        this.achievementModal.addEventListener('click', (e) => {
            if (e.target === this.achievementModal) this.hideAchievementModal();
        });
    }

    loadData() {
        const todayData = localStorage.getItem(`hydration_${this.currentDate}`);
        if (todayData) {
            this.currentIntake = parseInt(todayData);
        } else {
            this.currentIntake = 0;
        }

        const factIndex = localStorage.getItem('current_fact_index');
        if (factIndex) {
            this.currentFactIndex = parseInt(factIndex);
        }
    }

    saveData() {
        localStorage.setItem(`hydration_${this.currentDate}`, this.currentIntake.toString());
        localStorage.setItem('current_fact_index', this.currentFactIndex.toString());
    }

    addWater(amount) {
        const previousIntake = this.currentIntake;
        this.currentIntake += amount;

        const button = document.querySelector(`[data-amount="${amount}"]`);
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }

        this.updateDisplay();
        this.saveData();

        if (previousIntake < this.dailyGoal && this.currentIntake >= this.dailyGoal) {
            setTimeout(() => this.showAchievementModal(), 1000);
        }

        setTimeout(() => this.updateCalendar(), 500);
    }

    updateDisplay() {
        const percentage = Math.min((this.currentIntake / this.dailyGoal) * 100, 100);

        this.animateNumber(this.currentAmountElement, parseInt(this.currentAmountElement.textContent), this.currentIntake);
        this.animateNumber(this.percentageElement, parseInt(this.percentageElement.textContent.replace('%', '')), Math.round(percentage), '%');

        this.waterFillElement.style.height = `${percentage}%`;
        this.progressBarFillElement.style.width = `${percentage}%`;

        if (percentage >= 100) {
            this.waterFillElement.style.background = 'linear-gradient(180deg, #28A745, #20C997)';
            this.progressBarFillElement.style.background = 'linear-gradient(90deg, #28A745, #20C997)';
        } else if (percentage >= 75) {
            this.waterFillElement.style.background = 'linear-gradient(180deg, #17A2B8, #20C997)';
            this.progressBarFillElement.style.background = 'linear-gradient(90deg, #17A2B8, #20C997)';
        } else {
            this.waterFillElement.style.background = 'linear-gradient(180deg, #87CEEB, #4682B4)';
            this.progressBarFillElement.style.background = 'linear-gradient(90deg, var(--mint-green), var(--baby-blue))';
        }
    }

    animateNumber(element, from, to, suffix = '') {
        const duration = 800;
        const start = Date.now();
        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);
            const current = from + (to - from) * this.easeOutCubic(progress);
            element.textContent = Math.round(current) + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    showCustomModal() {
        this.customModal.classList.add('show');
        this.customInput.focus();
        this.customInput.value = '';
    }

    hideCustomModal() {
        this.customModal.classList.remove('show');
    }

    addCustomAmount() {
        const amount = parseInt(this.customInput.value);
        if (amount && amount > 0 && amount <= 2000) {
            this.addWater(amount);
            this.hideCustomModal();
        } else {
            this.customInput.style.borderColor = '#DC3545';
            setTimeout(() => {
                this.customInput.style.borderColor = '';
            }, 1000);
        }
    }

    showAchievementModal() {
        this.achievementModal.classList.add('show');
        this.createConfetti();
    }

    hideAchievementModal() {
        this.achievementModal.classList.remove('show');
    }

    createConfetti() {
        const colors = ['#A8E6CF', '#B8E0F5', '#D4A5E8', '#FFB3BA', '#FFD1DC'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`;
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    showRandomFact() {
        this.currentFactIndex = Math.floor(Math.random() * this.waterFacts.length);
        this.factTextElement.style.opacity = '0';
        setTimeout(() => {
            this.factTextElement.textContent = this.waterFacts[this.currentFactIndex];
            this.factTextElement.style.opacity = '1';
        }, 200);
        this.saveData();
    }

    resetDay() {
        if (confirm("Are you sure you want to reset today's progress? This action cannot be undone.")) {
            this.currentIntake = 0;
            this.updateDisplay();
            this.saveData();
            this.updateCalendar();
        }
    }

    updateDate() {
        const today = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        this.currentDateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    changeMonth(direction) {
        this.currentMonth += direction;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.updateCalendar();
    }

    updateCalendar() {
        const today = new Date();
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.currentMonthElement.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

        this.calendarGridElement.innerHTML = '';

        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.textContent = day;
            header.style.fontWeight = '600';
            header.style.color = 'var(--dark-gray)';
            header.style.padding = '8px';
            header.style.fontSize = '0.8rem';
            header.style.textAlign = 'center';
            this.calendarGridElement.appendChild(header);
        });

        const currentDate = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();

            const dateString = currentDate.toDateString();
            const intake = localStorage.getItem(`hydration_${dateString}`);
            const intakeAmount = intake ? parseInt(intake) : 0;

            if (intakeAmount === 0) {
                dayElement.classList.add('no-data');
            } else if (intakeAmount < 1000) {
                dayElement.classList.add('low');
            } else if (intakeAmount < 2000) {
                dayElement.classList.add('medium');
            } else if (intakeAmount < 3000) {
                dayElement.classList.add('high');
            } else {
                dayElement.classList.add('goal');
            }

            if (currentDate.getMonth() !== this.currentMonth) {
                dayElement.classList.add('other-month');
            }

            if (dateString === today.toDateString()) {
                dayElement.classList.add('today');
            }

            dayElement.title = `${dateString}: ${intakeAmount}ml`;

            this.calendarGridElement.appendChild(dayElement);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
}

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        from {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    .fact-text {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HydrationTracker();
});

// Add smooth scrolling
document.documentElement.style.scrollBehavior = 'smooth';

// Ripple effect for buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button, .quick-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.position = 'absolute';
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
