/**
 * ══════════════════════════════════════════════════════════════════
 * AURELIA HOTEL, VARKALA — "GOLDEN HOUR ON THE CLIFF"
 * High-End Editorial Front-End Interactions & Motion Engine
 * Vanilla JS (Zero Libraries, 60fps Native Web APIs)
 * ══════════════════════════════════════════════════════════════════
 */

/* ── 1. CONFIGURATION & INTENSITY CONTROLS ───────────────────── */
const AURELIA_CONFIG = {
  // Hero 3D scroll canvas
  hero: {
    desktopPath: ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './').replace(/\/?$/, '/') + 'frames/desktop/f_',
    mobilePath:  ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './').replace(/\/?$/, '/') + 'frames/mobile/f_',
    posterPath:  ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || './').replace(/\/?$/, '/') + 'frames/poster.webp',
    desktopCount: 120,
    mobileCount:  100,
    smoothing:    0.16, // frame smoothing factor (0 = instant, 1 = frozen)
    dprCap:       1.5,
  },
  // Bento gallery 3D tilt & interaction
  gallery: {
    maxTiltDeg: 8,     // max 3D rotation in degrees on hover
    glareOpacity: 0.35, // specular reflection intensity
  },
  // Guest voices stacked carousel
  carousel: {
    autoAdvanceMs: 6000, // auto-rotate interval in milliseconds
    dragThreshold: 50,   // px drag distance needed to trigger card switch
  },
  // Ambient generative ocean sound
  audio: {
    maxVolume: 0.16,     // peak wave audio gain (calm and subtle)
    swellPeriodSec: 7.5, // duration of one wave swell cycle in seconds
  },
  // Drifting lanterns / fireflies
  particles: {
    count: 18,          // max floating particles in dark section
    glowColor: 'rgba(245, 230, 200, 0.85)',
  },
  // Contact & WhatsApp
  contact: {
    whatsappNumber: '+916369403544',
    email: 'hello@aureliahotel.com',
    phone: '+91 63694 03544',
  }
};

/* ── 2. UTILITIES ────────────────────────────────────────────── */
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const lerp = (a, b, t) => a + (b - a) * t;
const padNum = (num, len = 4) => String(num).padStart(len, '0');

