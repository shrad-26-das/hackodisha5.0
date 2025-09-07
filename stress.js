// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth Scrolling Function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Breathing Exercise
class BreathingExercise {
    constructor() {
        this.isActive = false;
        this.currentPhase = 'idle';
        this.cycle = 0;
        this.breathingCircle = document.getElementById('breathingCircle');
        this.breathingText = document.getElementById('breathingText');
        this.startBtn = document.getElementById('startBreathing');
        this.stopBtn = document.getElementById('stopBreathing');
        
        this.init();
    }
    
    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.breathingCircle.addEventListener('click', () => {
            if (!this.isActive) this.start();
        });
    }
    
    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.cycle = 0;
        this.startBtn.disabled = true;
        this.runCycle();
    }
    
    stop() {
        this.isActive = false;
        this.currentPhase = 'idle';
        this.breathingCircle.className = 'breathing-circle';
        this.breathingText.textContent = 'Click to Start';
        this.startBtn.disabled = false;
    }
    
    runCycle() {
        if (!this.isActive) return;
        
        this.cycle++;
        
        // Breathe In (4 seconds)
        this.currentPhase = 'in';
        this.breathingText.textContent = 'Breathe In...';
        this.breathingCircle.className = 'breathing-circle breathing-in';
        
        setTimeout(() => {
            if (!this.isActive) return;
            
            // Hold (7 seconds)
            this.currentPhase = 'hold';
            this.breathingText.textContent = 'Hold...';
            this.breathingCircle.className = 'breathing-circle breathing-hold';
            
            setTimeout(() => {
                if (!this.isActive) return;
                
                // Breathe Out (8 seconds)
                this.currentPhase = 'out';
                this.breathingText.textContent = 'Breathe Out...';
                this.breathingCircle.className = 'breathing-circle breathing-out';
                
                setTimeout(() => {
                    if (this.isActive) {
                        // Small pause between cycles
                        this.breathingText.textContent = `Cycle ${this.cycle} Complete`;
                        setTimeout(() => this.runCycle(), 2000);
                    }
                }, 8000);
            }, 7000);
        }, 4000);
    }
}

// Meditation Timer
class MeditationTimer {
    constructor() {
        this.timeInSeconds = 600; // Default 10 minutes
        this.remainingTime = this.timeInSeconds;
        this.isRunning = false;
        this.isPaused = false;
        this.interval = null;
        
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timeButtons = document.querySelectorAll('.time-btn');
        this.startBtn = document.getElementById('startMeditation');
        this.pauseBtn = document.getElementById('pauseMeditation');
        this.resetBtn = document.getElementById('resetMeditation');
        this.meditationVisual = document.getElementById('meditationVisual');
        
        this.init();
    }
    
