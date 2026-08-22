/**
 * Romantic Countdown to 23.09.2026 06:42
 * Features: Live countdown, Interactive Kiss/Hug bursts, Ambient Music,
 * Canvas Starfield & Hearts, Letter Modal, Checklist.
 */

// Target Reunion Date: September 23, 2026, 06:42:00
const TARGET_DATE = new Date(2026, 8, 23, 6, 42, 0); // Month is 0-indexed (8 = September)

// DOM Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const totalHoursEl = document.getElementById('total-hours-left');
const totalHeartbeatsEl = document.getElementById('total-heartbeats');

const sendKissBtn = document.getElementById('send-kiss-btn');
const kissBadge = document.getElementById('kiss-count-badge');
const openLetterBtn = document.getElementById('open-letter-btn');
const closeLetterBtn = document.getElementById('close-letter-btn');
const letterModal = document.getElementById('letter-modal');
const letterHugBtn = document.getElementById('letter-send-hug');
const musicBtn = document.getElementById('music-btn');
const musicLabel = document.getElementById('music-label');
const toastContainer = document.getElementById('toast-container');
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// --- 1. COUNTDOWN TIMER ---
function updateCountdown() {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    totalHoursEl.textContent = '0';
    totalHeartbeatsEl.textContent = '0';
    showToast('Мы наконец-то вместе! Навсегда! ❤️✨');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const totalSecs = Math.floor(diff / 1000);
  const heartbeats = Math.floor(totalSecs * 1.15); // Average ~69 bpm

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');

  totalHoursEl.textContent = totalHours.toLocaleString('ru-RU');
  totalHeartbeatsEl.textContent = heartbeats.toLocaleString('ru-RU');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// --- 2. KISSES COUNTER & INTERACTION ---
let kissCount = parseInt(localStorage.getItem('love_kiss_counter') || '0', 10);
kissBadge.textContent = kissCount;

const romanticMessages = [
  'Поцелуй отправлен прямо в твоё сердечко! 💋',
  'Крепко обнял и прижал к себе! 🫂',
  'Скучаю по тебе сильнее всего на свете! ❤️',
  'Каждая секунда приближает нас друг к другу! ✨',
  'Ты самая прекрасная девушка во Вселенной! 🌸',
  'Жду не дождусь того самого утра в 06:42! ☕',
  'Никакое расстояние не способно уменьшить мою любовь! 💕',
  'Скоро я буду держать тебя за руку! 💫'
];

function burstHearts(originX, originY, count = 20) {
  const emojis = ['❤️', '💖', '💕', '💋', '✨', '🌸', '🥰', '🤍', '🫂'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'floating-heart-el';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = (Math.random() * Math.PI * 2);
    const distance = 80 + Math.random() * 180;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - (40 + Math.random() * 80);
    const rot = (Math.random() - 0.5) * 60;
    const size = 18 + Math.random() * 24;

    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.fontSize = `${size}px`;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
}

function showToast(text) {
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = text;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

sendKissBtn.addEventListener('click', (e) => {
  kissCount++;
  kissBadge.textContent = kissCount;
  localStorage.setItem('love_kiss_counter', kissCount);

  const rect = sendKissBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  burstHearts(x, y, 22);

  // Random toast
  const msg = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
  showToast(msg);
});

// Click anywhere on body spawns a gentle heart
document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.modal-dialog') || e.target.closest('.check-item')) return;
  burstHearts(e.clientX, e.clientY, 3);
});

// --- 3. LOVE LETTER MODAL ---
function openModal() {
  letterModal.classList.add('open');
  letterModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  letterModal.classList.remove('open');
  letterModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openLetterBtn.addEventListener('click', openModal);
closeLetterBtn.addEventListener('click', closeModal);

letterModal.addEventListener('click', (e) => {
  if (e.target === letterModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && letterModal.classList.contains('open')) {
    closeModal();
  }
});

letterHugBtn.addEventListener('click', (e) => {
  const rect = letterHugBtn.getBoundingClientRect();
  burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
  showToast('Твоё тепло получено и согревает моё сердце! 🫂❤️');
  setTimeout(closeModal, 1200);
});

// --- 4. ROMANTIC CHECKLIST INTERACTION ---
document.querySelectorAll('.check-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
    const box = item.querySelector('.checkbox-custom');
    if (item.classList.contains('active')) {
      box.textContent = '✓';
      burstHearts(item.getBoundingClientRect().left + 20, item.getBoundingClientRect().top + 20, 5);
    } else {
      box.textContent = '';
    }
  });
});

