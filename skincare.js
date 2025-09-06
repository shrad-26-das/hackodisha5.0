// Global variables
let currentQuestionIndex = 0;
let quizAnswers = {};
let skinType = '';
let undertone = '';
let userProgress = {
    streak: 0,
    routinesCompleted: 0,
    weeklyProgress: 0,
    entries: []
};

// Quiz questions data
const quizQuestions = [
    {
        id: 'skin-feel',
        question: 'How does your skin typically feel after cleansing?',
        options: [
            { value: 'tight', text: 'Tight and dry', type: 'dry' },
            { value: 'comfortable', text: 'Comfortable and balanced', type: 'normal' },
            { value: 'slightly-oily', text: 'Slightly oily in T-zone', type: 'combination' },
            { value: 'very-oily', text: 'Oily all over', type: 'oily' }
        ]
    },
    {
        id: 'pore-size',
        question: 'How would you describe your pore size?',
        options: [
            { value: 'barely-visible', text: 'Barely visible', type: 'dry' },
            { value: 'small', text: 'Small and even', type: 'normal' },
            { value: 'mixed', text: 'Large in T-zone, small elsewhere', type: 'combination' },
            { value: 'large', text: 'Large and noticeable', type: 'oily' }
        ]
    },
    {
        id: 'skin-concerns',
        question: 'What are your main skin concerns?',
        options: [
            { value: 'dryness', text: 'Dryness and flaking', type: 'dry' },
            { value: 'occasional', text: 'Occasional breakouts', type: 'normal' },
            { value: 'mixed-issues', text: 'Oily T-zone, dry cheeks', type: 'combination' },
            { value: 'acne', text: 'Frequent breakouts and shine', type: 'oily' }
        ]
    },
    {
        id: 'makeup-wear',
        question: 'How does makeup wear on your skin?',
        options: [
            { value: 'clings', text: 'Clings to dry patches', type: 'dry' },
            { value: 'stays-put', text: 'Stays put most of the day', type: 'normal' },
            { value: 'slides-tzone', text: 'Slides off in T-zone', type: 'combination' },
            { value: 'slides-all', text: 'Slides off quickly', type: 'oily' }
        ]
    },
    {
        id: 'vein-color',
        question: 'What color are the veins on your wrist?',
        options: [
            { value: 'blue-purple', text: 'Blue or purple', type: 'cool' },
            { value: 'green', text: 'Green', type: 'warm' },
            { value: 'blue-green', text: 'Blue-green mix', type: 'neutral' }
        ]
    },
    {
        id: 'jewelry-preference',
        question: 'Which jewelry looks better on you?',
        options: [
            { value: 'silver', text: 'Silver and white gold', type: 'cool' },
            { value: 'gold', text: 'Gold and brass', type: 'warm' },
            { value: 'both', text: 'Both look equally good', type: 'neutral' }
        ]
    },
    {
        id: 'sun-reaction',
        question: 'How does your skin react to sun exposure?',
        options: [
            { value: 'burns-easily', text: 'Burns easily, tans minimally', type: 'cool' },
            { value: 'tans-easily', text: 'Tans easily, rarely burns', type: 'warm' },
            { value: 'gradual-tan', text: 'Burns first, then tans', type: 'neutral' }
        ]
    },
    {
        id: 'color-preference',
        question: 'Which colors make you look more vibrant?',
        options: [
            { value: 'cool-colors', text: 'Blues, pinks, purples', type: 'cool' },
            { value: 'warm-colors', text: 'Oranges, yellows, reds', type: 'warm' },
            { value: 'neutral-colors', text: 'Whites, grays, beiges', type: 'neutral' }
        ]
    }
];

// Skin type descriptions
const skinTypeDescriptions = {
    dry: {
        title: 'Dry Skin',
        description: 'Your skin produces less natural oils and may feel tight, especially after cleansing. Focus on hydrating and nourishing products.'
    },
    normal: {
        title: 'Normal Skin',
        description: 'Your skin is well-balanced with minimal concerns. Maintain this balance with consistent, gentle care.'
    },
    combination: {
        title: 'Combination Skin',
        description: 'Your T-zone is oilier while cheeks are normal to dry. Use different products for different areas of your face.'
    },
    oily: {
        title: 'Oily Skin',
        description: 'Your skin produces excess sebum, leading to shine and potential breakouts. Focus on oil control and gentle cleansing.'
    }
};

