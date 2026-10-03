/**
 * Romantic Countdown to 24.09.2026 06:42
 * Features: Live countdown, Interactive Kiss/Hug bursts, Ambient Music,
 * Canvas Starfield & Hearts, Letter Modal, Checklist.
 */

// Target Dates (MSK / UTC+3):
// 1. Приезд любимой: 24 сентября 2026 в 06:42:00
// 2. Отъезд: 30 сентября 2026 в 21:42:00
const ARRIVAL_DATE = new Date('2026-09-24T06:42:00+03:00');
const DEPARTURE_DATE = new Date('2026-09-30T21:42:00+03:00');

// По умолчанию таймер зафиксирован на дате приезда
let currentTimerTarget = ARRIVAL_DATE;
let currentTimerMode = 'arrival';

// DOM Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const totalHoursEl = document.getElementById('total-hours-left');
const totalHeartbeatsEl = document.getElementById('total-heartbeats');

const tabArrivalBtn = document.getElementById('tab-arrival-btn');
const tabDepartureBtn = document.getElementById('tab-departure-btn');
const timerStatusHint = document.getElementById('timer-status-hint');

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

let countdownInterval = null;

// --- 1. COUNTDOWN TIMER ---
function updateCountdown() {
  const now = new Date();
  const diff = currentTimerTarget.getTime() - now.getTime();

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    totalHoursEl.textContent = '0';
    totalHeartbeatsEl.textContent = '0';
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

function switchTimerMode(mode) {
  currentTimerMode = mode;
  if (mode === 'arrival') {
    currentTimerTarget = ARRIVAL_DATE;
    tabArrivalBtn?.classList.add('active');
    tabArrivalBtn?.setAttribute('aria-selected', 'true');
    tabDepartureBtn?.classList.remove('active');
    tabDepartureBtn?.setAttribute('aria-selected', 'false');
    if (timerStatusHint) {
      timerStatusHint.textContent = '📍 Таймер зафиксирован на дате приезда (24.09.2026 в 06:42)';
    }
  } else {
    currentTimerTarget = DEPARTURE_DATE;
    tabDepartureBtn?.classList.add('active');
    tabDepartureBtn?.setAttribute('aria-selected', 'true');
    tabArrivalBtn?.classList.remove('active');
    tabArrivalBtn?.setAttribute('aria-selected', 'false');
    if (timerStatusHint) {
      timerStatusHint.textContent = '📍 Таймер отсчитывает время до отъезда (30.09.2026 в 21:42)';
    }
  }
  updateCountdown();
}

tabArrivalBtn?.addEventListener('click', () => switchTimerMode('arrival'));
tabDepartureBtn?.addEventListener('click', () => switchTimerMode('departure'));

updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);

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

// --- 7. ROMANTIC PHOTO GALLERY & LIGHTBOX (WITH INDEXEDDB) ---

// Database constants
const DB_NAME = 'RomanticGalleryDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

// 1. Встроенные фотографии проекта (видны ВСЕМ пользователям и на ВСЕХ устройствах)
// Чтобы добавить новые фото для всех — положите файлы в assets/gallery/ (1.jpg, 2.jpg...)
const DEFAULT_GALLERY_PHOTOS = [
  {
    id: 'photo-1',
    src: 'assets/gallery/1.jpg',
    caption: 'Наши счастливые моменты ❤️',
    date: '24 сентября 2026',
    isDefault: true
  },
  {
    id: 'photo-2',
    src: 'assets/gallery/2.jpg',
    caption: 'Самые тёплые воспоминания ✨',
    date: '25 сентября 2026',
    isDefault: true
  },
  {
    id: 'photo-3',
    src: 'assets/gallery/3.jpg',
    caption: 'Рядом с тобой всегда улыбка 🌸',
    date: '26 сентября 2026',
    isDefault: true
  },
  {
    id: 'photo-4',
    src: 'assets/gallery/4.jpg',
    caption: 'Бесконечно люблю тебя 💫',
    date: '27 сентября 2026',
    isDefault: true
  },
  {
    id: 'default-main-photo',
    src: 'assets/photo.jpg',
    caption: 'Самое уютное место в мире — рядом с тобой ❤️',
    date: '24 сентября 2026 • 06:42',
    isDefault: true
  }
];

// IndexedDB Helper Functions
function openGalleryDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getStoredPhotos() {
  try {
    const db = await openGalleryDB();
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not read photos from IndexedDB:', e);
    return [];
  }
}

async function saveStoredPhoto(photo) {
  try {
    const db = await openGalleryDB();
    if (!db) return;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(photo);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not save photo to IndexedDB:', e);
  }
}

async function deleteStoredPhoto(id) {
  try {
    const db = await openGalleryDB();
    if (!db) return;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not delete photo from IndexedDB:', e);
  }
}