// --- 5. ROMANTIC AMBIENT WEB AUDIO SYNTHESIZER ---
let audioCtx = null;
let isMusicPlaying = false;
let synthInterval = null;

// Warm romantic piano chord notes frequencies (Hz)
const chordProgressions = [
  // Fmaj7 - G - Em7 - Am7 (Gentle romantic vibe)
  [174.61, 220.00, 261.63, 329.63, 440.00], // Fmaj7
  [196.00, 246.94, 293.66, 392.00, 493.88], // G6
  [164.81, 196.00, 246.94, 329.63, 392.00], // Em7
  [220.00, 261.63, 329.63, 440.00, 523.25]  // Am7
];

function playRomanticTone(freq, time, duration = 2.5, gainLevel = 0.12) {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  // Warm gentle sine/triangle mix
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, time);
  filter.frequency.exponentialRampToValueAtTime(300, time + duration);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(gainLevel, time + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + duration);
}

function startAmbientMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  let step = 0;
  function scheduleNextChord() {
    if (!isMusicPlaying) return;
    const now = audioCtx.currentTime;
    const chord = chordProgressions[step % chordProgressions.length];
    
    // Play warm arpeggio
    chord.forEach((freq, idx) => {
      playRomanticTone(freq, now + idx * 0.45, 3.8, 0.09);
    });

    step++;
  }

  scheduleNextChord();
  synthInterval = setInterval(scheduleNextChord, 3600);
}

function stopAmbientMusic() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

musicBtn.addEventListener('click', () => {
  isMusicPlaying = !isMusicPlaying;
  if (isMusicPlaying) {
    startAmbientMusic();
    musicBtn.classList.add('playing');
    musicLabel.textContent = 'Музыка играет ❤️';
    showToast('🎵 Романтическая мелодия включена');
  } else {
    stopAmbientMusic();
    musicBtn.classList.remove('playing');
    musicLabel.textContent = 'Музыка для нас';
  }
});

// --- 6. BACKGROUND CANVAS (STARS & FLOATING HEARTS) ---
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const particles = [];
const particleCount = Math.min(Math.floor(window.innerWidth / 14), 70);

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.2 + 0.6,
    speedY: Math.random() * 0.4 + 0.15,
    speedX: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.7 + 0.2,
    isHeart: Math.random() > 0.75,
    pulseSpeed: Math.random() * 0.03 + 0.01,
    pulseOffset: Math.random() * Math.PI * 2
  });
}

function drawHeartShape(ctx, x, y, size, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 15, size / 15);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-7, -7, -15, 3, 0, 15);
  ctx.bezierCurveTo(15, 3, 7, -7, 0, 0);
  ctx.fillStyle = `rgba(255, 107, 149, ${alpha})`;
  ctx.shadowColor = 'rgba(255, 64, 113, 0.4)';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

let tick = 0;
function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  tick += 0.02;

  for (let p of particles) {
    p.y -= p.speedY;
    p.x += p.speedX;

    if (p.y < -20) {
      p.y = height + 20;
      p.x = Math.random() * width;
    }
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;

    const currentAlpha = p.alpha + Math.sin(tick + p.pulseOffset) * 0.2;
    const clampedAlpha = Math.max(0.1, Math.min(0.9, currentAlpha));

    if (p.isHeart) {
      drawHeartShape(ctx, p.x, p.y, p.radius * 3.5, clampedAlpha * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 230, 240, ${clampedAlpha})`;
      ctx.shadowColor = 'rgba(255, 195, 113, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fill();
    }
  }

  requestAnimationFrame(animateCanvas);
}

animateCanvas();