/* ── 3. TIME-OF-DAY AMBIENT SCROLL DRIVER ────────────────────── */
function initTimeOfDayScroll() {
  const navWrap = document.querySelector('.nav-wrap');
  const progressFill = document.querySelector('.nav-scroll-progress-fill');
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = clamp(scrollY / (maxScroll || 1), 0, 1);
    
    // Update scroll progress variable
    document.documentElement.style.setProperty('--scroll-pct', `${(progress * 100).toFixed(1)}%`);
    if (progressFill) {
      progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
    }
    
    // Navbar shrink state
    if (navWrap) {
      navWrap.classList.toggle('scrolled', scrollY > 60);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ── 4. FLOATING PILL NAVIGATION & SECTION TRACKER ───────────── */
function initNavigation() {
  const links = document.querySelectorAll('.nav-links a');
  const indicator = document.querySelector('.nav-indicator');
  const sections = document.querySelectorAll('section[id]');
  const dots = document.querySelectorAll('.section-dot');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileCurtain = document.querySelector('.mobile-nav-curtain');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  // Update sliding indicator position
  const updateIndicator = (activeLink) => {
    if (!indicator || !activeLink) return;
    const linkRect = activeLink.getBoundingClientRect();
    const parentRect = activeLink.parentElement.parentElement.getBoundingClientRect();
    indicator.style.left = `${linkRect.left - parentRect.left}px`;
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.opacity = '1';
  };

  // Observe active section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update nav links
        links.forEach((l) => {
          const match = l.getAttribute('href') === `#${id}`;
          l.classList.toggle('active', match);
          if (match) updateIndicator(l);
        });

        // Update right-edge tracker dots
        dots.forEach((dot) => {
          const match = dot.getAttribute('data-target') === `#${id}`;
          dot.classList.toggle('active', match);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-10% 0px -40% 0px' });

  sections.forEach((s) => observer.observe(s));

  // Right-edge dot click to scroll
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const targetEl = document.querySelector(targetId);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Mobile menu toggle
  if (hamburger && mobileCurtain) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileCurtain.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      document.body.classList.toggle('scroll-locked', isOpen);
    });

    mobileLinks.forEach((l) => {
      l.addEventListener('click', () => {
        mobileCurtain.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.classList.remove('scroll-locked');
      });
    });
  }

  // Initial indicator position
  window.addEventListener('load', () => {
    const firstActive = document.querySelector('.nav-links a.active') || links[0];
    if (firstActive) updateIndicator(firstActive);
  });
}

/* ── 5. PINNED 3D HERO CANVAS SEQUENCER ──────────────────────── */
function initHeroCanvas() {
  const track = document.querySelector('.hero-track');
  const canvas = document.querySelector('.hero-canvas');
  if (!track || !canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth < 768;
  const basePath = isMobile ? AURELIA_CONFIG.hero.mobilePath : AURELIA_CONFIG.hero.desktopPath;
  const totalFrames = isMobile ? AURELIA_CONFIG.hero.mobileCount : AURELIA_CONFIG.hero.desktopCount;
  
  const frames = new Array(totalFrames);
  let curFrame = 0;
  let targetFrame = 0;
  let rafId = null;

  // Fallback poster image
  const posterImg = new Image();
  posterImg.src = AURELIA_CONFIG.hero.posterPath;

  // Cover-fit image calculation
  const drawImageCover = (img) => {
    if (!img || !img.complete || img.naturalWidth === 0) return false;
    const canW = canvas.width;
    const canH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;
    const canAspect = canW / canH;

    let sx, sy, sW, sH;
    if (imgAspect > canAspect) {
      sH = imgH;
      sW = imgH * canAspect;
      sy = 0;
      sx = (imgW - sW) / 2;
    } else {
      sW = imgW;
      sH = imgW / canAspect;
      sx = 0;
      sy = (imgH - sH) / 2;
    }

    ctx.clearRect(0, 0, canW, canH);
    ctx.drawImage(img, sx, sy, sW, sH, 0, 0, canW, canH);
    return true;
  };

  // Render current frame or closest loaded neighbour
  const render = () => {
    const idx = Math.round(clamp(curFrame, 0, totalFrames - 1));
    let img = frames[idx];

    // Find nearest loaded frame if target frame is downloading
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 35; offset++) {
        const prev = frames[idx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) { img = prev; break; }
        const next = frames[idx + offset];
        if (next && next.complete && next.naturalWidth > 0) { img = next; break; }
      }
    }

    if (!drawImageCover(img)) {
      drawImageCover(posterImg);
    }
  };

  // Resize canvas to full viewport
  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, AURELIA_CONFIG.hero.dprCap);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    render();
  };

  // RAF loop with smoothing
  const tick = () => {
    const prev = curFrame;
    curFrame = lerp(prev, targetFrame, 1 - AURELIA_CONFIG.hero.smoothing);
    if (Math.abs(curFrame - prev) > 0.02) {
      render();
    }
    rafId = requestAnimationFrame(tick);
  };

  // Preload initial frames, then stream the rest
  const loadFrames = () => {
    const initialBatch = Math.min(25, totalFrames);
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `${basePath}${padNum(i + 1)}.webp`;
      frames[i] = img;
      if (i === 0) {
        img.onload = () => render();
      }
    }
  };

  // Step text watcher
  const steps = [
    { from: 0.00, to: 0.30 },
    { from: 0.35, to: 0.65 },
    { from: 0.70, to: 0.98 }
  ];
  const stepElements = document.querySelectorAll('.hero-step');
  const scrollHint = document.querySelector('.hero-scroll-hint');

  const updateScrollProgress = () => {
    const rect = track.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    if (maxScroll <= 0) return;

    const progress = clamp(-rect.top / maxScroll, 0, 1);
    targetFrame = progress * (totalFrames - 1);

    // Update steps
    stepElements.forEach((el, idx) => {
      const s = steps[idx];
      const active = s && progress >= s.from && progress <= s.to;
      el.classList.toggle('active', active);
    });

    // Hide scroll hint once scrolled
    if (scrollHint) {
      scrollHint.classList.toggle('hidden', progress > 0.04);
    }
  };

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  resizeCanvas();
  loadFrames();
  tick();
  updateScrollProgress();
}

