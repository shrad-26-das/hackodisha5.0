let beforeImageData = null;
let afterImageData = null;
let sliderValue = 50;
let journalNoteText = '';

// DOM elements
const beforeInput = document.getElementById('beforeInput');
const afterInput = document.getElementById('afterInput');
const beforeImage = document.getElementById('beforeImage');
const afterImage = document.getElementById('afterImage');
const beforePlaceholder = document.getElementById('beforePlaceholder');
const afterPlaceholder = document.getElementById('afterPlaceholder');
const comparisonCard = document.getElementById('comparisonCard');
const beforeCompare = document.getElementById('beforeCompare');
const afterCompare = document.getElementById('afterCompare');
const beforeSection = document.getElementById('beforeSection');
const afterSection = document.getElementById('afterSection');
const sliderLine = document.getElementById('sliderLine');
const comparisonSlider = document.getElementById('comparisonSlider');
const journalNote = document.getElementById('journalNote');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadSavedData();
});

// Set up all event listeners
function setupEventListeners() {
    // File upload listeners
    beforeInput.addEventListener('change', (e) => handleImageUpload(e, 'before'));
    afterInput.addEventListener('change', (e) => handleImageUpload(e, 'after'));
    
    // Comparison slider listener
    comparisonSlider.addEventListener('input', handleSliderChange);
    
    // Journal note listener
    journalNote.addEventListener('input', handleJournalChange);
    
    // Save data on page unload
    window.addEventListener('beforeunload', saveData);
}

// Handle image upload
function handleImageUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const result = e.target.result;
        
        if (type === 'before') {
            beforeImageData = result;
            beforeImage.src = result;
            beforeImage.style.display = 'block';
            beforePlaceholder.style.display = 'none';
        } else {
            afterImageData = result;
            afterImage.src = result;
            afterImage.style.display = 'block';
            afterPlaceholder.style.display = 'none';
        }
        
        updateComparisonView();
        saveData();
    };
    
    reader.onerror = function() {
        alert('Error reading file. Please try again.');
    };
    
    reader.readAsDataURL(file);
}

// Update the comparison view
function updateComparisonView() {
    if (beforeImageData && afterImageData) {
        comparisonCard.style.display = 'block';
        beforeCompare.src = beforeImageData;
        afterCompare.src = afterImageData;
        updateSliderPosition();
        
        // Animate the comparison card appearance
        comparisonCard.style.opacity = '0';
        comparisonCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            comparisonCard.style.opacity = '1';
            comparisonCard.style.transform = 'translateY(0)';
        }, 100);
    } else {
        comparisonCard.style.display = 'none';
    }
}

// Handle slider change
function handleSliderChange(event) {
    sliderValue = parseInt(event.target.value);
    updateSliderPosition();
    saveData();
}

// Update slider position and image sections
function updateSliderPosition() {
    if (!beforeImageData || !afterImageData) return;
    
    const percentage = sliderValue;
    
    // Update section widths
    beforeSection.style.width = percentage + '%';
    afterSection.style.width = (100 - percentage) + '%';
    
    // Update slider line position
    sliderLine.style.left = percentage + '%';
}

// Handle journal note changes
function handleJournalChange(event) {
    journalNoteText = event.target.value;
    saveData();
}

// Save data to localStorage
function saveData() {
    const data = {
        beforeImage: beforeImageData,
        afterImage: afterImageData,
        sliderValue: sliderValue,
        journalNote: journalNoteText,
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('glowJournalData', JSON.stringify(data));
    } catch (error) {
        console.warn('Could not save data to localStorage:', error);
    }
}

// Load saved data from localStorage
function loadSavedData() {
    try {
        const savedData = localStorage.getItem('glowJournalData');
        if (!savedData) return;
        
        const data = JSON.parse(savedData);
        
        // Restore before image
        if (data.beforeImage) {
            beforeImageData = data.beforeImage;
            beforeImage.src = data.beforeImage;
            beforeImage.style.display = 'block';
            beforePlaceholder.style.display = 'none';
        }
        
        // Restore after image
        if (data.afterImage) {
            afterImageData = data.afterImage;
            afterImage.src = data.afterImage;
            afterImage.style.display = 'block';
            afterPlaceholder.style.display = 'none';
        }
        
        // Restore slider value
        if (data.sliderValue !== undefined) {
            sliderValue = data.sliderValue;
            comparisonSlider.value = sliderValue;
        }
        
        // Restore journal note
        if (data.journalNote) {
            journalNoteText = data.journalNote;
            journalNote.value = data.journalNote;
        }
        
        // Update comparison view
        updateComparisonView();
        
    } catch (error) {
        console.warn('Could not load saved data:', error);
    }
}

