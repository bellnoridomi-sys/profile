
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
      musicBtn.setAttribute("aria-label", "Pause music");
      musicBtn.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "PAUSE MUSIC";
      visualizerWrap.classList.add("visible");

      if (!reducedMotion) {
        stopVisualizer();
        drawVisualizer();
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      musicBtn.setAttribute("aria-label", "Music file unavailable");
      musicBtn.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "CHECK FILE";
    }
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicBtn.setAttribute("aria-label", "Play music");
    musicBtn.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "P L A Y";
    visualizerWrap.classList.remove("visible");
    stopVisualizer();
  }
});

music.addEventListener("ended", () => {
  musicBtn.classList.remove("playing");
  musicBtn.setAttribute("aria-label", "Play music");
  musicBtn.setAttribute("aria-pressed", "false");
  musicLabel.textContent = "P L A Y";
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

/* =========================================================
   BLACK AURA 2.0 — LIVE PRESENCE / TERMINAL / MUSIC / LOADER
   ========================================================= */

// Brief page intro. Wait for the page assets, then get out of the way.
(() => {
  const preloader = $("#preloader");
  if (!preloader) return;
  let preloaderHidden = false;
  const hidePreloader = () => {
    if (preloaderHidden) return;
    preloaderHidden = true;
    window.setTimeout(() => {
      preloader.classList.add("is-hidden");
      window.setTimeout(() => preloader.remove(), 650);
    }, 180);
  };
  if (document.readyState === "complete") hidePreloader();
  else window.addEventListener("load", hidePreloader, { once: true });
  window.setTimeout(hidePreloader, 2800);
})();

// Discord presence via Lanyard. The account owner must opt in by joining Lanyard.
(() => {
  const card = $("#discordPresence");
  if (!card) return;

  const userId = card.dataset.userId;
  const statusNode = $("#presenceStatus");
  const activityNode = $("#presenceActivity");
  const avatarNode = $("#presenceAvatar");
  const statusNames = {
    online: "ONLINE",
    idle: "IDLE",
    dnd: "DO NOT DISTURB",
    offline: "OFFLINE"
  };

  function setUnavailable(message) {
    card.dataset.status = "offline";
    statusNode.textContent = "STATUS UNAVAILABLE";
    activityNode.textContent = message;
    const setupLink = card.querySelector(".presence-setup");
    if (setupLink) setupLink.hidden = false;
  }

  function renderPresence(presence) {
    if (!presence) return;
    const setupLink = card.querySelector(".presence-setup");
    if (setupLink) setupLink.hidden = true;
    const status = presence.discord_status || "offline";
    card.dataset.status = status;
    statusNode.textContent = statusNames[status] || "OFFLINE";

    const user = presence.discord_user;
    if (user && user.id && user.avatar) {
      const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=96`;
      avatarNode.innerHTML = "";
      const image = document.createElement("img");
      image.src = avatarUrl;
      image.alt = "";
      image.loading = "lazy";
      image.onerror = () => { avatarNode.textContent = "A"; };
      avatarNode.appendChild(image);
    }

    if (presence.listening_to_spotify && presence.spotify) {
      activityNode.textContent = `Listening to ${presence.spotify.song} — ${presence.spotify.artist}`;
      return;
    }

    const activities = Array.isArray(presence.activities) ? presence.activities : [];
    const activity = activities.find((item) => item.type !== 4 && item.name);
    if (activity) {
      const verbs = { 0: "Playing", 1: "Streaming", 2: "Listening to", 3: "Watching", 5: "Competing in" };
      activityNode.textContent = `${verbs[activity.type] || "Using"} ${activity.name}`;
    } else {
      activityNode.textContent = status === "offline" ? "Currently offline on Discord" : "Online — no active status";
    }
  }

  async function fetchPresence() {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${encodeURIComponent(userId)}`, {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error("Presence endpoint unavailable");
      const payload = await response.json();
      if (!payload.success || !payload.data) throw new Error("Account not registered with Lanyard");
      renderPresence(payload.data);
    } catch (error) {
      setUnavailable("Join the Lanyard server to share live Discord status.");
    }
  }

  let socket = null;
  let heartbeatTimer = null;
  let reconnectTimer = null;
  let pollingTimer = null;
  let reconnectDelay = 5000;

  function startRestFallback() {
    if (pollingTimer) return;
    fetchPresence();
    pollingTimer = window.setInterval(fetchPresence, 60000);
  }

  function connectSocket() {
    if (!("WebSocket" in window)) {
      startRestFallback();
      return;
    }
    try {
      socket = new WebSocket("wss://api.lanyard.rest/socket");
    } catch (error) {
      startRestFallback();
      return;
    }

    socket.addEventListener("message", (event) => {
      let packet;
      try { packet = JSON.parse(event.data); } catch (error) { return; }

      if (packet.op === 1) {
        const heartbeatInterval = Number(packet.d && packet.d.heartbeat_interval) || 30000;
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ op: 2, d: { subscribe_to_ids: [userId] } }));
        }
        window.clearInterval(heartbeatTimer);
        heartbeatTimer = window.setInterval(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ op: 3 }));
          }
        }, heartbeatInterval);
        return;
      }

      if (packet.op !== 0 || !packet.d) return;
      if (packet.t === "INIT_STATE") {
        const initial = packet.d[userId];
        if (initial) renderPresence(initial);
      } else if (packet.t === "PRESENCE_UPDATE" && packet.d.user_id === userId) {
        renderPresence(packet.d);
      }
    });

    socket.addEventListener("open", () => {
      reconnectDelay = 5000;
    });

    socket.addEventListener("error", () => {
      startRestFallback();
    });

    socket.addEventListener("close", () => {
      window.clearInterval(heartbeatTimer);
      startRestFallback();
      window.clearTimeout(reconnectTimer);
      reconnectTimer = window.setTimeout(connectSocket, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 1.7, 60000);
    });
  }

  fetchPresence();
  connectSocket();
  window.addEventListener("beforeunload", () => {
    window.clearInterval(heartbeatTimer);
    window.clearInterval(pollingTimer);
    window.clearTimeout(reconnectTimer);
    if (socket) socket.close();
  }, { once: true });
})();

