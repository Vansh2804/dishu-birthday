// ============================================
// FULL SCREEN SLIDESHOW - TAP/SWIPE CONTROL ONLY
// ============================================

let currentSlide = 0;
let totalSlides = 0;
let currentAudio = null;
let slideTimeout = null;

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
    
    // Clear any pending timeout
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
    
    // Update music status
    if (isCakeSlide) {
        document.getElementById('musicStatus').innerHTML = '🍰 Cake time! 🍰';
    } else {
        document.getElementById('musicStatus').innerHTML = '🎵 Tap side to change slide 🎵';
    }
    
    // Play audio for slide (if not cake slide)
    const audioFile = slides[index].getAttribute('data-audio');
    if (audioFile && audioFile !== '' && !isCakeSlide) {
        playAudioForSlide(audioFile);
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

// Next slide (Right tap / Right swipe)
function nextSlide() {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= totalSlides) {
        // Optional: Loop back to first slide (comment out if you don't want loop)
        nextIndex = 0;
    }
    showSlide(nextIndex);
}

// Previous slide (Left tap / Left swipe)
function prevSlide() {
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) {
        // Optional: Loop to last slide (comment out if you don't want loop)
        prevIndex = totalSlides - 1;
    }
    showSlide(prevIndex);
}

// ============================================
// TAP ON LEFT/RIGHT SIDE OF SCREEN
// ============================================

function initTapControls() {
    document.addEventListener('click', (e) => {
        const screenWidth = window.innerWidth;
        const clickX = e.clientX;
        
        // If clicked on left side (previous slide)
        if (clickX < screenWidth / 2) {
            prevSlide();
        } 
        // If clicked on right side (next slide)
        else {
            nextSlide();
        }
    });
}

// ============================================
// SWIPE CONTROLS (Left/Right Swipe)
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
        
        // Swipe Left -> Next Slide
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide();
        }
        
        // Swipe Right -> Previous Slide
        if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide();
        }
    });
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
    
    lightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
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
        cutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
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
// HIDE PROGRESS BAR (No timer needed)
// ============================================

function hideProgressBar() {
    const progressTimer = document.querySelectorAll('.progress-timer');
    progressTimer.forEach(timer => {
        timer.style.display = 'none';
    });
}

// ============================================
// ADD VISUAL HINT (Tap left/right)
// ============================================

function addTapHint() {
    const hint = document.createElement('div');
    hint.className = 'tap-hint';
    hint.innerHTML = '👈 Tap left = Previous &nbsp;&nbsp;&nbsp; Tap right = Next 👉';
    hint.style.position = 'fixed';
    hint.style.bottom = '80px';
    hint.style.left = '50%';
    hint.style.transform = 'translateX(-50%)';
    hint.style.backgroundColor = 'rgba(0,0,0,0.6)';
    hint.style.color = 'white';
    hint.style.padding = '10px 20px';
    hint.style.borderRadius = '40px';
    hint.style.fontSize = '12px';
    hint.style.zIndex = '100';
    hint.style.whiteSpace = 'nowrap';
    hint.style.backdropFilter = 'blur(5px)';
    hint.style.fontFamily = 'sans-serif';
    document.body.appendChild(hint);
    
    setTimeout(() => {
        hint.style.opacity = '0';
        setTimeout(() => hint.remove(), 1000);
    }, 4000);
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    setTimeout(initCake, 500);
    initTapControls();
    initTouchControls();
    hideProgressBar();
    addTapHint();
    
    console.log('❤️ Tap-controlled slideshow ready! Tap left/right to navigate. Happy Birthday Dishu! ❤️');
});