// Add drag and drop functionality
function setupDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach((area, index) => {
        const type = index === 0 ? 'before' : 'after';
        
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.style.backgroundColor = 'hsl(340, 50%, 95%)';
            area.style.transform = 'scale(1.02)';
        });
        
        area.addEventListener('dragleave', (e) => {
            e.preventDefault();
            area.style.backgroundColor = '';
            area.style.transform = '';
        });
        
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.style.backgroundColor = '';
            area.style.transform = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    // Create a fake event object for handleImageUpload
                    const fakeEvent = {
                        target: {
                            files: [file]
                        }
                    };
                    handleImageUpload(fakeEvent, type);
                }
            }
        });
    });
}

// Add keyboard navigation for milestones
function setupKeyboardNavigation() {
    const milestones = document.querySelectorAll('.milestone');
    
    milestones.forEach((milestone, index) => {
        milestone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                milestone.click();
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (index + 1) % milestones.length;
                milestones[nextIndex].focus();
            }
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (index - 1 + milestones.length) % milestones.length;
                milestones[prevIndex].focus();
            }
        });
    });
}

// Add touch support for mobile devices
function setupTouchSupport() {
    let isDragging = false;
    
    comparisonSlider.addEventListener('touchstart', () => {
        isDragging = true;
    });
    
    comparisonSlider.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    comparisonSlider.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            const rect = comparisonSlider.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(100, 
                ((touch.clientX - rect.left) / rect.width) * 100
            ));
            
            sliderValue = Math.round(percentage);
            comparisonSlider.value = sliderValue;
            updateSliderPosition();
            saveData();
        }
    });
}

// Add progress animation to timeline
function animateTimeline() {
    const circles = document.querySelectorAll('.timeline-circle');
    const connectors = document.querySelectorAll('.timeline-connector');
    
    circles.forEach((circle, index) => {
        setTimeout(() => {
            if (circle.classList.contains('active')) {
                circle.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    circle.style.transform = 'scale(1)';
                }, 200);
            }
        }, index * 300);
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadSavedData();
    setupDragAndDrop();
    setupKeyboardNavigation();
    setupTouchSupport();
    
    // Animate timeline on load
    setTimeout(animateTimeline, 1000);
});

// Add milestone click functionality
document.addEventListener('DOMContentLoaded', function() {
    const milestones = document.querySelectorAll('.milestone');
    
    milestones.forEach(milestone => {
        milestone.addEventListener('click', function() {
            // Toggle active state
            this.classList.toggle('active');
            
            // Add completion animation
            if (this.classList.contains('active')) {
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Add star icon if not present
                if (!this.querySelector('.icon')) {
                    const star = document.createElement('svg');
                    star.className = 'icon';
                    star.setAttribute('viewBox', '0 0 24 24');
                    star.setAttribute('fill', 'currentColor');
                    star.innerHTML = '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>';
                    this.insertBefore(star, this.firstChild);
                }
            } else {
                // Remove star icon
                const star = this.querySelector('.icon');
                if (star) {
                    star.remove();
                }
            }
            
            saveData();
        });
    });
});

// Add auto-save functionality for journal
let saveTimeout;
journalNote?.addEventListener('input', function() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveData();
    }, 1000); // Save after 1 second of no typing
});

// Add export functionality
function exportProgress() {
    const data = {
        beforeImage: beforeImageData,
        afterImage: afterImageData,
        journalNote: journalNoteText,
        exportDate: new Date().toISOString(),
        milestones: Array.from(document.querySelectorAll('.milestone.active')).map(m => m.textContent.trim())
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `glow-journey-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels
    const beforeUploadArea = document.querySelector('.before-upload');
    const afterUploadArea = document.querySelector('.after-upload');
    
    if (beforeUploadArea) {
        beforeUploadArea.setAttribute('aria-label', 'Upload before photo');
        beforeUploadArea.setAttribute('role', 'button');
        beforeUploadArea.setAttribute('tabindex', '0');
    }
    
    if (afterUploadArea) {
        afterUploadArea.setAttribute('aria-label', 'Upload after photo');
        afterUploadArea.setAttribute('role', 'button');
        afterUploadArea.setAttribute('tabindex', '0');
    }
    
    // Add keyboard support for upload areas
    [beforeUploadArea, afterUploadArea].forEach((area, index) => {
        if (area) {
            area.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const input = index === 0 ? beforeInput : afterInput;
                    input.click();
                }
            });
        }
    });
});