// Undertone descriptions
const undertoneDescriptions = {
    cool: {
        title: 'Cool Undertones',
        description: 'Your undertones have pink, red, or blue hues. Look for products with cool-toned shades and avoid overly warm colors.'
    },
    warm: {
        title: 'Warm Undertones',
        description: 'Your undertones have yellow, gold, or peach hues. Warm-toned products will complement your natural coloring.'
    },
    neutral: {
        title: 'Neutral Undertones',
        description: 'You have a balanced mix of cool and warm undertones. Most colors will work well for you.'
    }
};

// Product recommendations
const productRecommendations = {
    dry: [
        {
            title: 'Hydrating Cleanser',
            description: 'A gentle, cream-based cleanser that won\'t strip your skin\'s natural oils.',
            tags: ['Cleanser', 'Hydrating', 'Gentle'],
            icon: '🧴'
        },
        {
            title: 'Rich Moisturizer',
            description: 'A thick, nourishing moisturizer with ceramides and hyaluronic acid.',
            tags: ['Moisturizer', 'Rich', 'Ceramides'],
            icon: '🫙'
        },
        {
            title: 'Face Oil',
            description: 'A lightweight facial oil to lock in moisture and add glow.',
            tags: ['Face Oil', 'Nourishing', 'Glow'],
            icon: '💧'
        }
    ],
    oily: [
        {
            title: 'Foaming Cleanser',
            description: 'A gel-based cleanser with salicylic acid to control oil and prevent breakouts.',
            tags: ['Cleanser', 'Oil Control', 'Salicylic Acid'],
            icon: '🧼'
        },
        {
            title: 'Oil-Free Moisturizer',
            description: 'A lightweight, non-comedogenic moisturizer that hydrates without clogging pores.',
            tags: ['Moisturizer', 'Oil-Free', 'Lightweight'],
            icon: '🌟'
        },
        {
            title: 'Clay Mask',
            description: 'A weekly clay mask to deep clean pores and absorb excess oil.',
            tags: ['Mask', 'Clay', 'Deep Clean'],
            icon: '🎭'
        }
    ],
    combination: [
        {
            title: 'Gentle Gel Cleanser',
            description: 'A balanced cleanser that works for both oily and dry areas.',
            tags: ['Cleanser', 'Balanced', 'Gentle'],
            icon: '🧴'
        },
        {
            title: 'Dual Moisturizers',
            description: 'Use different moisturizers for your T-zone and cheek areas.',
            tags: ['Moisturizer', 'Targeted', 'Dual Care'],
            icon: '🎯'
        },
        {
            title: 'Balancing Toner',
            description: 'A pH-balancing toner to prep your skin for other products.',
            tags: ['Toner', 'Balancing', 'pH'],
            icon: '⚖️'
        }
    ],
    normal: [
        {
            title: 'Gentle Daily Cleanser',
            description: 'A mild cleanser to maintain your skin\'s natural balance.',
            tags: ['Cleanser', 'Daily', 'Mild'],
            icon: '🧴'
        },
        {
            title: 'Lightweight Moisturizer',
            description: 'A daily moisturizer that hydrates without heaviness.',
            tags: ['Moisturizer', 'Lightweight', 'Daily'],
            icon: '☁️'
        },
        {
            title: 'Vitamin C Serum',
            description: 'An antioxidant serum for prevention and brightening.',
            tags: ['Serum', 'Vitamin C', 'Brightening'],
            icon: '🍊'
        }
    ]
};

