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
const debounce = (fn, delay = 100) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

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

  const ctx = canvas.getContext('2d', { alpha: false });
  const isMobile = window.innerWidth < 768;
  const basePath = isMobile ? AURELIA_CONFIG.hero.mobilePath : AURELIA_CONFIG.hero.desktopPath;
  const totalFrames = isMobile ? AURELIA_CONFIG.hero.mobileCount : AURELIA_CONFIG.hero.desktopCount;
  
  const frames = new Array(totalFrames);
  const loadedSet = new Set();
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

  // Find best loaded frame: exact index first, then closest available neighbor
  const getBestFrame = (idx) => {
    if (loadedSet.has(idx)) return frames[idx];
    for (let offset = 1; offset < totalFrames; offset++) {
      const prev = idx - offset;
      if (prev >= 0 && loadedSet.has(prev)) return frames[prev];
      const next = idx + offset;
      if (next < totalFrames && loadedSet.has(next)) return frames[next];
    }
    return posterImg;
  };

  // Render current frame or closest loaded neighbour
  const render = () => {
    const idx = Math.round(clamp(curFrame, 0, totalFrames - 1));
    const img = getBestFrame(idx);
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

  // Request single frame on demand with async decoding
  const requestFrame = (idx) => {
    if (idx < 0 || idx >= totalFrames || frames[idx]) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = `${basePath}${padNum(idx + 1)}.webp`;
    img.onload = () => {
      loadedSet.add(idx);
      // Re-render if close to current frame
      if (Math.abs(curFrame - idx) <= 1.5) {
        render();
      }
    };
    frames[idx] = img;
  };

  // Progressive preloader: Milestone checkpoints first, then prioritize current view
  const loadFrames = () => {
    // 1. Initial immediate start batch
    const initialBatch = Math.min(10, totalFrames);
    for (let i = 0; i < initialBatch; i++) {
      requestFrame(i);
    }

    // 2. Global milestone checkpoints (every 5th frame on mobile) across the whole video
    // This guarantees no matter how fast user scrolls on mobile, there's always a frame within 2-3 frames!
    const stepSize = isMobile ? 5 : 8;
    for (let i = initialBatch; i < totalFrames; i += stepSize) {
      requestFrame(i);
    }
    requestFrame(totalFrames - 1); // final frame

    // 3. Stream remaining intermediate frames in background
    let bgIndex = 0;
    const streamRest = () => {
      let count = 0;
      while (bgIndex < totalFrames && count < 4) {
        if (!frames[bgIndex]) {
          requestFrame(bgIndex);
          count++;
        }
        bgIndex++;
      }
      if (bgIndex < totalFrames) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(streamRest);
        } else {
          setTimeout(streamRest, 40);
        }
      }
    };
    setTimeout(streamRest, 200);
  };

  // Proactively fetch a window of frames ahead of target scroll
  const prioritizeWindow = (centerIdx) => {
    const start = Math.max(0, centerIdx - 4);
    const end = Math.min(totalFrames - 1, centerIdx + 12);
    for (let i = start; i <= end; i++) {
      requestFrame(i);
    }
  };

  // RAF loop with responsive smoothing
  const tick = () => {
    const prev = curFrame;
    // On mobile, use faster lerp (0.35) so frames follow finger with zero lag.
    // On desktop, use smooth luxury ease (0.16).
    const lerpFactor = isMobile ? 0.35 : (1 - AURELIA_CONFIG.hero.smoothing);
    curFrame = lerp(prev, targetFrame, lerpFactor);
    if (Math.abs(curFrame - prev) > 0.01) {
      render();
    }
    rafId = requestAnimationFrame(tick);
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

    // Prioritize downloading frames around current position
    prioritizeWindow(Math.round(targetFrame));

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
  window.addEventListener('touchmove', updateScrollProgress, { passive: true });

  resizeCanvas();
  loadFrames();
  tick();
  updateScrollProgress();
}