/* ── 6. BENTO GALLERY & CINEMATIC LIGHTBOX ────────────────────── */
function initBentoGallery() {
  const tiles = document.querySelectorAll('.bento-tile');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const filterPill = document.querySelector('.gallery-filter-pill');

  // 1. Sliding Filter Pill
  const updateFilterPill = (btn) => {
    if (!filterPill || !btn) return;
    const btnRect = btn.getBoundingClientRect();
    const parentRect = btn.parentElement.getBoundingClientRect();
    filterPill.style.left = `${btnRect.left - parentRect.left}px`;
    filterPill.style.width = `${btnRect.width}px`;
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      updateFilterPill(btn);

      const category = btn.getAttribute('data-category');
      tiles.forEach((tile) => {
        const tileCat = tile.getAttribute('data-category');
        const match = category === 'all' || tileCat === category;
        tile.classList.toggle('filtered-out', !match);
      });
    });
  });

  const activeBtn = document.querySelector('.gallery-filter-btn.active') || filterBtns[0];
  if (activeBtn) updateFilterPill(activeBtn);

  // 2. 3D Tilt with Specular Moving Glare (Desktop only)
  if (window.matchMedia('(min-width: 1025px)').matches) {
    tiles.forEach((tile) => {
      const glare = tile.querySelector('.bento-glare');
      
      tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width - 0.5);
        const yPct = (y / rect.height - 0.5);

        const rotateX = -yPct * AURELIA_CONFIG.gallery.maxTiltDeg;
        const rotateY = xPct * AURELIA_CONFIG.gallery.maxTiltDeg;

        tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        if (glare) {
          tile.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
          tile.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        }
      });

      tile.addEventListener('mouseleave', () => {
        tile.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // 3. Cinematic Lightbox with Swipe, Keyboard & Thumbnails
  const lightbox = document.querySelector('.lightbox-overlay');
  if (!lightbox) return;

  const mainImg = lightbox.querySelector('.lightbox-main-img');
  const captionText = lightbox.querySelector('.lightbox-caption-text');
  const counter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const thumbsContainer = lightbox.querySelector('.lightbox-thumbs');

  // Build gallery data from tiles
  const galleryData = Array.from(tiles).map((t) => ({
    src: t.querySelector('img').getAttribute('src'),
    title: t.querySelector('.bento-caption-title')?.textContent || 'Aurelia Hotel',
    alt: t.querySelector('img').getAttribute('alt') || '',
  }));

  let currentIndex = 0;

  // Build thumbnails
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    galleryData.forEach((item, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `lightbox-thumb ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy">`;
      thumb.addEventListener('click', () => showLightboxIndex(idx));
      thumbsContainer.appendChild(thumb);
    });
  }

  const showLightboxIndex = (index) => {
    currentIndex = clamp(index, 0, galleryData.length - 1);
    const item = galleryData[currentIndex];
    if (!item) return;

    if (mainImg) mainImg.src = item.src;
    if (captionText) captionText.textContent = item.title;
    if (counter) counter.textContent = `${padNum(currentIndex + 1, 2)} / ${padNum(galleryData.length, 2)}`;

    // Update thumbnail active ring
    const thumbs = thumbsContainer?.querySelectorAll('.lightbox-thumb');
    thumbs?.forEach((th, i) => th.classList.toggle('active', i === currentIndex));
  };

  const openLightbox = (index) => {
    showLightboxIndex(index);
    lightbox.classList.add('active');
    document.body.classList.add('scroll-locked');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('scroll-locked');
  };

  tiles.forEach((tile, idx) => {
    tile.addEventListener('click', () => openLightbox(idx));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showLightboxIndex(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showLightboxIndex(currentIndex + 1));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxIndex(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightboxIndex(currentIndex + 1);
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) showLightboxIndex(currentIndex - 1);
      else showLightboxIndex(currentIndex + 1);
    }
  }, { passive: true });
}