    init() {
        this.timeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setTime(parseInt(btn.dataset.time)));
        });
        
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.updateDisplay();
    }
    
    setTime(minutes) {
        if (this.isRunning) return;
        
        this.timeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-time="${minutes}"]`).classList.add('active');
        
        this.timeInSeconds = minutes * 60;
        this.remainingTime = this.timeInSeconds;
        this.updateDisplay();
    }
    
    start() {
        if (this.isRunning && !this.isPaused) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.startBtn.textContent = 'Running...';
        this.startBtn.disabled = true;
        
        this.meditationVisual.querySelector('.meditation-glow').classList.add('meditation-active');
        
        this.interval = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            
            if (this.remainingTime <= 0) {
                this.complete();
            }
        }, 1000);
    }
    
    pause() {
        if (!this.isRunning) return;
        
        if (this.isPaused) {
            // Resume
            this.start();
            this.pauseBtn.textContent = 'Pause';
        } else {
            // Pause
            this.isPaused = true;
            clearInterval(this.interval);
            this.startBtn.textContent = 'Resume';
            this.startBtn.disabled = false;
            this.pauseBtn.textContent = 'Resume';
            this.meditationVisual.querySelector('.meditation-glow').classList.remove('meditation-active');
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.interval);
        this.remainingTime = this.timeInSeconds;
        this.startBtn.textContent = 'Start Meditation';
        this.startBtn.disabled = false;
        this.pauseBtn.textContent = 'Pause';
        this.meditationVisual.querySelector('.meditation-glow').classList.remove('meditation-active');
        this.updateDisplay();
    }
    
    complete() {
        this.reset();
        alert('🧘‍♀️ Meditation complete! Well done on taking time for yourself.');
        
        // Add completion effect
        this.meditationVisual.style.animation = 'meditationGlow 0.5s ease-in-out 3';
        setTimeout(() => {
            this.meditationVisual.style.animation = '';
        }, 1500);
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Sound Player
class SoundPlayer {
    constructor() {
        this.currentSounds = new Map();
        this.soundUrls = {
            rain: this.createRainSound(),
            ocean: this.createOceanSound(),
            forest: this.createForestSound(),
            birds: this.createBirdSound(),
            bells: this.createBellSound(),
            wind: this.createWindSound()
        };
        
        this.volumeSlider = document.getElementById('volumeSlider');
        this.stopAllBtn = document.getElementById('stopAllSounds');
        this.soundButtons = document.querySelectorAll('.sound-btn');
        
        this.init();
    }
    
    init() {
        this.soundButtons.forEach(btn => {
            btn.addEventListener('click', () => this.toggleSound(btn.dataset.sound, btn));
        });
        
        this.volumeSlider.addEventListener('input', () => this.updateVolume());
        this.stopAllBtn.addEventListener('click', () => this.stopAllSounds());
    }
    
    // Create synthetic audio using Web Audio API
    createRainSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return this.createWhiteNoise(audioContext, 0.3);
    }
    
    createOceanSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return this.createOscillatorSound(audioContext, 80, 'sine', 0.4);
    }
    
    createForestSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return this.createWhiteNoise(audioContext, 0.2);
    }
    
    createBirdSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return this.createOscillatorSound(audioContext, 1000, 'sine', 0.3);
    }
    
    createBellSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return this.createOscillatorSound(audioContext, 440, 'sine', 0.5);
    }
    
    createWindSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return this.createWhiteNoise(audioContext, 0.25);
    }
    
    createWhiteNoise(audioContext, volume = 0.3) {
        const bufferSize = 4096;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = true;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        return { source, gainNode, audioContext };
    }
    
    createOscillatorSound(audioContext, frequency, type, volume = 0.3) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.value = volume;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        return { source: oscillator, gainNode, audioContext };
    }
    
    toggleSound(soundType, button) {
        const soundCard = button.closest('.sound-card');
        
        if (this.currentSounds.has(soundType)) {
            // Stop sound
            this.stopSound(soundType);
            button.textContent = 'Play';
            soundCard.classList.remove('playing');
        } else {
            // Start sound
            this.playSound(soundType);
            button.textContent = 'Stop';
            soundCard.classList.add('playing');
        }
    }
    
    playSound(soundType) {
        try {
            const soundData = this.soundUrls[soundType];
            soundData.source.start();
            this.currentSounds.set(soundType, soundData);
            this.updateVolume();
        } catch (error) {
            console.log('Audio playback not available, creating visual feedback instead');
            // Fallback for environments where audio isn't available
            this.createVisualFeedback(soundType);
        }
    }
    
    stopSound(soundType) {
        if (this.currentSounds.has(soundType)) {
            const soundData = this.currentSounds.get(soundType);
            try {
                soundData.source.stop();
                soundData.audioContext.close();
            } catch (error) {
                // Audio might not be supported
            }
            this.currentSounds.delete(soundType);
        }
    }
    
    updateVolume() {
        const volume = this.volumeSlider.value / 100;
        this.currentSounds.forEach(soundData => {
            if (soundData.gainNode) {
                soundData.gainNode.gain.value = volume * 0.5; // Keep it gentle
            }
        });
    }
    
    stopAllSounds() {
        this.currentSounds.forEach((soundData, soundType) => {
            this.stopSound(soundType);
        });
        
        // Reset all buttons
        this.soundButtons.forEach(btn => {
            btn.textContent = 'Play';
            btn.closest('.sound-card').classList.remove('playing');
        });
    }
    
    createVisualFeedback(soundType) {
        // Create visual indication when audio isn't available
        const soundCard = document.querySelector(`[data-sound="${soundType}"]`);
        soundCard.style.animation = 'meditationGlow 2s ease-in-out infinite';
        
        // Store reference for stopping
        this.currentSounds.set(soundType, { visual: true, element: soundCard });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const breathingExercise = new BreathingExercise();
    const meditationTimer = new MeditationTimer();
    const soundPlayer = new SoundPlayer();
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Add entrance animations to sections
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
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Add click effects to cards
    document.querySelectorAll('.yoga-card, .sound-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'B' to start breathing exercise
    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.altKey) {
        const breathingSection = document.getElementById('breathing');
        if (breathingSection) {
            scrollToSection('breathing');
        }
    }
    
    // Press 'M' to go to meditation
    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey) {
        const meditationSection = document.getElementById('meditation');
        if (meditationSection) {
            scrollToSection('meditation');
        }
    }
    
    // Press Escape to stop all sounds
    if (e.key === 'Escape') {
        document.getElementById('stopAllSounds').click();
    }
});

// Add helpful tooltips
function addTooltips() {
    const tooltipElements = [
        { selector: '.breathing-circle', text: 'Click to start breathing exercise' },
        { selector: '.timer-display', text: 'Your meditation time' },
        { selector: '.sound-card', text: 'Click to play relaxing sounds' }
    ];
    
    tooltipElements.forEach(({ selector, text }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.setAttribute('title', text);
        });
    });
}

// Call tooltip function
addTooltips();

// Service Worker registration for offline support (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // This would register a service worker for offline functionality
        // For now, we'll skip this to keep the example simple
        console.log('Service Worker support detected');
    });
}