/* ── 6. 3D HORIZON REEL GALLERY & CINEMATIC LIGHTBOX ───────────── */
function init3DHorizonReelAndLightbox() {
  const container = document.getElementById('cylinderViewport');
  const track = document.getElementById('cylinderTrack');
  const prevBtn = document.getElementById('reelPrevBtn');
  const nextBtn = document.getElementById('reelNextBtn');
  const lightbox = document.querySelector('.lightbox-overlay');

  const HOTEL_IMAGES = [
    { src: './images/gallery-1.webp', title: 'Infinity Pool at Dusk', cat: 'Wellness · Horizon' },
    { src: './images/room-cliff-suite.webp', title: 'The Cliff Suite', cat: 'Rooms · Oceanfront' },
    { src: './images/gallery-3.webp', title: 'Cliffside Dining', cat: 'Dining · Evening' },
    { src: './images/gallery-5.webp', title: 'Ayurvedic Sanctuary', cat: 'Wellness · Spa' },
    { src: './images/gallery-4.webp', title: 'Varkala Cliff Sunrise', cat: 'Views · Coastline' },
    { src: './images/gallery-2.webp', title: 'Heritage Room', cat: 'Rooms · Laterite' },
    { src: './images/gallery-6.webp', title: 'Terrace Breakfast', cat: 'Dining · Morning' },
    { src: './images/about.webp', title: 'Aurelia Architecture', cat: 'Resort · Malabar' },
    { src: './images/room-garden-villa.webp', title: 'Garden Villa', cat: 'Rooms · Botanical' },
    { src: './images/room-sea-breeze.webp', title: 'Sea Breeze Room', cat: 'Rooms · Balcony' }
  ];

  if (!container || !track) return;

  const total = HOTEL_IMAGES.length;
  let currentRotation = 0;
  let targetRotation = 0;
  let isHovered = false;
  let isDragging = false;
  let startX = 0;
  let dragStartRot = 0;
  let dragDistance = 0;

  // Responsive radius calculation
  const getRadius = () => {
    const w = container.clientWidth || 1000;
    if (w < 600) return 420;
    if (w < 1024) return 650;
    return Math.min(1100, Math.max(820, w * 0.68));
  };

  const renderCards = () => {
    const radius = getRadius();
    track.innerHTML = '';

    HOTEL_IMAGES.forEach((item, i) => {
      const angle = (i / total) * 360;
      const card = document.createElement('div');
      card.className = 'cylinder-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View ${item.title}`);

      // 3D inward cylindrical placement
      card.style.transform = `rotateY(${angle}deg) translateZ(-${radius}px)`;

      card.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async" />
        <div class="cylinder-card-glass">
          <span class="cylinder-card-cat">${item.cat}</span>
          <h4 class="cylinder-card-title">${item.title}</h4>
        </div>
      `;

      card.addEventListener('click', () => {
        if (Math.abs(dragDistance) > 6) return;
        openLightbox(i);
      });

      track.appendChild(card);
    });
  };

  renderCards();

  window.addEventListener('resize', debounce(() => {
    renderCards();
  }, 150));

  // 60fps Smooth animation loop
  const speed = 0.16; // degrees per frame
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tickReel = () => {
    if (!isHovered && !isDragging && !isReducedMotion) {
      targetRotation -= speed;
    }
    // Buttery interpolation towards target
    currentRotation += (targetRotation - currentRotation) * 0.12;
    track.style.transform = `rotateY(${currentRotation}deg)`;
    requestAnimationFrame(tickReel);
  };
  requestAnimationFrame(tickReel);

  // Hover detection
  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => { isHovered = false; });

  // Arrow button navigation (rotates by 1 card step = 36 deg)
  const stepAngle = 360 / total;
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      targetRotation += stepAngle;
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      targetRotation -= stepAngle;
    });
  }

  // Pointer drag support (Mouse & Touch)
  container.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.reel-nav-btn')) return;
    isDragging = true;
    startX = e.clientX;
    dragStartRot = targetRotation;
    dragDistance = 0;
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    dragDistance = diff;
    targetRotation = dragStartRot + diff * 0.28;
  });

  window.addEventListener('pointerup', () => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  });

  // ── CINEMATIC LIGHTBOX MODAL ────────────────────────────────
  if (!lightbox) return;

  const mainImg = lightbox.querySelector('.lightbox-main-img');
  const captionText = lightbox.querySelector('.lightbox-caption-text');
  const counter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const lbPrevBtn = lightbox.querySelector('.lightbox-prev');
  const lbNextBtn = lightbox.querySelector('.lightbox-next');
  const thumbsContainer = lightbox.querySelector('.lightbox-thumbs');

  let currentLbIndex = 0;

  // Build thumbnails
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    HOTEL_IMAGES.forEach((item, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `lightbox-thumb ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${item.src}" alt="${item.title}" loading="lazy">`;
      thumb.addEventListener('click', () => showLightboxIndex(idx));
      thumbsContainer.appendChild(thumb);
    });
  }

  const showLightboxIndex = (index) => {
    currentLbIndex = (index + HOTEL_IMAGES.length) % HOTEL_IMAGES.length;
    const item = HOTEL_IMAGES[currentLbIndex];
    if (!item) return;

    if (mainImg) mainImg.src = item.src;
    if (captionText) captionText.textContent = `${item.title} — ${item.cat}`;
    if (counter) counter.textContent = `${padNum(currentLbIndex + 1, 2)} / ${padNum(HOTEL_IMAGES.length, 2)}`;

    const thumbs = thumbsContainer?.querySelectorAll('.lightbox-thumb');
    thumbs?.forEach((th, i) => th.classList.toggle('active', i === currentLbIndex));
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

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lbPrevBtn) lbPrevBtn.addEventListener('click', () => showLightboxIndex(currentLbIndex - 1));
  if (lbNextBtn) lbNextBtn.addEventListener('click', () => showLightboxIndex(currentLbIndex + 1));

  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxIndex(currentLbIndex - 1);
    if (e.key === 'ArrowRight') showLightboxIndex(currentLbIndex + 1);
  });

  let lbTouchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - lbTouchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) showLightboxIndex(currentLbIndex - 1);
      else showLightboxIndex(currentLbIndex + 1);
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