// Routine suggestions
const routineSuggestions = {
    dry: {
        morning: ['Gentle Cleanser', 'Hydrating Toner', 'Vitamin C Serum', 'Rich Moisturizer', 'Sunscreen'],
        evening: ['Oil Cleanser', 'Gentle Cleanser', 'Hydrating Toner', 'Retinol (2-3x week)', 'Night Moisturizer', 'Face Oil']
    },
    oily: {
        morning: ['Foaming Cleanser', 'BHA Toner', 'Niacinamide Serum', 'Oil-Free Moisturizer', 'Sunscreen'],
        evening: ['Micellar Water', 'Foaming Cleanser', 'BHA Toner', 'Retinol (2-3x week)', 'Lightweight Moisturizer']
    },
    combination: {
        morning: ['Gentle Cleanser', 'Balancing Toner', 'Targeted Serums', 'Dual Moisturizers', 'Sunscreen'],
        evening: ['Cleansing Oil', 'Gentle Cleanser', 'Balancing Toner', 'Treatment Products', 'Targeted Moisturizers']
    },
    normal: {
        morning: ['Gentle Cleanser', 'Vitamin C Serum', 'Lightweight Moisturizer', 'Sunscreen'],
        evening: ['Gentle Cleanser', 'Toner', 'Retinol (2-3x week)', 'Night Moisturizer']
    }
};

// Expert tips
const expertTips = [
    {
        title: 'Always Patch Test',
        content: 'Before trying any new product, test it on a small area of skin (like behind your ear) and wait 24-48 hours to check for reactions.',
        icon: '🧪'
    },
    {
        title: 'Less is More',
        content: 'Start with a simple routine and gradually introduce new products. Your skin needs time to adjust to new ingredients.',
        icon: '✨'
    },
    {
        title: 'Sunscreen is Essential',
        content: 'Use SPF 30 or higher every day, even indoors. UV protection is the most important step in preventing aging and damage.',
        icon: '☀️'
    },
    {
        title: 'Consistency Matters',
        content: 'Results take time. Stick to your routine for at least 6-8 weeks before expecting significant changes.',
        icon: '📅'
    },
    {
        title: 'Listen to Your Skin',
        content: 'Pay attention to how your skin reacts to products and weather changes. Adjust your routine seasonally if needed.',
        icon: '👂'
    },
    {
        title: 'Clean Your Tools',
        content: 'Wash makeup brushes, beauty sponges, and pillowcases regularly to prevent bacterial buildup that can cause breakouts.',
        icon: '🧽'
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    setupNavigation();
    setupQuiz();
    loadUserProgress();
    setupTracker();
    setupSuggestions();
    
    // Load progress chart
    setTimeout(() => {
        drawProgressChart();
    }, 100);
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            navigateToSection(targetId);
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Navigate to section
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Quiz functionality
function setupQuiz() {
    displayQuestion();
}

function displayQuestion() {
    const quizContent = document.getElementById('quiz-content');
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    if (!currentQuestion) return;

    const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress').style.width = `${progressPercentage}%`;
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = quizQuestions.length;

    quizContent.innerHTML = `
        <div class="quiz-question">
            <h3 class="question-title">${currentQuestion.question}</h3>
            <div class="quiz-options">
                ${currentQuestion.options.map(option => `
                    <div class="quiz-option" onclick="selectOption('${option.value}', '${option.type}', this)">
                        <div class="option-text">${option.text}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Update navigation buttons
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').disabled = true;
}

function selectOption(value, type, element) {
    // Remove previous selection
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => option.classList.remove('selected'));
    
    // Add selection to clicked option
    element.classList.add('selected');
    
    // Store answer
    const currentQuestion = quizQuestions[currentQuestionIndex];
    quizAnswers[currentQuestion.id] = { value, type };
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        calculateResults();
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        
        // Restore previous selection if exists
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const previousAnswer = quizAnswers[currentQuestion.id];
        if (previousAnswer) {
            const options = document.querySelectorAll('.quiz-option');
            options.forEach(option => {
                if (option.querySelector('.option-text').textContent.includes(previousAnswer.value.replace('-', ' '))) {
                    option.classList.add('selected');
                }
            });
            document.getElementById('next-btn').disabled = false;
        }
    }
}

