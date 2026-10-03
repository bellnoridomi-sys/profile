
/* =====================================
   BLACK AURA — INTERACTIONS & EFFECTS
===================================== */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// REVEAL ON SCROLL
const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("show"));
}

// CUSTOM CURSOR
const cursorDot = $(".cursor-dot");
const cursorRing = $(".cursor-ring");
const hasFinePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

let mouseX = -100;
let mouseY = -100;
let ringX = -100;
let ringY = -100;
let cursorVisible = false;

if (hasFinePointer && !reducedMotion) {
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorVisible = true;

    cursorDot.style.opacity = "1";
    cursorRing.style.opacity = "1";
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  document.addEventListener("mouseleave", () => {
    cursorVisible = false;
    cursorDot.style.opacity = "0";
    cursorRing.style.opacity = "0";
  });

  document.addEventListener("mouseover", (event) => {
    const target = event.target.closest(
      "a, button, .project-card, .skill-card"
    );
    cursorRing.classList.toggle("hover", !!target);
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

// 3D PARALLAX
const parallaxShapes = $$(".parallax-shape");
let pointerX = 0;
let pointerY = 0;
let parallaxX = 0;
let parallaxY = 0;

if (hasFinePointer && !reducedMotion) {
  document.addEventListener("mousemove", (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateParallax() {
    parallaxX += (pointerX - parallaxX) * 0.035;
    parallaxY += (pointerY - parallaxY) * 0.035;

    parallaxShapes.forEach((shape) => {
      const depth = Number(shape.dataset.depth) || 0.02;
      const moveX = parallaxX * window.innerWidth * depth;
      const moveY = parallaxY * window.innerHeight * depth;

      const rotation = parallaxX * 5;
      shape.style.translate = `${moveX}px ${moveY}px`;
      shape.style.rotate = `${rotation}deg`;
    });

    requestAnimationFrame(animateParallax);
  }

  animateParallax();
}


// HERO 3D POINTER PARALLAX
const hero3D = $(".hero-3d-stage");
if (hero3D && hasFinePointer && !reducedMotion) {
  let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;
  document.addEventListener("mousemove", (event) => {
    const rect = hero3D.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    targetRY = Math.max(-1, Math.min(1, x)) * 12;
    targetRX = Math.max(-1, Math.min(1, -y)) * 10;
  });

  function animateHero3D() {
    currentRX += (targetRX - currentRX) * 0.045;
    currentRY += (targetRY - currentRY) * 0.045;
    hero3D.style.transform = `translateY(-50%) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
    requestAnimationFrame(animateHero3D);
  }
  animateHero3D();
}

// 3D GIF BACKDROP POINTER PARALLAX
const gif3D = $(".hero-gif-3d");
if (gif3D && hasFinePointer && !reducedMotion) {
  let gifRX = 0, gifRY = 0, targetGifRX = 0, targetGifRY = 0;
  document.addEventListener("mousemove", (event) => {
    const rect = gif3D.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    targetGifRY = Math.max(-1, Math.min(1, x)) * 9;
    targetGifRX = Math.max(-1, Math.min(1, -y)) * 7;
  });

  function animateGif3D() {
    gifRX += (targetGifRX - gifRX) * 0.035;
    gifRY += (targetGifRY - gifRY) * 0.035;
    gif3D.style.transform = `translateY(-50%) rotateX(${gifRX}deg) rotateY(${gifRY}deg)`;
    requestAnimationFrame(animateGif3D);
  }
  animateGif3D();
}

// PROJECT / SKILL 3D TILT
if (hasFinePointer && !reducedMotion) {
  const tiltItems = $$(".project-card, .skill-card, .about-image-frame");
  tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const r = item.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - 0.5;
      const y = (event.clientY - r.top) / r.height - 0.5;
      item.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
      item.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
      item.style.setProperty("--mx", `${((x + .5) * 100).toFixed(1)}%`);
      item.style.setProperty("--my", `${((y + .5) * 100).toFixed(1)}%`);
      item.classList.add("tilt-active");
    });
    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
      item.classList.remove("tilt-active");
    });
  });
}

// PARTICLE BACKGROUND
const particleCanvas = $("#particles");
const particleCtx = particleCanvas.getContext("2d");

let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;
let particleAnimationId = null;
let particleDpr = Math.min(window.devicePixelRatio || 1, 2);

const particleSettings = {
  desktopCount: 75,
  mobileCount: 35,
  connectionDistance: 125,
  speed: 0.35
};

function resizeParticles() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  particleDpr = Math.min(window.devicePixelRatio || 1, 2);

  particleCanvas.width = canvasWidth * particleDpr;
  particleCanvas.height = canvasHeight * particleDpr;
  particleCanvas.style.width = `${canvasWidth}px`;
  particleCanvas.style.height = `${canvasHeight}px`;

  particleCtx.setTransform(
    particleDpr, 0, 0, particleDpr, 0, 0
  );

  const count = canvasWidth < 600
    ? particleSettings.mobileCount
    : particleSettings.desktopCount;

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * particleSettings.speed,
    vy: (Math.random() - 0.5) * particleSettings.speed,
    radius: Math.random() * 1.5 + 0.5
  }));
}

function getParticleColor() {
  return document.body.classList.contains("light")
    ? "0, 0, 0"
    : "255, 255, 255";
}

function drawParticles() {
  particleCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  const color = getParticleColor();
  const maxDistance = particleSettings.connectionDistance;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvasWidth) p.vx *= -1;
    if (p.y < 0 || p.y > canvasHeight) p.vy *= -1;

    particleCtx.beginPath();
    particleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    particleCtx.fillStyle = `rgba(${color}, .7)`;
    particleCtx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const other = particles[j];
      const dx = p.x - other.x;
      const dy = p.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.2;

        particleCtx.beginPath();
        particleCtx.moveTo(p.x, p.y);
        particleCtx.lineTo(other.x, other.y);
        particleCtx.strokeStyle =
          `rgba(${color}, ${opacity})`;
        particleCtx.lineWidth = 0.7;
        particleCtx.stroke();
      }
    }
  }

  if (!reducedMotion) {
    particleAnimationId = requestAnimationFrame(drawParticles);
  }
}

resizeParticles();
drawParticles();

window.addEventListener("resize", () => {
  cancelAnimationFrame(particleAnimationId);
  resizeParticles();
  if (!reducedMotion) drawParticles();
});

// DARK / LIGHT MODE
const themeBtn = $("#themeBtn");
const themeMeta = $('meta[name="theme-color"]');

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light", isLight);

  themeBtn.innerHTML = isLight
    ? `<svg viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.6">
         <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5
         8.5 8.5 0 1 0 20.5 15.5Z"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.6">
         <circle cx="12" cy="12" r="4"/>
         <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42
         M17.65 17.65l1.42 1.42M2 12h2M20 12h2
         M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>
       </svg>`;

  themeBtn.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );

  themeMeta.content = isLight ? "#f4f4f4" : "#080808";
}

let savedTheme = "dark";
try {
  savedTheme = localStorage.getItem("aura-theme") || "dark";
} catch (error) {
  console.warn("Theme storage unavailable");
}

applyTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light")
    ? "dark"
    : "light";

  applyTheme(nextTheme);

  try {
    localStorage.setItem("aura-theme", nextTheme);
  } catch (error) {
    console.warn("Could not save theme");
  }
});

// TYPING TEXT
const typingText = $("#typingText");
const typingWords = [
  "DIGITAL EXPERIENCES.",
  "CREATIVE WEBSITES.",
  "UNIQUE INTERACTIONS."
];

let typingWordIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;

function typeWriter() {
  const word = typingWords[typingWordIndex];

  typingText.textContent = word.substring(0, typingCharIndex);

  if (!isDeleting) {
    typingCharIndex++;

    if (typingCharIndex > word.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1400);
      return;
    }
  } else {
    typingCharIndex--;

    if (typingCharIndex < 0) {
      typingCharIndex = 0;
      isDeleting = false;
      typingWordIndex =
        (typingWordIndex + 1) % typingWords.length;
    }
  }

  setTimeout(typeWriter, isDeleting ? 35 : 75);
}

if (!reducedMotion) {
  typeWriter();
} else {
  typingText.textContent = typingWords[0];
}

// PROJECT CAROUSEL
const carouselTrack = $("#carouselTrack");
const carouselViewport = $("#carouselViewport");
const projectCards = $$(".project-card", carouselTrack);
const prevProject = $("#prevProject");
const nextProject = $("#nextProject");
const carouselCurrent = $("#carouselCurrent");
const carouselProgress = $("#carouselProgress");

let currentProject = 0;
let cardsPerPage = 1;
let maxProjectIndex = 0;
let carouselStartX = 0;

function updateCarouselSize() {
  if (!projectCards.length) return;

  const width = window.innerWidth;

  cardsPerPage = width <= 600 ? 1 : width <= 850 ? 2 : 3;
  maxProjectIndex = Math.max(
    0, projectCards.length - cardsPerPage
  );

  currentProject = Math.min(currentProject, maxProjectIndex);
  updateCarousel();
}

function updateCarousel() {
  if (!projectCards.length) return;

  const cardWidth = projectCards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
  const offset = currentProject * (cardWidth + gap);

  carouselTrack.style.transform = `translateX(-${offset}px)`;

  prevProject.disabled = currentProject === 0;
  nextProject.disabled = currentProject >= maxProjectIndex;

  carouselCurrent.textContent =
    String(currentProject + 1).padStart(2, "0");

  const progress = projectCards.length <= 1
    ? 100
    : ((currentProject + 1) / projectCards.length) * 100;

  carouselProgress.style.width = `${progress}%`;
}

prevProject.addEventListener("click", () => {
  currentProject = Math.max(0, currentProject - 1);
  updateCarousel();
});

nextProject.addEventListener("click", () => {
  currentProject = Math.min(
    maxProjectIndex, currentProject + 1
  );
  updateCarousel();
});

// Swipe on touch screens
carouselViewport.addEventListener("touchstart", (event) => {
  carouselStartX = event.touches[0].clientX;
}, { passive: true });

carouselViewport.addEventListener("touchend", (event) => {
  const endX = event.changedTouches[0].clientX;
  const delta = endX - carouselStartX;

  if (Math.abs(delta) > 45) {
    if (delta < 0 && currentProject < maxProjectIndex) {
      currentProject++;
    } else if (delta > 0 && currentProject > 0) {
      currentProject--;
    }
    updateCarousel();
  }
}, { passive: true });

window.addEventListener("resize", updateCarouselSize);
updateCarouselSize();

// ACTIVE NAVIGATION
const navLinks = $$(".nav-link");
const pageSections = $$(".section[id]");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  }, {
    rootMargin: "-35% 0px -55% 0px"
  });

  pageSections.forEach((section) => navObserver.observe(section));
}

// MOBILE MENU
const menuBtn = $("#menuBtn");
const navLinksContainer = $("#navLinks");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinksContainer.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.textContent = isOpen ? "×" : "☰";
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  });
});

// MUSIC + REAL AUDIO VISUALIZER
const music = $("#bgMusic");
const musicBtn = $("#musicBtn");
const musicLabel = $("#musicLabel");
const musicBars = $("#musicBars");
const visualizerWrap = $("#visualizerWrap");
const visualizerCanvas = $("#visualizer");
const visualizerCtx = visualizerCanvas.getContext("2d");

let audioContext = null;
let analyser = null;
let audioSource = null;
let frequencyData = null;
let visualizerFrame = null;

function setupAudio() {
  if (audioContext) return;

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error("Web Audio API is not supported");
  }

  audioContext = new AudioContextClass();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 128;
  analyser.smoothingTimeConstant = 0.82;

  audioSource = audioContext.createMediaElementSource(music);
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);

  frequencyData = new Uint8Array(analyser.frequencyBinCount);
}

function drawVisualizer() {
  if (!analyser || !frequencyData) return;

  const width = visualizerCanvas.clientWidth;
  const height = visualizerCanvas.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  if (
    visualizerCanvas.width !== Math.round(width * dpr) ||
    visualizerCanvas.height !== Math.round(height * dpr)
  ) {
    visualizerCanvas.width = Math.round(width * dpr);
    visualizerCanvas.height = Math.round(height * dpr);
  }

  visualizerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  visualizerCtx.clearRect(0, 0, width, height);
  analyser.getByteFrequencyData(frequencyData);

  const bars = 28;
  const gap = 3;
  const barWidth = (width - gap * (bars - 1)) / bars;
  const step = Math.max(
    1, Math.floor(frequencyData.length / bars)
  );

  const lightMode = document.body.classList.contains("light");
  const color = lightMode ? "#111111" : "#ffffff";

  for (let i = 0; i < bars; i++) {
    const value = frequencyData[i * step] / 255;
    const barHeight = Math.max(2, value * height * 0.9);
    const x = i * (barWidth + gap);
    const y = (height - barHeight) / 2;

    visualizerCtx.fillStyle = color;
    visualizerCtx.globalAlpha = 0.35 + value * 0.65;
    visualizerCtx.fillRect(
      x, y, barWidth, barHeight
    );
  }

  visualizerCtx.globalAlpha = 1;
  visualizerFrame = requestAnimationFrame(drawVisualizer);
}

function stopVisualizer() {
  if (visualizerFrame !== null) {
    cancelAnimationFrame(visualizerFrame);
    visualizerFrame = null;
  }

  visualizerCtx.clearRect(
    0, 0,
    visualizerCanvas.width,
    visualizerCanvas.height
  );
}

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      setupAudio();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      await music.play();

      musicBtn.classList.add("playing");
      musicLabel.textContent = "PAUSE MUSIC";
      visualizerWrap.classList.add("visible");

      if (!reducedMotion) {
        stopVisualizer();
        drawVisualizer();
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      musicLabel.textContent = "CHECK MUSIC FILE";
    }
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicLabel.textContent = "PLAY MUSIC";
    visualizerWrap.classList.remove("visible");
    stopVisualizer();
  }
});

music.addEventListener("ended", () => {
  musicBtn.classList.remove("playing");
  musicLabel.textContent = "PLAY MUSIC";
  visualizerWrap.classList.remove("visible");
  stopVisualizer();
});

// Respect browser tab visibility
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(particleAnimationId);
    stopVisualizer();
  } else {
    if (!reducedMotion) drawParticles();
    if (!music.paused && !reducedMotion) drawVisualizer();
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // 1. TỰ ĐỘNG BẬT NHẠC
  const audio = document.getElementById('bg-music');
  if (audio) {
    audio.play().catch(() => {
      // Nếu trình duyệt chặn autoplay, tự động phát ngay khi người dùng click bất kỳ đâu
      document.addEventListener('click', () => {
        audio.play();
      }, { once: true });
    });
  }

  // 2. HIỆU ỨNG CARD NGHIÊNG NHẸ THEO CON TRỎ CHUỘT
  const card = document.querySelector('.card');
  if (card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Tính toán độ nghiêng (tối đa 10 độ)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      // Trả card về vị trí ban đầu khi di chuột ra ngoài
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
});
// Bổ sung hiệu ứng nghiêng khi rê chuột vào các thẻ (Tilt Effect)
document.addEventListener('DOMContentLoaded', () => {
  const tiltElements = document.querySelectorAll('.tilt-effect');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
});