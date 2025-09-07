// Mood Journal JavaScript
class MoodJournal {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        this.affirmations = localStorage.getItem('affirmations') || '';
        this.personalAffirmations = JSON.parse(localStorage.getItem('personalAffirmations')) || [];
        this.savedAffirmations = JSON.parse(localStorage.getItem('savedAffirmations')) || [];
        this.currentQuoteIndex = 0;
        
        this.quotes = [
            { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
            { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", author: "Brian Tracy" },
            { text: "Be kind to yourself. You're doing the best you can.", author: "Anonymous" },
            { text: "Your mental health is just as important as your physical health.", author: "Anonymous" },
            { text: "Progress, not perfection.", author: "Anonymous" },
            { text: "It's okay to rest. It's okay to feel. It's okay to be human.", author: "Anonymous" },
            { text: "You are worthy of love and belonging.", author: "Brené Brown" }
        ];

        this.generatedAffirmations = [
            "I am worthy of love, happiness, and all the beautiful things life has to offer.",
            "Every day, I am growing stronger, wiser, and more confident in who I am.",
            "I trust in my ability to navigate through challenges with grace and resilience.",
            "My thoughts are powerful, and I choose to focus on positivity and growth.",
            "I am deserving of rest, peace, and moments of pure joy.",
            "I embrace my uniqueness and celebrate what makes me special.",
            "Today, I choose to be kind to myself and honor my journey.",
            "I am capable of creating positive change in my life and the lives of others.",
            "My heart is open to receiving love, abundance, and beautiful experiences.",
            "I release what no longer serves me and welcome new opportunities with open arms.",
            "I am enough, exactly as I am, and I am constantly evolving into my best self.",
            "My inner strength guides me through every challenge I face.",
            "I choose to see beauty in the ordinary moments of my day.",
            "I am grateful for my body, my mind, and my spirit - they carry me through life.",
            "Today, I give myself permission to feel all my emotions without judgment.",
            "I trust the timing of my life and know that everything unfolds as it should.",
            "My dreams are valid, and I have the power to make them reality.",
            "I radiate love, kindness, and positive energy wherever I go.",
            "I am learning to love myself more deeply with each passing day.",
            "My potential is limitless, and I embrace all the possibilities ahead of me."
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setCurrentDate();
        this.displayDailyAffirmation();
        this.loadDashboard();
        this.loadSelfCare();
        this.loadTheme();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Mood form
        const moodForm = document.getElementById('moodForm');
        moodForm.addEventListener('submit', (e) => this.saveMoodEntry(e));

        // Mood selector
        document.querySelectorAll('.mood-emoji').forEach(emoji => {
            emoji.addEventListener('click', (e) => this.selectMood(e.target));
        });

        // Range sliders
        const energySlider = document.getElementById('energyLevel');
        const stressSlider = document.getElementById('stressLevel');
        
        energySlider.addEventListener('input', (e) => {
            document.getElementById('energyValue').textContent = e.target.value;
        });
        
        stressSlider.addEventListener('input', (e) => {
            document.getElementById('stressValue').textContent = e.target.value;
        });

        // Self-care buttons
        document.getElementById('newQuoteBtn').addEventListener('click', () => this.generateNewQuote());
        document.getElementById('saveAffirmations').addEventListener('click', () => this.saveAffirmations());

        // Daily affirmation button
        document.getElementById('newAffirmationBtn').addEventListener('click', () => this.generateNewDailyAffirmation());

        // Personal affirmation button
        document.getElementById('addPersonalAffirmation').addEventListener('click', () => this.addPersonalAffirmation());

        // Modal close button
        document.getElementById('closeModal').addEventListener('click', () => this.closeAffirmationModal());

        // Theme toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleTheme());

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => this.exportEntries());
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('entryDate').value = today;
    }

    selectMood(selectedEmoji) {
        // Remove previous selection
        document.querySelectorAll('.mood-emoji').forEach(emoji => {
            emoji.classList.remove('selected');
        });
        
        // Add selection to clicked emoji
        selectedEmoji.classList.add('selected');
        
        // Set the hidden input value
        document.getElementById('moodRating').value = selectedEmoji.dataset.mood;
    }

    saveMoodEntry(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const emotions = [];
        
        // Get selected emotions
        document.querySelectorAll('input[name="emotions"]:checked').forEach(checkbox => {
            emotions.push(checkbox.value);
        });
        
        const entry = {
            id: Date.now(),
            date: formData.get('date'),
            mood: parseInt(formData.get('mood')),
            emotions: emotions,
            energy: parseInt(formData.get('energy')),
            stress: parseInt(formData.get('stress')),
            reflection: formData.get('reflection'),
            gratitude: formData.get('gratitude'),
            timestamp: new Date().toISOString()
        };

        // Check if entry for this date already exists
        const existingIndex = this.entries.findIndex(e => e.date === entry.date);
        
        if (existingIndex !== -1) {
            this.entries[existingIndex] = entry;
            this.showNotification('Entry updated successfully! 💖', 'success');
        } else {
            this.entries.push(entry);
            this.showNotification('Entry saved successfully! ✨', 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('moodEntries', JSON.stringify(this.entries));
        
        // Show affirmation modal after saving
        this.showAffirmationModal();
        
        // Refresh dashboard
        this.loadDashboard();
        
        // Reset form
        e.target.reset();
        document.querySelectorAll('.mood-emoji').forEach(emoji => {
            emoji.classList.remove('selected');
        });
        document.getElementById('energyValue').textContent = '5';
        document.getElementById('stressValue').textContent = '5';
        this.setCurrentDate();
    }

    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update content sections
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        // Load content if needed
        if (tabName === 'dashboard') {
            this.loadDashboard();
        } else if (tabName === 'affirmations') {
            this.loadAffirmationsWall();
        } else if (tabName === 'selfcare') {
            this.loadSelfCare();
        }
    }

    loadDashboard() {
        this.renderMoodCalendar();
        this.renderMoodChart();
        this.renderEmotionsList();
        this.renderRecentEntries();
    }

    renderMoodCalendar() {
        const calendar = document.getElementById('moodCalendar');
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Clear calendar
        calendar.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('calendar-day', 'header');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.color = 'var(--primary-sage)';
            calendar.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day');
            calendar.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            
            // Check if there's an entry for this day
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = this.entries.find(e => e.date === dateStr);
            
            if (entry) {
                dayElement.classList.add('has-entry', `mood-${entry.mood}`);
                dayElement.title = `Mood: ${this.getMoodText(entry.mood)}`;
            }
            
            calendar.appendChild(dayElement);
        }
    }

    renderMoodChart() {
        const canvas = document.getElementById('moodChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.entries.length === 0) {
            ctx.fillStyle = 'var(--text-light)';
            ctx.font = '16px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText('No entries yet', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Get last 7 days of entries
        const last7Days = this.getLast7Days();
        const chartData = last7Days.map(date => {
            const entry = this.entries.find(e => e.date === date);
            return entry ? entry.mood : 0;
        });
        
        // Chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // Draw axes
        ctx.strokeStyle = 'var(--border-color)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Draw mood line
        if (chartData.some(d => d > 0)) {
            ctx.strokeStyle = 'var(--primary-sage)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            let firstPoint = true;
            chartData.forEach((mood, index) => {
                if (mood > 0) {
                    const x = padding + (index * chartWidth) / (chartData.length - 1);
                    const y = canvas.height - padding - ((mood - 1) * chartHeight) / 4;
                    
                    if (firstPoint) {
                        ctx.moveTo(x, y);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(x, y);
                    }
                    
                    // Draw point
                    ctx.fillStyle = 'var(--primary-lavender)';
                    ctx.beginPath();
                    ctx.arc(x, y, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.stroke();
        }
        
        // Draw labels
        ctx.fillStyle = 'var(--text-light)';
        ctx.font = '12px Poppins';
        ctx.textAlign = 'center';
        
        last7Days.forEach((date, index) => {
            const x = padding + (index * chartWidth) / (chartData.length - 1);
            const shortDate = new Date(date).toLocaleDateString('en', { weekday: 'short' });
            ctx.fillText(shortDate, x, canvas.height - 10);
        });
    }

    renderEmotionsList() {
        const emotionsList = document.getElementById('emotionsList');
        const emotionCounts = {};
        
        // Count emotions
        this.entries.forEach(entry => {
            entry.emotions.forEach(emotion => {
                emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
            });
        });
        
        // Clear and populate
        emotionsList.innerHTML = '';
        
        if (Object.keys(emotionCounts).length === 0) {
            emotionsList.innerHTML = '<p style="color: var(--text-light);">No emotions tracked yet</p>';
            return;
        }
        
        // Sort by count and display
        Object.entries(emotionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .forEach(([emotion, count]) => {
                const bubble = document.createElement('div');
                bubble.classList.add('emotion-bubble');
                bubble.innerHTML = `
                    ${this.getEmotionEmoji(emotion)} ${emotion}
                    <span class="emotion-count">${count}</span>
                `;
                emotionsList.appendChild(bubble);
            });
    }

    renderRecentEntries() {
        const recentEntries = document.getElementById('recentEntries');
        const recent = this.entries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        recentEntries.innerHTML = '';
        
        if (recent.length === 0) {
            recentEntries.innerHTML = '<p style="color: var(--text-light);">No entries yet</p>';
            return;
        }
        
        recent.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('recent-entry');
            entryDiv.innerHTML = `
                <div class="entry-date">${new Date(entry.date).toLocaleDateString('en', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</div>
                <div class="entry-preview">
                    Mood: ${this.getMoodText(entry.mood)} | 
                    ${entry.reflection ? entry.reflection.substring(0, 100) + '...' : 'No reflection'}
                </div>
            `;
            recentEntries.appendChild(entryDiv);
        });
    }

    loadSelfCare() {
        this.displayDailyQuote();
        this.loadAffirmations();
    }

    displayDailyAffirmation() {
        const affirmationText = document.getElementById('dailyAffirmationText');
        const randomAffirmation = this.generatedAffirmations[Math.floor(Math.random() * this.generatedAffirmations.length)];
        affirmationText.textContent = randomAffirmation;
    }

    generateNewDailyAffirmation() {
        this.displayDailyAffirmation();
        
        // Add a gentle animation
        const affirmationText = document.getElementById('dailyAffirmationText');
        affirmationText.style.opacity = '0';
        setTimeout(() => {
            affirmationText.style.opacity = '1';
        }, 200);
    }

    addPersonalAffirmation() {
        const input = document.getElementById('personalAffirmationInput');
        const affirmationText = input.value.trim();
        
        if (!affirmationText) {
            this.showNotification('Please write an affirmation first! ✨', 'error');
            return;
        }
        
        const newAffirmation = {
            id: Date.now(),
            text: affirmationText,
            type: 'personal',
            dateAdded: new Date().toISOString()
        };
        
        this.personalAffirmations.push(newAffirmation);
        localStorage.setItem('personalAffirmations', JSON.stringify(this.personalAffirmations));
        
        input.value = '';
        this.loadAffirmationsWall();
        this.showNotification('Beautiful affirmation added! 💖', 'success');
    }

    loadAffirmationsWall() {
        const cardsContainer = document.getElementById('affirmationCards');
        cardsContainer.innerHTML = '';
        
        // Combine generated and personal affirmations
        const allAffirmations = [
            ...this.savedAffirmations,
            ...this.personalAffirmations
        ];
        
        if (allAffirmations.length === 0) {
            cardsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-light);">
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">✨ Your affirmation wall is waiting for you!</p>
                    <p>Add your first personal affirmation above, or save some from your daily entries.</p>
                </div>
            `;
            return;
        }
        
        allAffirmations
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .forEach(affirmation => {
                const card = document.createElement('div');
                card.classList.add('affirmation-card', affirmation.type);
                card.innerHTML = `
                    <button class="delete-affirmation" onclick="moodJournal.deleteAffirmation('${affirmation.id}', '${affirmation.type}')">×</button>
                    <p class="affirmation-text">${affirmation.text}</p>
                    <span class="affirmation-type ${affirmation.type}">${affirmation.type}</span>
                `;
                cardsContainer.appendChild(card);
            });
    }

    deleteAffirmation(id, type) {
        if (type === 'personal') {
            this.personalAffirmations = this.personalAffirmations.filter(a => a.id != id);
            localStorage.setItem('personalAffirmations', JSON.stringify(this.personalAffirmations));
        } else {
            this.savedAffirmations = this.savedAffirmations.filter(a => a.id != id);
            localStorage.setItem('savedAffirmations', JSON.stringify(this.savedAffirmations));
        }
        
        this.loadAffirmationsWall();
        this.showNotification('Affirmation removed 🗑️', 'success');
    }

    showAffirmationModal() {
        const modal = document.getElementById('affirmationModal');
        const affirmationText = modal.querySelector('.modal-affirmation-text');
        
        // Get a random affirmation
        const randomAffirmation = this.generatedAffirmations[Math.floor(Math.random() * this.generatedAffirmations.length)];
        affirmationText.textContent = randomAffirmation;
        
        // Save this affirmation to the wall
        const savedAffirmation = {
            id: Date.now(),
            text: randomAffirmation,
            type: 'generated',
            dateAdded: new Date().toISOString()
        };
        
        this.savedAffirmations.push(savedAffirmation);
        localStorage.setItem('savedAffirmations', JSON.stringify(this.savedAffirmations));
        
        // Show modal
        modal.classList.add('show');
    }

    closeAffirmationModal() {
        const modal = document.getElementById('affirmationModal');
        modal.classList.remove('show');
    }

    displayDailyQuote() {
        const quoteElement = document.getElementById('dailyQuote');
        const quote = this.quotes[this.currentQuoteIndex];
        
        quoteElement.querySelector('.quote-text').textContent = `"${quote.text}"`;
        quoteElement.querySelector('.quote-author').textContent = `— ${quote.author}`;
    }

    generateNewQuote() {
        this.currentQuoteIndex = Math.floor(Math.random() * this.quotes.length);
        this.displayDailyQuote();
    }

    loadAffirmations() {
        document.getElementById('affirmations').value = this.affirmations;
    }

    saveAffirmations() {
        const affirmations = document.getElementById('affirmations').value;
        this.affirmations = affirmations;
        localStorage.setItem('affirmations', affirmations);
        this.showNotification('Affirmations saved! 💖', 'success');
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button
        const toggleBtn = document.getElementById('darkModeToggle');
        toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const toggleBtn = document.getElementById('darkModeToggle');
        toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    exportEntries() {
        if (this.entries.length === 0) {
            this.showNotification('No entries to export', 'error');
            return;
        }
        
        const exportData = this.entries.map(entry => {
            return `Date: ${entry.date}
Mood: ${this.getMoodText(entry.mood)}
Emotions: ${entry.emotions.join(', ')}
Energy Level: ${entry.energy}/10
Stress Level: ${entry.stress}/10
Reflection: ${entry.reflection || 'No reflection'}
Gratitude: ${entry.gratitude || 'No gratitude note'}
-------------------`;
        }).join('\n\n');
        
        const blob = new Blob([exportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mood-journal-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Entries exported successfully! 📄', 'success');
    }

    // Helper methods
    getLast7Days() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        
        return days;
    }

    getMoodText(mood) {
        const moodTexts = {
            1: 'Very Sad 😢',
            2: 'Sad 😞',
            3: 'Neutral 😐',
            4: 'Happy 😊',
            5: 'Very Happy 😄'
        };
        return moodTexts[mood] || 'Unknown';
    }

    getEmotionEmoji(emotion) {
        const emojiMap = {
            happy: '😊',
            anxious: '😰',
            calm: '😌',
            tired: '😴',
            excited: '🤩',
            grateful: '🙏',
            frustrated: '😤',
            content: '😌'
        };
        return emojiMap[emotion] || '😊';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodJournal = new MoodJournal();
});