/* ── 7. GUEST VOICES (3D DRAGGABLE STACKED CAROUSEL) ─────────── */
function initVoicesCarousel() {
  const stage = document.querySelector('.voices-stage');
  const cards = document.querySelectorAll('.voices-card');
  const progressBar = document.querySelector('.carousel-progress-bar');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const ratingCounter = document.querySelector('.aggregate-score');

  if (!stage || cards.length === 0) return;

  let activeIndex = 0;
  let autoTimer = null;
  let progressTimer = null;
  const count = cards.length;

  const updateCardStack = () => {
    cards.forEach((card, i) => {
      card.classList.remove('card-active', 'card-prev', 'card-next', 'card-hidden');

      if (i === activeIndex) {
        card.classList.add('card-active');
        // Trigger sequential star fill
        card.classList.add('active');
      } else if (i === (activeIndex - 1 + count) % count) {
        card.classList.add('card-prev');
        card.classList.remove('active');
      } else if (i === (activeIndex + 1) % count) {
        card.classList.add('card-next');
        card.classList.remove('active');
      } else {
        card.classList.add('card-hidden');
        card.classList.remove('active');
      }
    });

    // Reset progress line
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      setTimeout(() => {
        progressBar.style.transition = `width ${AURELIA_CONFIG.carousel.autoAdvanceMs}ms linear`;
        progressBar.style.width = '100%';
      }, 50);
    }
  };

  const nextCard = () => {
    activeIndex = (activeIndex + 1) % count;
    updateCardStack();
  };

  const prevCard = () => {
    activeIndex = (activeIndex - 1 + count) % count;
    updateCardStack();
  };

  const startAutoAdvance = () => {
    stopAutoAdvance();
    autoTimer = setInterval(nextCard, AURELIA_CONFIG.carousel.autoAdvanceMs);
  };

  const stopAutoAdvance = () => {
    if (autoTimer) clearInterval(autoTimer);
  };

  if (prevBtn) prevBtn.addEventListener('click', () => { prevCard(); startAutoAdvance(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextCard(); startAutoAdvance(); });

  // Pause on hover or touch
  stage.addEventListener('mouseenter', stopAutoAdvance);
  stage.addEventListener('mouseleave', startAutoAdvance);

  // Drag / Swipe with spring physics
  let startX = 0;
  let isDragging = false;

  const handleDragStart = (x) => {
    startX = x;
    isDragging = true;
    stage.classList.add('grabbing');
    stopAutoAdvance();
  };

  const handleDragEnd = (x) => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('grabbing');
    const diff = x - startX;
    if (diff > AURELIA_CONFIG.carousel.dragThreshold) prevCard();
    else if (diff < -AURELIA_CONFIG.carousel.dragThreshold) nextCard();
    startAutoAdvance();
  };

  stage.addEventListener('mousedown', (e) => handleDragStart(e.clientX));
  window.addEventListener('mouseup', (e) => handleDragEnd(e.clientX));
  stage.addEventListener('touchstart', (e) => handleDragStart(e.changedTouches[0].clientX), { passive: true });
  stage.addEventListener('touchend', (e) => handleDragEnd(e.changedTouches[0].clientX), { passive: true });

  // Aggregate rating count-up animation (0.0 to 4.9)
  if (ratingCounter) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let current = 0.0;
          const target = 4.9;
          const duration = 1400;
          const startTime = performance.now();

          const animateCount = (now) => {
            const elapsed = now - startTime;
            const progress = clamp(elapsed / duration, 0, 1);
            const val = (progress * target).toFixed(1);
            ratingCounter.textContent = val;
            if (progress < 1) requestAnimationFrame(animateCount);
          };
          requestAnimationFrame(animateCount);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(ratingCounter);
  }

  updateCardStack();
  startAutoAdvance();
}