/* ── 12. FLOATING GOLDEN PARTICLES FOR DEEP OCEAN TEAL SECTIONS ── */
function initGoldenParticles() {
  const canvases = document.querySelectorAll('.golden-particles-canvas');
  if (!canvases.length) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.offsetWidth : window.innerWidth;
      height = parent ? parent.offsetHeight : window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(50, Math.max(22, Math.floor((width * height) / 24000)));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          speedY: Math.random() * 0.55 + 0.25, // upward drift from bottom to top
          swaySpeed: Math.random() * 0.02 + 0.01,
          swayAngle: Math.random() * Math.PI * 2,
          swayDist: Math.random() * 1.2 + 0.4,
          baseAlpha: Math.random() * 0.45 + 0.3,
          alpha: 0.5,
          hue: Math.random() * 14 + 42 // warm yellow to rich radiant gold
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!isReducedMotion) {
          p.y -= p.speedY;
          p.swayAngle += p.swaySpeed;
          p.x += Math.sin(p.swayAngle) * p.swayDist;
          p.alpha = p.baseAlpha + Math.sin(p.swayAngle * 2) * 0.2;

          // Wrap around when exiting the top
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 68%, ${Math.max(0.1, p.alpha)})`;
        ctx.shadowColor = `hsla(${p.hue}, 95%, 72%, 0.75)`;
        ctx.shadowBlur = p.radius * 6;
        ctx.fill();
        ctx.restore();
      });

      if (!isReducedMotion) {
        requestAnimationFrame(render);
      }
    };

    resize();
    render();

    window.addEventListener('resize', debounce(() => {
      resize();
      if (isReducedMotion) render();
    }, 200));
  });
}

/* ── 12b. LUXURY CUSTOM ROOM SELECTOR WITH THUMBNAILS ────────── */
function initRoomSelector() {
  const selector = document.querySelector('.luxury-room-selector');
  const trigger = document.getElementById('roomSelectorTrigger');
  const content = document.getElementById('roomTriggerContent');
  const menu = document.getElementById('roomDropdownMenu');
  const hiddenInput = document.getElementById('room-select');
  const options = document.querySelectorAll('.room-opt');

  if (!selector || !trigger || !content || !menu || !hiddenInput) return;

  const toggleDropdown = (open) => {
    const isOpen = typeof open === 'boolean' ? open : !selector.classList.contains('active');
    selector.classList.toggle('active', isOpen);
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menu.style.display = isOpen ? 'flex' : 'none';
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      toggleDropdown(false);
    }
  });

  options.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = opt.getAttribute('data-value') || '';
      const name = opt.getAttribute('data-name') || '';
      const price = opt.getAttribute('data-price') || '';
      const img = opt.getAttribute('data-img') || '';

      hiddenInput.value = val;

      content.innerHTML = `
        <div class="room-trigger-selected">
          <img src="${img}" alt="${name}" class="room-trigger-thumb" />
          <div>
            <span class="room-trigger-name">${name}</span> &nbsp;
            <span class="room-trigger-price">(${price})</span>
          </div>
        </div>
      `;

      options.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');

      toggleDropdown(false);

      // Dispatch change event on hidden input for form validation listeners
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) {
      toggleDropdown(false);
    }
  });
}

/* ── 12c. AURELIA AI CONCIERGE ASSISTANT ─────────────────────── */
function initAIAssistant() {
  const btn = document.getElementById('aiAssistantBtn');
  const chatWindow = document.getElementById('aiChatWindow');
  const closeBtn = document.getElementById('aiChatClose');
  const messagesContainer = document.getElementById('aiChatMessages');
  const chips = document.querySelectorAll('.ai-chip');
  const form = document.getElementById('aiChatForm');
  const input = document.getElementById('aiChatInput');

  if (!btn || !chatWindow || !closeBtn || !messagesContainer || !form || !input) return;

  const toggleChat = (open) => {
    const isVisible = typeof open === 'boolean' ? open : chatWindow.style.display !== 'flex';
    chatWindow.style.display = isVisible ? 'flex' : 'none';
    btn.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
    if (isVisible) {
      setTimeout(() => input.focus(), 150);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  btn.addEventListener('click', () => toggleChat());
  closeBtn.addEventListener('click', () => toggleChat(false));

  const appendMessage = (text, sender = 'bot') => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg-${sender}`;
    msgDiv.innerHTML = `<div class="ai-msg-bubble">${text}</div>`;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
  };

  const getAureliaResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('price') || q.includes('suite') || q.includes('room') || q.includes('cost') || (q.includes('stay') && q.includes('type'))) {
      return `Aurelia offers 4 handcrafted ocean-facing sanctuaries:
<br><br>
✦ <strong>The Cliff Suite</strong> (₹18,500/night) — Oceanfront plunge pool &amp; panoramic Arabian Sea views.<br>
✦ <strong>Garden Villa</strong> (₹12,500/night) — Secluded cottage with private spice garden &amp; stone rain shower.<br>
✦ <strong>Heritage Room</strong> (₹9,800/night) — Exposed laterite stone, teakwood &amp; copper bath.<br>
✦ <strong>Sea Breeze Room</strong> (₹6,500/night) — Coastal trade winds with private sea-view balcony.<br><br>
You can select your suite in our Request Stay form below!`;
    }

    if (q.includes('dining') || q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('menu') || q.includes('catch')) {
      return `Our culinary philosophy celebrates the Malabar coast. We source fresh morning catamaran catch, traditional cold-pressed coconut curries with Malabar tamarind, and host sunset cocktail evenings at our cliffside <strong>Sundowner Bar</strong> overlooking the sea.`;
    }

    if (q.includes('spa') || q.includes('ayurvedic') || q.includes('massage') || q.includes('wellness')) {
      return `Our <strong>Ayurvedic Sanctuary</strong> offers classical Kerala wellness rituals using organic herbal oils, soothing cliffside Shirodhara, and Abhyanga massages timed to the evening rhythm of breaking ocean waves.`;
    }

    if (q.includes('book') || q.includes('reserve') || q.includes('reservation') || q.includes('contact') || q.includes('phone')) {
      return `You can submit a reservation inquiry right on this page under <strong>Request Your Stay</strong>. Alternatively, contact our concierge directly at <a href="tel:+916369403544" style="color: var(--color-antique-gold); text-decoration: underline;">+91 63694 03544</a> or <a href="mailto:hello@aureliahotel.com" style="color: var(--color-antique-gold); text-decoration: underline;">hello@aureliahotel.com</a>.`;
    }

    if (q.includes('location') || q.includes('where') || q.includes('varkala') || q.includes('airport') || q.includes('reach')) {
      return `Aurelia Hotel is perched 30 metres atop the red laterite cliffs of Varkala, Kerala, overlooking the pristine Arabian Sea. Trivandrum International Airport (TRV) is approximately 50 minutes away by scenic coastal drive. We provide private airport chauffeurs upon request.`;
    }

    if (q.includes('check') || q.includes('time') || q.includes('policy')) {
      return `Check-in is from <strong>2:00 PM</strong> and check-out is at <strong>11:00 AM</strong>. Early check-in and late sunset check-out are warmly accommodated based on suite availability.`;
    }

    return `Thank you for your enquiry. Perched above the Arabian Sea, Aurelia Hotel offers bespoke coastal stays, Ayurvedic wellness, and cliffside dining. Would you like to check suite availability, explore our dining, or plan private excursions?`;
  };

  const handleUserMessage = (text) => {
    if (!text.trim()) return;
    appendMessage(text, 'user');
    input.value = '';

    // Show temporary typing indicator
    const typingIndicator = appendMessage('✦ <em>Aurelia Concierge is preparing your details...</em>', 'bot');

    setTimeout(() => {
      typingIndicator.remove();
      const reply = getAureliaResponse(text);
      appendMessage(reply, 'bot');
    }, 600);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(input.value);
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent;
      handleUserMessage(prompt);
    });
  });
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
  init3DHorizonReelAndLightbox();
  initVoicesCarousel();
  initContactSection();
  initAmbientSound();
  initFireflies();
  initGoldenParticles();
  initRoomSelector();
  initAIAssistant();
  initFAQ();
});
