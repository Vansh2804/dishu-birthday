// ============================================
// FULL SCREEN AUTO SLIDESHOW
// ============================================

let currentSlide = 0;
let totalSlides = 0;
let isPlaying = true;
let slideTimeout = null;
let currentAudio = null;

// Get all slides
const slides = document.querySelectorAll('.slide');
totalSlides = slides.length;
document.getElementById('totalSlides').innerText = totalSlides;

// Function to show a specific slide
function showSlide(index) {
    // Stop current audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // Clear existing timeout
    if (slideTimeout) {
        clearTimeout(slideTimeout);
        slideTimeout = null;
    }
    
    // Hide all slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    slides[index].classList.add('active');
    currentSlide = index;
    
    // Update counter
    document.getElementById('currentSlide').innerText = currentSlide + 1;
    
    // Check if this is the cake slide
    const isCakeSlide = slides[index].querySelector('.cake-container') !== null;
    
    // Get duration
    let duration = parseInt(slides[index].getAttribute('data-duration')) || 10;
    
    // If cake slide, disable timer
    if (isCakeSlide) {
        duration = 0;
        document.getElementById('musicStatus').innerHTML = '🍰 Cake time! No auto-advance 🍰';
        
        // Update pause button appearance
        const pauseBtn = document.getElementById('pausePlayBtn');
        if (pauseBtn) pauseBtn.innerHTML = '🍰 Cake 🍰';
    } else {
        document.getElementById('musicStatus').innerHTML = '🎵 Playing...';
        const pauseBtn = document.getElementById('pausePlayBtn');
        if (pauseBtn && isPlaying) pauseBtn.innerHTML = '⏸️ Pause';
        else if (pauseBtn && !isPlaying) pauseBtn.innerHTML = '▶️ Play';
    }
    
    // Play audio for slide (if not cake slide)
    const audioFile = slides[index].getAttribute('data-audio');
    if (audioFile && audioFile !== '' && !isCakeSlide) {
        playAudioForSlide(audioFile);
    }
    
    // Setup auto-advance only if duration > 0 and playing
    if (duration > 0 && isPlaying && !isCakeSlide) {
        slideTimeout = setTimeout(() => {
            nextSlide();
        }, duration * 1000);
    }
}

// Play audio for slide
function playAudioForSlide(audioSrc) {
    try {
        currentAudio = new Audio(audioSrc);
        currentAudio.loop = false;
        currentAudio.play().catch(e => {
            console.log('Audio play error:', e);
        });
        
        currentAudio.onended = () => {
            // Audio ended, do nothing
        };
    } catch(e) {
        console.log('Audio error:', e);
    }
}

// Next slide
function nextSlide() {
    if (!isPlaying) return;
    
    let nextIndex = currentSlide + 1;
    if (nextIndex >= totalSlides) {
        nextIndex = 0;
    }
    
    showSlide(nextIndex);
}

// Previous slide
function prevSlide() {
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) {
        prevIndex = totalSlides - 1;
    }
    showSlide(prevIndex);
}

// Pause/Play
function togglePlayPause() {
    const currentSlideElem = slides[currentSlide];
    const isCakeSlide = currentSlideElem && currentSlideElem.querySelector('.cake-container') !== null;
    
    if (isCakeSlide) {
        return;
    }
    
    isPlaying = !isPlaying;
    const btn = document.getElementById('pausePlayBtn');
    
    if (isPlaying) {
        btn.innerHTML = '⏸️ Pause';
        document.getElementById('musicStatus').innerHTML = '🎵 Playing...';
        
        const duration = parseInt(slides[currentSlide].getAttribute('data-duration')) || 10;
        if (duration > 0 && slideTimeout) {
            clearTimeout(slideTimeout);
            slideTimeout = setTimeout(() => nextSlide(), duration * 1000);
        }
    } else {
        btn.innerHTML = '▶️ Play';
        document.getElementById('musicStatus').innerHTML = '⏸️ Paused';
        if (slideTimeout) {
            clearTimeout(slideTimeout);
            slideTimeout = null;
        }
    }
}