/* ── 8. CONTACT ACTIONS, IST TIME & BOOKING FORM ─────────────── */
function initContactSection() {
  const toast = document.querySelector('.toast-notice');
  const copyButtons = document.querySelectorAll('.btn-copy');
  const statusChipText = document.querySelector('.status-chip-time');

  // 1. Toast Notification Helper
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  // 2. Copy to Clipboard
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-copy');
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`Copied ${val} to clipboard`);
        });
      }
    });
  });

  // 3. Local Time & Front Desk Status in IST (UTC+5:30)
  const updateISTStatus = () => {
    if (!statusChipText) return;
    const now = new Date();
    // Convert to IST
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));
    const hours = istTime.getHours();
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    const isOpen = hours >= 7 && hours < 23;
    const statusText = isOpen ? 'Concierge Open' : 'After-hours Desk Active';
    statusChipText.textContent = `${statusText} · ${displayHours}:${minutes} ${ampm} IST`;
  };
  updateISTStatus();
  setInterval(updateISTStatus, 60000);

  // 4. Guest Stepper
  const stepperMinus = document.querySelector('.stepper-minus');
  const stepperPlus = document.querySelector('.stepper-plus');
  const stepperValue = document.querySelector('.stepper-value');
  let guestCount = 2;

  if (stepperMinus && stepperPlus && stepperValue) {
    stepperMinus.addEventListener('click', () => {
      guestCount = Math.max(1, guestCount - 1);
      stepperValue.textContent = `${guestCount} Guest${guestCount > 1 ? 's' : ''}`;
    });
    stepperPlus.addEventListener('click', () => {
      guestCount = Math.min(6, guestCount + 1);
      stepperValue.textContent = `${guestCount} Guests`;
    });
  }

  // 5. Booking Form Submission (morphs to checkmark & opens WhatsApp)
  const form = document.querySelector('.enquiry-form');
  const submitBtn = document.querySelector('.btn-submit-morph');

  if (form && submitBtn) {
    // Set min date to today for checkin
    const checkinInput = form.querySelector('#checkin');
    const checkoutInput = form.querySelector('#checkout');
    const today = new Date().toISOString().split('T')[0];
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name')?.value || 'Guest';
      const checkin = checkinInput?.value || 'Flexible';
      const checkout = checkoutInput?.value || 'Flexible';
      const room = form.querySelector('#room-select')?.value || 'Suite';

      // Validation
      if (checkinInput && checkoutInput && checkinInput.value && checkoutInput.value) {
        if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
          showToast('Check-out date must be after check-in date');
          return;
        }
      }

      // Morph button to checkmark
      submitBtn.classList.add('success');
      submitBtn.innerHTML = `<span>✓ Enquiry Sent</span>`;

      // Build WhatsApp Enquiry URL
      const text = `Hello Aurelia Hotel! My name is ${name}. I'd like to check availability for the ${room} from ${checkin} to ${checkout} (${guestCount} guests). Thank you.`;
      const cleanPhone = AURELIA_CONFIG.contact.whatsappNumber.replace(/\D/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener');
        setTimeout(() => {
          submitBtn.classList.remove('success');
          submitBtn.innerHTML = `<span>Submit Reservation Request</span> <span>→</span>`;
        }, 3000);
      }, 700);
    });
  }
}

