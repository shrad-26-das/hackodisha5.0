const styleTips = [
    "Layer pastel accessories to brighten any outfit 💕",
    "Mix textures like silk and cotton for visual interest ✨",
    "Add a pop of color with your favorite scarf 🌸",
    "Invest in quality basics that make you feel confident 💪",
    "Experiment with different silhouettes to find your favorites 👗",
    "Don't forget to accessorize with jewelry that speaks to you 💎",
    "Comfort is key - choose pieces you love to wear 🤗",
    "Try the rule of three: pick three colors max per outfit 🎨",
    "Balance loose fits with fitted pieces for a flattering look ⚖️",
    "Your smile is the best accessory you can wear 😊"
];

let currentTipIndex = 0;

// Color combinations and moods
const colorCombinations = {
    // Warm colors
    warm: {
        colors: ['#FFB6C1', '#FFDAB9', '#F0E68C'],
        mood: 'Energetic & Cheerful - Perfect for boosting confidence and spreading positivity'
    },
    // Cool colors  
    cool: {
        colors: ['#B0E0E6', '#E6E6FA', '#D8BFD8'],
        mood: 'Calm & Serene - Ideal for peaceful moments and professional settings'
    },
    // Neutral colors
    neutral: {
        colors: ['#F5F5DC', '#E6E6E6', '#D2B48C'],
        mood: 'Sophisticated & Timeless - Great for versatile, elegant looks'
    },
    // Pastel colors
    pastel: {
        colors: ['#FFE4E1', '#E0FFFF', '#F0FFF0'],
        mood: 'Soft & Romantic - Perfect for gentle, dreamy aesthetics'
    },
    // Earthy colors
    earthy: {
        colors: ['#DEB887', '#D2691E', '#CD853F'],
        mood: 'Grounded & Natural - Excellent for cozy, autumn-inspired outfits'
    },
    // Vibrant colors
    vibrant: {
        colors: ['#FF69B4', '#00CED1', '#FFD700'],
        mood: 'Bold & Confident - Great for making a statement and standing out'
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeTipRotation();
    initializeColorSuggestions();
});

// Tip rotation functionality
function initializeTipRotation() {
    const nextTipBtn = document.getElementById('nextTipBtn');
    const tipText = document.getElementById('tipText');
    
    if (nextTipBtn && tipText) {
        nextTipBtn.addEventListener('click', function() {
            // Add loading state
            nextTipBtn.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                currentTipIndex = (currentTipIndex + 1) % styleTips.length;
                
                // Fade out
                tipText.style.opacity = '0';
                tipText.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    tipText.textContent = styleTips[currentTipIndex];
                    
                    // Fade in
                    tipText.style.opacity = '1';
                    tipText.style.transform = 'translateY(0)';
                }, 150);
                
                // Reset button
                nextTipBtn.style.transform = 'scale(1)';
            }, 100);
        });
    }
}

// Color suggestion functionality
function initializeColorSuggestions() {
    const suggestBtn = document.getElementById('suggestBtn');
    const colorPicker = document.getElementById('colorPicker');
    const suggestionsContainer = document.getElementById('colorSuggestions');
    
    if (suggestBtn && colorPicker && suggestionsContainer) {
        suggestBtn.addEventListener('click', function() {
            const selectedColor = colorPicker.value;
            generateColorSuggestions(selectedColor, suggestionsContainer);
        });
    }
}

function generateColorSuggestions(baseColor, container) {
    // Clear previous suggestions
    container.innerHTML = '';
    
    // Add loading animation
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--muted-foreground);">✨ Creating perfect combinations... ✨</div>';
    
    setTimeout(() => {
        const suggestions = getColorSuggestions(baseColor);
        displayColorSuggestions(suggestions, container);
    }, 1000);
}

function getColorSuggestions(baseColor) {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const suggestions = [];
    
    // Complementary colors
    const complementary = {
        colors: [baseColor, hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)],
        combo: 'Complementary Contrast',
        mood: 'Bold & Dynamic - Creates striking visual impact and energy'
    };
    suggestions.push(complementary);
    
    // Analogous colors
    const analogous = {
        colors: [
            baseColor, 
            hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
            hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
        ],
        combo: 'Analogous Harmony',
        mood: 'Peaceful & Cohesive - Creates gentle, harmonious combinations'
    };
    suggestions.push(analogous);
    
    // Triadic colors
    const triadic = {
        colors: [
            baseColor,
            hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
            hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
        ],
        combo: 'Triadic Balance',
        mood: 'Vibrant & Balanced - Perfect for playful, creative expressions'
    };
    suggestions.push(triadic);
    
    // Pastel variation
    const pastel = {
        colors: [
            baseColor,
            hslToHex(hsl.h, Math.max(hsl.s - 20, 20), Math.min(hsl.l + 20, 90)),
            hslToHex(hsl.h, Math.max(hsl.s - 30, 15), Math.min(hsl.l + 30, 95))
        ],
        combo: 'Soft Pastel Mix',
        mood: 'Gentle & Dreamy - Ideal for romantic, feminine aesthetics'
    };
    suggestions.push(pastel);
    
    return suggestions;
}

function displayColorSuggestions(suggestions, container) {
    container.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.style.animation = 'fadeIn 0.5s ease-out';
        
        const colorsHtml = suggestion.colors.map(color => 
            `<div class="suggestion-color" style="background-color: ${color};"></div>`
        ).join('');
        
        suggestionElement.innerHTML = `
            <div class="suggestion-colors">${colorsHtml}</div>
            <div class="suggestion-combo">${suggestion.combo}</div>
            <div class="suggestion-mood">${suggestion.mood}</div>
        `;
        
        container.appendChild(suggestionElement);
    });
}

// Color utility functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToHex(h, s, l) {
    h = h % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});