// ============================================
// CAKE FUNCTIONALITY
// ============================================

function initCake() {
    const lightBtn = document.getElementById('lightCandlesBtn');
    const cutBtn = document.getElementById('cutCakeBtn');
    const cakeMessage = document.getElementById('cakeMessage');
    
    if (!lightBtn) {
        setTimeout(initCake, 500);
        return;
    }
    
    const flame1 = document.querySelector('.flame1');
    const flame2 = document.querySelector('.flame2');
    const flame3 = document.querySelector('.flame3');
    
    function positionFlames() {
        const candle1 = document.getElementById('candle1');
        const candle2 = document.getElementById('candle2');
        const candle3 = document.getElementById('candle3');
        
        if (candle1 && flame1) {
            const rect = candle1.getBoundingClientRect();
            flame1.style.position = 'fixed';
            flame1.style.left = (rect.left + rect.width/2 - 14) + 'px';
            flame1.style.top = (rect.top - 30) + 'px';
        }
        if (candle2 && flame2) {
            const rect = candle2.getBoundingClientRect();
            flame2.style.position = 'fixed';
            flame2.style.left = (rect.left + rect.width/2 - 14) + 'px';
            flame2.style.top = (rect.top - 30) + 'px';
        }
        if (candle3 && flame3) {
            const rect = candle3.getBoundingClientRect();
            flame3.style.position = 'fixed';
            flame3.style.left = (rect.left + rect.width/2 - 14) + 'px';
            flame3.style.top = (rect.top - 30) + 'px';
        }
    }
    
    lightBtn.addEventListener('click', () => {
        if (flame1) flame1.classList.remove('hidden');
        if (flame2) flame2.classList.remove('hidden');
        if (flame3) flame3.classList.remove('hidden');
        
        positionFlames();
        
        lightBtn.classList.add('hidden');
        if (cutBtn) cutBtn.classList.remove('hidden');
        
        if (cakeMessage) {
            cakeMessage.innerHTML = '🕯️✨ The candles are lit! Make a wish, my love! ✨🕯️';
            cakeMessage.classList.remove('hidden');
        }
    });
    
    if (cutBtn) {
        cutBtn.addEventListener('click', () => {
            if (cakeMessage) {
                cakeMessage.innerHTML = '🎂❤️ HAPPY BIRTHDAY DISHU! ❤️🎂<br><br>I will try my best to be there and feed you the first bite. Next time, I promise. ❤️<br><br>जब तक मेरी आखिरी सांस खत्म नहीं होती, तब तक हर जन्मदिन तुम्हारे साथ ❤️';
            }
            
            if (flame1) flame1.classList.add('hidden');
            if (flame2) flame2.classList.add('hidden');
            if (flame3) flame3.classList.add('hidden');
            
            cutBtn.disabled = true;
            cutBtn.style.opacity = '0.5';
            
            showConfetti();
        });
    }
    
    window.addEventListener('resize', () => {
        if (lightBtn && lightBtn.classList.contains('hidden')) {
            positionFlames();
        }
    });
}

function showConfetti() {
    const colors = ['#ff6b6b', '#ff8e8e', '#ffd700', '#ff9800', '#e91e63'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'ease-out'
        }).onfinish = () => confetti.remove();
    }
}

// ============================================
// TOUCH CONTROLS
// ============================================

let touchStartX = 0;
let touchEndX = 0;

function initTouchControls() {
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide();
        }
    });
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    setTimeout(initCake, 500);
    initTouchControls();
    
    const pauseBtn = document.getElementById('pausePlayBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Add tap indicator
    const tapIndicator = document.createElement('div');
    tapIndicator.className = 'tap-indicator';
    tapIndicator.innerHTML = '👆 Swipe left/right to change slides 👆';
    document.body.appendChild(tapIndicator);
    setTimeout(() => {
        tapIndicator.style.opacity = '0';
        setTimeout(() => tapIndicator.remove(), 1000);
    }, 4000);
    
    console.log('❤️ Slideshow ready! Happy Birthday Dishu! ❤️');
});