// Lightweight command-line easter egg. All output uses textContent-safe nodes.
(() => {
  const modal = $("#terminalModal");
  const openButton = $("#terminalBtn");
  const closeButton = $("#terminalClose");
  const form = $("#terminalForm");
  const input = $("#terminalInput");
  const output = $("#terminalOutput");
  if (!modal || !form || !input || !output) return;

  const sectionMap = {
    home: "home",
    about: "about",
    journey: "journey",
    projects: "projects",
    skills: "skills",
    contact: "contact"
  };

  function addOutput(text, className = "") {
    const line = document.createElement("p");
    if (className) line.className = className;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function openTerminal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("terminal-open");
    window.setTimeout(() => input.focus(), 60);
  }

  function closeTerminal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("terminal-open");
    if (openButton) openButton.focus();
  }

  function runCommand(raw) {
    const command = raw.trim();
    const [name, ...args] = command.split(/\s+/);
    const key = (name || "").toLowerCase();
    if (!key) return;

    addOutput(`aki@black-aura ~ ${command}`, "terminal-command");

    const commands = {
      help: () => {
        addOutput("help       show available commands");
        addOutput("about      learn about Aki");
        addOutput("projects   view selected work");
        addOutput("journey    view the developer journey");
        addOutput("skills     jump to skills");
        addOutput("social     show social profiles");
        addOutput("open <section>  navigate to a section");
        addOutput("music      toggle the soundtrack");
        addOutput("clear      clear terminal output");
      },
      about: () => addOutput("Aki — creative developer exploring web experiences, Discord tools and interaction design."),
      projects: () => addOutput("Selected work: Personal Portfolio · Discord Control · Visual Experiments."),
      journey: () => addOutput("Curiosity → Exploration → Building → BLACK AURA. Use: open journey"),
      skills: () => addOutput("HTML · CSS · JavaScript · GitHub"),
      social: () => {
        addOutput("Discord account 1: 1393847310949290026");
        addOutput("Discord account 2: 1135576893740036227");
        addOutput("GitHub: github.com/bellnoridomi-sys");
      },
      contact: () => { closeTerminal(); document.querySelector("#contact").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); },
      music: () => { if (musicButton) musicButton.click(); addOutput("Soundtrack toggled."); },
      clear: () => { output.innerHTML = ""; },
      whoami: () => addOutput("aki@black-aura — curious by nature, building by choice.")
    };

    if (key === "open") {
      const section = (args[0] || "").toLowerCase();
      if (!sectionMap[section]) {
        addOutput("Unknown section. Try: home, about, journey, projects, skills, contact.");
        return;
      }
      closeTerminal();
      document.getElementById(sectionMap[section]).scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth"
      });
      return;
    }

    if (commands[key]) commands[key]();
    else addOutput(`Command not found: ${key}. Type "help" for commands.`);
  }

  const musicButton = $("#musicBtn");
  openButton && openButton.addEventListener("click", openTerminal);
  closeButton && closeButton.addEventListener("click", closeTerminal);
  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-terminal-close]")) closeTerminal();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runCommand(input.value);
    input.value = "";
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target && (target.matches("input, textarea, select") || target.isContentEditable);
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeTerminal();
      return;
    }
    if (!typing && (event.key === "~" || event.key === "`")) {
      event.preventDefault();
      modal.classList.contains("open") ? closeTerminal() : openTerminal();
    }
  });
})();

// Additional player controls share the existing audio element and analyser.
(() => {
  const music = $("#bgMusic");
  const musicButton = $("#musicBtn");
  const dockToggle = $("#musicDockToggle");
  const seek = $("#musicSeek");
  const volume = $("#musicVolume");
  const currentLabel = $("#musicCurrent");
  const durationLabel = $("#musicDuration");
  if (!music || !musicButton) return;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  music.volume = volume ? Number(volume.value) : 0.72;

  function syncPlayer() {
    if (currentLabel) currentLabel.textContent = formatTime(music.currentTime);
    if (durationLabel) durationLabel.textContent = formatTime(music.duration);
    if (seek && Number.isFinite(music.duration) && music.duration > 0 && document.activeElement !== seek) {
      seek.value = String(Math.round((music.currentTime / music.duration) * 1000));
    }
    if (dockToggle) dockToggle.textContent = music.paused ? "▶" : "Ⅱ";
  }

  dockToggle && dockToggle.addEventListener("click", () => musicButton.click());
  volume && volume.addEventListener("input", () => {
    music.volume = Number(volume.value);
  });
  seek && seek.addEventListener("input", () => {
    if (Number.isFinite(music.duration) && music.duration > 0) {
      music.currentTime = (Number(seek.value) / 1000) * music.duration;
      syncPlayer();
    }
  });

  ["loadedmetadata", "timeupdate", "durationchange", "play", "pause", "ended"].forEach((eventName) => {
    music.addEventListener(eventName, syncPlayer);
  });
  syncPlayer();
})();


// Project thumbnails: retain local previews as a fallback if an external image is unavailable.
document.querySelectorAll(".project-image img[data-project-fallback]").forEach((image) => {
  image.addEventListener("error", () => {
    const fallback = image.dataset.projectFallback;
    if (fallback && !image.dataset.fallbackTried) {
      image.dataset.fallbackTried = "true";
      image.src = fallback;
    }
  });
});