// Автопоиск дополнительных фотографий в папке assets/gallery/ (5.jpg ... 25.jpg)
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function probeAdditionalGalleryPhotos() {
  const discovered = [];
  const registeredSrcs = new Set(DEFAULT_GALLERY_PHOTOS.map(p => p.src));

  const probePromises = [];
  for (let i = 1; i <= 25; i++) {
    const srcJpg = `assets/gallery/${i}.jpg`;
    if (!registeredSrcs.has(srcJpg)) {
      probePromises.push(checkImageExists(srcJpg).then(exists => {
        if (exists) {
          discovered.push({
            id: `auto-photo-${i}`,
            src: srcJpg,
            caption: `Наш счастливый момент #${i} ❤️`,
            date: '2026',
            isDefault: true
          });
        }
      }));
    }
  }

  await Promise.all(probePromises);
  discovered.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });
  return discovered;
}

let allGalleryPhotos = [];
let currentLightboxIndex = 0;

async function loadAndRenderGallery() {
  const userPhotos = await getStoredPhotos();
  allGalleryPhotos = [...DEFAULT_GALLERY_PHOTOS, ...userPhotos];
  renderGalleryGrid();

  // Дозагружаем новые фото из assets/gallery/ (если добавлены 5.jpg, 6.jpg и т.д.)
  probeAdditionalGalleryPhotos().then(extraPhotos => {
    if (extraPhotos.length > 0) {
      allGalleryPhotos = [...DEFAULT_GALLERY_PHOTOS, ...extraPhotos, ...userPhotos];
      renderGalleryGrid();
    }
  });
}

function renderGalleryGrid() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';

  allGalleryPhotos.forEach((photo, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';

    card.innerHTML = `
      <div class="gallery-img-wrap">
        <img src="${photo.src}" alt="${photo.caption || 'Фото'}" class="gallery-img" loading="lazy">
        <div class="gallery-hover-overlay">
          <div class="gallery-zoom-badge">🔍</div>
        </div>
        ${!photo.isDefault ? `<button class="gallery-delete-btn" data-id="${photo.id}" title="Удалить это фото" aria-label="Удалить">&times;</button>` : ''}
      </div>
      <div class="gallery-card-info">
        <span class="gallery-card-caption">${photo.caption || 'Наш счастливый момент'}</span>
        <span class="gallery-card-date">${photo.date || '2026'}</span>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-delete-btn')) {
        e.stopPropagation();
        const id = e.target.closest('.gallery-delete-btn').getAttribute('data-id');
        deletePhoto(id);
        return;
      }
      openLightbox(index);
    });

    galleryGrid.appendChild(card);
  });
}

async function deletePhoto(id) {
  await deleteStoredPhoto(id);
  showToast('Фотография удалена из галереи');
  await loadAndRenderGallery();
}

// Lightbox Modal DOM & Logic
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
const lightboxNextBtn = document.getElementById('lightbox-next-btn');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');

function openLightbox(index) {
  if (index < 0 || index >= allGalleryPhotos.length) return;
  currentLightboxIndex = index;
  updateLightboxContent();
  lightboxModal?.classList.add('open');
  lightboxModal?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxModal?.classList.remove('open');
  lightboxModal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
  const photo = allGalleryPhotos[currentLightboxIndex];
  if (!photo || !lightboxImg) return;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = photo.src;
    if (lightboxCaption) lightboxCaption.textContent = photo.caption || 'Наш момент ❤️';
    if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${allGalleryPhotos.length}`;
    lightboxImg.style.opacity = '1';
  }, 120);
}

function showPrevPhoto() {
  if (allGalleryPhotos.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + allGalleryPhotos.length) % allGalleryPhotos.length;
  updateLightboxContent();
}

function showNextPhoto() {
  if (allGalleryPhotos.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % allGalleryPhotos.length;
  updateLightboxContent();
}

lightboxCloseBtn?.addEventListener('click', closeLightbox);
lightboxBackdrop?.addEventListener('click', closeLightbox);
lightboxPrevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrevPhoto(); });
lightboxNextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNextPhoto(); });

document.addEventListener('keydown', (e) => {
  if (!lightboxModal?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrevPhoto();
  if (e.key === 'ArrowRight') showNextPhoto();
});

// Photo Uploading via <input type="file">
const galleryFileInput = document.getElementById('gallery-file-input');

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

galleryFileInput?.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;

  let addedCount = 0;
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;

    try {
      const dataUrl = await readFileAsDataURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').slice(0, 32) || 'Наш момент';
      const newPhoto = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        src: dataUrl,
        caption: cleanName + ' ❤️',
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
        createdAt: Date.now(),
        isDefault: false
      };

      await saveStoredPhoto(newPhoto);
      addedCount++;
    } catch (err) {
      console.error('Error processing photo:', err);
    }
  }

  e.target.value = '';
  await loadAndRenderGallery();

  if (addedCount > 0) {
    burstHearts(window.innerWidth / 2, window.innerHeight / 2, 26);
    showToast(`📸 Добавлено фото: ${addedCount}! Они сохранены в вашей галерее ❤️`);
  }
});

// Initialize Gallery
loadAndRenderGallery();