/* ── 9. AMBIENT WEB AUDIO SEA WAVES SYNTHESIZER ──────────────── */
function initAmbientSound() {
  const toggleBtn = document.querySelector('.sound-toggle-btn');
  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;

  const startOceanWaves = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    // 1. Generate 5 seconds of pink noise in a looping buffer
    const bufferSize = audioCtx.sampleRate * 5;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    // 2. Low-pass filter to shape ocean water frequency
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, audioCtx.currentTime);

    // 3. LFO to swell the filter and gain like breathing ocean waves
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(1 / AURELIA_CONFIG.audio.swellPeriodSec, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(260, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // 4. Master volume control with fade-in
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(AURELIA_CONFIG.audio.maxVolume, audioCtx.currentTime + 2.5);

    whiteNoiseSource.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    whiteNoiseSource.start(0);
    lfo.start(0);
  };

  const stopOceanWaves = () => {
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        if (audioCtx) audioCtx.close();
        audioCtx = null;
      }, 1300);
    }
  };

  toggleBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    toggleBtn.classList.toggle('playing', isPlaying);
    toggleBtn.setAttribute('aria-pressed', isPlaying);
    if (isPlaying) startOceanWaves();
    else stopOceanWaves();
  });
}

/* ── 10. DRIFTING FIREFLIES / LANTERNS CANVAS ────────────────── */
function initFireflies() {
  const canvas = document.querySelector('.fireflies-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  const particles = Array.from({ length: AURELIA_CONFIG.particles.count }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.2 + 1,
    alpha: Math.random() * 0.7 + 0.3,
    speedY: Math.random() * 0.35 + 0.15,
    swaySpeed: Math.random() * 0.02 + 0.01,
    swayOffset: Math.random() * Math.PI * 2,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.swayOffset += p.swaySpeed;
      const x = p.x + Math.sin(p.swayOffset) * 1.5;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = AURELIA_CONFIG.particles.glowColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#F5E6C8';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  draw();
}

/* ── 11. FAQ ACCORDION ───────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach((i) => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });
}

/* ── 12. FLOATING WHATSAPP BUTTON & SINGLE 8S TOOLTIP ────────── */
function initWhatsAppTooltip() {
  const tooltip = document.querySelector('.whatsapp-tooltip');
  if (!tooltip) return;

  const shown = sessionStorage.getItem('aurelia_wa_tooltip');
  if (!shown) {
    setTimeout(() => {
      tooltip.classList.add('show');
      sessionStorage.setItem('aurelia_wa_tooltip', 'true');
      setTimeout(() => tooltip.classList.remove('show'), 6000);
    }, 8000);
  }
}

/* ── 13. EDITORIAL LOADING CURTAIN SEQUENCE ──────────────────── */
function initLoadingCurtain() {
  const curtain = document.querySelector('.curtain-overlay');
  const progress = document.querySelector('.curtain-hairline-progress');
  const maskTexts = document.querySelectorAll('.curtain-mask-text');

  if (!curtain || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (curtain) curtain.style.display = 'none';
    return;
  }

  // Animate progress and typography
  setTimeout(() => {
    if (progress) progress.classList.add('animating');
    maskTexts.forEach((t) => t.classList.add('revealed'));
  }, 200);

  // Trigger lift-off
  setTimeout(() => {
    curtain.classList.add('is-ready');
    curtain.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') {
        curtain.classList.add('is-hidden');
      }
    });
  }, 2200);
}

/* ── 14. GLOBAL INITIALIZATION ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoadingCurtain();
  initTimeOfDayScroll();
  initNavigation();
  initHeroCanvas();
  initBentoGallery();
  initVoicesCarousel();
  initContactSection();
  initAmbientSound();
  initFireflies();
  initFAQ();
  initWhatsAppTooltip();
});