function calculateResults() {
    // Calculate skin type
    const skinTypeScores = { dry: 0, normal: 0, combination: 0, oily: 0 };
    const undertoneScores = { cool: 0, warm: 0, neutral: 0 };
    
    Object.values(quizAnswers).forEach(answer => {
        if (skinTypeScores.hasOwnProperty(answer.type)) {
            skinTypeScores[answer.type]++;
        }
        if (undertoneScores.hasOwnProperty(answer.type)) {
            undertoneScores[answer.type]++;
        }
    });
    
    // Get highest scoring skin type and undertone
    skinType = Object.keys(skinTypeScores).reduce((a, b) => 
        skinTypeScores[a] > skinTypeScores[b] ? a : b
    );
    undertone = Object.keys(undertoneScores).reduce((a, b) => 
        undertoneScores[a] > undertoneScores[b] ? a : b
    );
    
    // Store results in localStorage
    localStorage.setItem('skinType', skinType);
    localStorage.setItem('undertone', undertone);
}

function showResults() {
    document.getElementById('quiz-content').style.display = 'none';
    document.querySelector('.quiz-navigation').style.display = 'none';
    
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.style.display = 'block';
    
    document.getElementById('skin-type-result').textContent = skinTypeDescriptions[skinType].title;
    document.getElementById('skin-type-description').textContent = skinTypeDescriptions[skinType].description;
    document.getElementById('undertone-result').textContent = undertoneDescriptions[undertone].title;
    document.getElementById('undertone-description').textContent = undertoneDescriptions[undertone].description;
}

// Tracker functionality
function setupTracker() {
    loadUserProgress();
    updateStatsDisplay();
    displayRecentEntries();
    
    // Add event listeners for routine checkboxes
    const checkboxes = document.querySelectorAll('.step-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateRoutineProgress);
    });
}

function loadUserProgress() {
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    }
    
    // Initialize with sample data if empty
    if (userProgress.entries.length === 0) {
        userProgress.entries = [
            { date: '2025-01-15', routine: 'Morning', completion: '100%' },
            { date: '2025-01-14', routine: 'Evening', completion: '80%' },
            { date: '2025-01-14', routine: 'Morning', completion: '100%' },
            { date: '2025-01-13', routine: 'Evening', completion: '90%' },
            { date: '2025-01-13', routine: 'Morning', completion: '100%' }
        ];
        userProgress.streak = 3;
        userProgress.routinesCompleted = 42;
        userProgress.weeklyProgress = 85;
        saveUserProgress();
    }
}

function saveUserProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

function updateStatsDisplay() {
    document.getElementById('streak-count').textContent = userProgress.streak;
    document.getElementById('routines-completed').textContent = userProgress.routinesCompleted;
    document.getElementById('progress-percentage').textContent = userProgress.weeklyProgress + '%';
}

function switchRoutineTab(tabName) {
    const tabs = document.querySelectorAll('.routine-tab');
    const contents = document.querySelectorAll('.routine-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.style.display = 'none');
    
    document.querySelector(`[onclick="switchRoutineTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-routine`).style.display = 'block';
}

function updateRoutineProgress() {
    const activeTab = document.querySelector('.routine-tab.active').textContent.toLowerCase();
    const checkboxes = document.querySelectorAll(`#${activeTab}-routine .step-checkbox`);
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const completion = Math.round((checkedCount / checkboxes.length) * 100);
    
    // Update progress display (you could add a progress indicator here)
    console.log(`${activeTab} routine: ${completion}% complete`);
}

function saveRoutine() {
    const activeTab = document.querySelector('.routine-tab.active').textContent;
    const checkboxes = document.querySelectorAll(`#${activeTab.toLowerCase()}-routine .step-checkbox`);
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const completion = Math.round((checkedCount / checkboxes.length) * 100);
    
    // Add new entry
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
        date: today,
        routine: activeTab,
        completion: completion + '%'
    };
    
    // Remove existing entry for same date and routine
    userProgress.entries = userProgress.entries.filter(entry => 
        !(entry.date === today && entry.routine === activeTab)
    );
    
    // Add new entry at beginning
    userProgress.entries.unshift(newEntry);
    
    // Keep only last 10 entries
    userProgress.entries = userProgress.entries.slice(0, 10);
    
    // Update stats
    userProgress.routinesCompleted++;
    if (completion === 100) {
        userProgress.streak++;
    }
    
    // Recalculate weekly progress
    const weekEntries = userProgress.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate >= weekAgo;
    });
    
    const averageCompletion = weekEntries.reduce((sum, entry) => {
        return sum + parseInt(entry.completion);
    }, 0) / weekEntries.length;
    
    userProgress.weeklyProgress = Math.round(averageCompletion) || 0;
    
    saveUserProgress();
    updateStatsDisplay();
    displayRecentEntries();
    drawProgressChart();
    
    showToast('Routine saved successfully! 🎉');
    
    // Clear checkboxes
    checkboxes.forEach(cb => cb.checked = false);
}

