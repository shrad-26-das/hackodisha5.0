const nutritionTips = [
    "Add colorful veggies to every meal for natural vitamins 🌈",
    "Drink water infused with cucumber and mint for extra hydration 💧",
    "Start your day with protein to keep energy levels stable ⚡",
    "Snack on nuts and seeds for healthy fats that nourish your skin ✨",
    "Include berries in your meals for antioxidants that make you glow 🫐"
];

// State variables
let currentTipIndex = 0;
let completedFruits = 2;
const maxFruits = 5;

// DOM elements
const currentTipElement = document.getElementById('current-tip');
const progressCountElement = document.getElementById('progress-count');
const addServingBtn = document.getElementById('add-serving-btn');
const fruitEmojis = document.querySelectorAll('.fruit-emoji');

// Initialize the page
function init() {
    updateTipDisplay();
    updateFruitDisplay();
}

// Function to show next nutrition tip
function nextTip() {
    currentTipIndex = (currentTipIndex + 1) % nutritionTips.length;
    updateTipDisplay();
}

// Function to update tip display
function updateTipDisplay() {
    currentTipElement.textContent = nutritionTips[currentTipIndex];
    
    // Add a subtle animation
    currentTipElement.style.opacity = '0';
    setTimeout(() => {
        currentTipElement.style.opacity = '1';
    }, 100);
}

// Function to add a fruit serving
function addFruit() {
    if (completedFruits < maxFruits) {
        completedFruits++;
        updateFruitDisplay();
    }
}

// Function to update fruit display and button state
function updateFruitDisplay() {
    // Update progress counter
    progressCountElement.textContent = completedFruits;
    
    // Update fruit emoji states
    fruitEmojis.forEach((emoji, index) => {
        if (index < completedFruits) {
            emoji.classList.remove('inactive');
            emoji.classList.add('active');
        } else {
            emoji.classList.remove('active');
            emoji.classList.add('inactive');
        }
    });
    
    // Update button state
    if (completedFruits >= maxFruits) {
        addServingBtn.disabled = true;
        addServingBtn.textContent = 'Goal Completed! 🎉';
    } else {
        addServingBtn.disabled = false;
        addServingBtn.textContent = 'Add Serving +';
    }
}

// Add smooth transitions for fruit emojis
function addFruitTransition(index) {
    const emoji = fruitEmojis[index];
    emoji.style.transform = 'scale(1.2)';
    setTimeout(() => {
        emoji.style.transform = 'scale(1)';
    }, 200);
}

// Enhanced addFruit function with animation
function addFruit() {
    if (completedFruits < maxFruits) {
        const currentIndex = completedFruits;
        completedFruits++;
        
        // Animate the newly activated fruit
        addFruitTransition(currentIndex);
        
        // Update display after a short delay for better UX
        setTimeout(() => {
            updateFruitDisplay();
        }, 100);
    }
}

// Add hover effects to meal cards
document.addEventListener('DOMContentLoaded', function() {
    const mealCards = document.querySelectorAll('.meal-card');
    
    mealCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02) translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
    
    // Initialize the page
    init();
});

// Add click sound effect simulation (optional - visual feedback)
function addClickFeedback(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
}

// Enhanced button interactions
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            addClickFeedback(this);
        });
    });
});