function displayRecentEntries() {
    const entriesList = document.getElementById('entries-list');
    
    if (userProgress.entries.length === 0) {
        entriesList.innerHTML = '<p style="text-align: center; color: #6b7280;">No entries yet. Start logging your routines!</p>';
        return;
    }
    
    entriesList.innerHTML = userProgress.entries.map(entry => `
        <div class="entry-item">
            <div>
                <div class="entry-date">${formatDate(entry.date)}</div>
                <div class="entry-routine">${entry.routine} Routine</div>
            </div>
            <div class="entry-completion">${entry.completion}</div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function drawProgressChart() {
    const canvas = document.getElementById('progress-chart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sample data for the last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const completionData = [85, 92, 78, 95, 88, 90, 85]; // Sample data
    
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw data line
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const stepX = chartWidth / (days.length - 1);
    
    completionData.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = canvas.height - padding - (value / 100) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#ff69b4';
    completionData.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = canvas.height - padding - (value / 100) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    days.forEach((day, index) => {
        const x = padding + index * stepX;
        ctx.fillText(day, x, canvas.height - padding + 20);
    });
    
    // Draw Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const value = i * 25;
        const y = canvas.height - padding - (i / 4) * chartHeight;
        ctx.fillText(value + '%', padding - 10, y + 4);
    }
}

// Suggestions functionality
function setupSuggestions() {
    // Load skin type from localStorage or use default
    const savedSkinType = localStorage.getItem('skinType') || 'normal';
    displayProductSuggestions(savedSkinType);
    displayRoutineSuggestions(savedSkinType);
    displayTips();
}

function showSuggestionCategory(category) {
    const categories = document.querySelectorAll('.suggestion-category');
    const buttons = document.querySelectorAll('.category-btn');
    
    categories.forEach(cat => cat.style.display = 'none');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${category}-suggestions`).style.display = 'block';
    event.target.classList.add('active');
}

function displayProductSuggestions(skinType) {
    const productsGrid = document.getElementById('products-grid');
    const products = productRecommendations[skinType] || productRecommendations.normal;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="suggestion-card">
            <div class="card-header">
                <div class="card-icon">${product.icon}</div>
                <h3 class="card-title">${product.title}</h3>
            </div>
            <p class="card-description">${product.description}</p>
            <div class="card-tags">
                ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function displayRoutineSuggestions(skinType) {
    const routinesList = document.getElementById('routine-suggestions-list');
    const routines = routineSuggestions[skinType] || routineSuggestions.normal;
    
    routinesList.innerHTML = `
        <div class="routine-suggestion">
            <h3 class="routine-title">Morning Routine</h3>
            <ol class="routine-steps-list">
                ${routines.morning.map((step, index) => `
                    <li>
                        <span class="step-number">${index + 1}</span>
                        <span>${step}</span>
                    </li>
                `).join('')}
            </ol>
        </div>
        <div class="routine-suggestion">
            <h3 class="routine-title">Evening Routine</h3>
            <ol class="routine-steps-list">
                ${routines.evening.map((step, index) => `
                    <li>
                        <span class="step-number">${index + 1}</span>
                        <span>${step}</span>
                    </li>
                `).join('')}
            </ol>
        </div>
    `;
}

function displayTips() {
    const tipsGrid = document.getElementById('tips-grid');
    
    tipsGrid.innerHTML = expertTips.map(tip => `
        <div class="tip-card">
            <div class="tip-icon">${tip.icon}</div>
            <h3 class="tip-title">${tip.title}</h3>
            <p class="tip-content">${tip.content}</p>
        </div>
    `).join('');
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.suggestion-card, .stat-card, .tip-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});