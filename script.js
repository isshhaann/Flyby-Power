/* ============================================
   FLYBY POWER - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Page loader (revealed only after frame preloading finishes)
  const pageLoader = document.getElementById('pageLoader');

  // Initialize Lenis Smooth Scroll
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.6, // Increased duration for a longer, more premium glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95, // Slightly dampened for ultra-smooth control
    });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navHamburger = document.getElementById('navHamburger');
  const navOverlay = document.getElementById('navOverlay');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  // Sticky navbar on scroll
  let lastScrollY = 0;
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const heroScrollWrapper = document.getElementById('heroScrollWrapper');
    const carouselSection = document.querySelector('.carousel-section');

    let isInsideTransparentSection = false;

    // Check if inside hero section
    let heroThreshold = 80;
    if (heroScrollWrapper) {
      heroThreshold = heroScrollWrapper.offsetHeight - window.innerHeight - 80;
      if (heroThreshold < 80) heroThreshold = 80;
    }
    if (scrollY <= heroThreshold) {
      isInsideTransparentSection = true;
    }

    // Check if inside "Our Solutions" carousel section
    if (carouselSection) {
      const rect = carouselSection.getBoundingClientRect();
      if (rect.top <= 80 && rect.bottom >= 80) {
        isInsideTransparentSection = true;
      }
    }

    if (isInsideTransparentSection) {
      navbar.classList.remove('scrolled');
    } else {
      navbar.classList.add('scrolled');
    }

    lastScrollY = scrollY;
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Mobile menu toggle
  navHamburger.addEventListener('click', () => {
    navHamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navOverlay.addEventListener('click', () => {
    navHamburger.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navHamburger.classList.remove('active');
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  let sectionData = [];

  function cacheSectionData() {
    sectionData = Array.from(sections).map(section => ({
      id: section.getAttribute('id'),
      top: section.offsetTop,
      height: section.offsetHeight
    }));
  }

  window.addEventListener('resize', cacheSectionData, { passive: true });
  setTimeout(cacheSectionData, 500);

  let tickingNav = false;
  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sectionData.forEach(data => {
      if (scrollY >= data.top && scrollY < data.top + data.height) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${data.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
    tickingNav = false;
  }

  window.addEventListener('scroll', () => {
    if (!tickingNav) {
      window.requestAnimationFrame(updateActiveNav);
      tickingNav = true;
    }
  });

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = new Set();

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
        countersAnimated.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * easeOut);

      element.textContent = current.toLocaleString() + (target >= 90 && target <= 100 ? '%' : '+');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // AUDIT BARS ANIMATION
  // ============================================
  const auditBars = document.querySelectorAll('.audit-bar-fill');

  const auditObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        setTimeout(() => {
          entry.target.style.width = width + '%';
        }, 300);
        auditObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  auditBars.forEach(bar => {
    auditObserver.observe(bar);
  });

  // ============================================
  // SOLAR SAVINGS CALCULATOR
  // ============================================
  const billRange = document.getElementById('billRange');
  const sunRange = document.getElementById('sunRange');
  const sizeRange = document.getElementById('sizeRange');

  const billVal = document.getElementById('billVal');
  const sunVal = document.getElementById('sunVal');
  const sizeVal = document.getElementById('sizeVal');

  const annualSavingsVal = document.getElementById('annualSavingsVal');
  const paybackVal = document.getElementById('paybackVal');
  const irrVal = document.getElementById('irrVal');

  function updateCalculator() {
    if (!billRange || !sunRange || !sizeRange) return;

    const B = parseFloat(billRange.value);
    const Sh = parseFloat(sunRange.value);
    const Psize = parseFloat(sizeRange.value);

    // Update displays
    if (billVal) billVal.textContent = `$${B}`;
    if (sunVal) sunVal.textContent = `${Sh} hrs`;
    if (sizeVal) sizeVal.textContent = `${Psize} kW`;

    // Calculations
    const annualUsage = (B * 12) / 0.15; // kWh/year
    const annualGen = Psize * Sh * 365; // kWh/year
    const coverage = Math.min(1.0, annualGen / annualUsage);

    // Annual Savings
    const annualSavings = B * 12 * coverage * 0.843;

    // System cost
    const systemCost = Psize * 1970;

    // Payback period
    const payback = annualSavings > 0 ? (systemCost / annualSavings) : 0;

    // Calculate Project IRR over 25 years (numerical binary search)
    let irr = 0;
    if (systemCost > 0 && annualSavings > 0) {
      let low = -0.99;
      let high = 2.0;
      const tolerance = 0.0001;
      const maxIterations = 100;
      for (let i = 0; i < maxIterations; i++) {
        let mid = (low + high) / 2;
        let npv = -systemCost;
        for (let t = 1; t <= 25; t++) {
          npv += annualSavings / Math.pow(1 + mid, t);
        }
        if (Math.abs(npv) < tolerance) {
          irr = mid;
          break;
        }
        if (npv > 0) {
          low = mid;
        } else {
          high = mid;
        }
      }
      irr = (low + high) / 2;
    }
    const irrPercent = irr * 100;

    // Format results
    if (annualSavingsVal) {
      annualSavingsVal.textContent = `$${Math.round(annualSavings).toLocaleString()}`;
    }
    if (paybackVal) {
      paybackVal.textContent = `${payback.toFixed(1)} Years`;
    }
    if (irrVal) {
      irrVal.textContent = `${irrPercent.toFixed(1)}%`;
    }
  }

  if (billRange) {
    billRange.addEventListener('input', updateCalculator);
    sunRange.addEventListener('input', updateCalculator);
    sizeRange.addEventListener('input', updateCalculator);
    updateCalculator(); // Initialize values
  }

  // ============================================
  // MAINTENANCE COMPARISON SLIDER
  // ============================================
  const panelCompare = document.getElementById('panelCompare');
  const compareSlider = document.getElementById('compareSlider');
  const efficiencyValue = document.getElementById('efficiencyValue');
  const maintenanceSection = document.getElementById('maintenance');
  let sliderAnimated = false;
  let animFrameId = null;

  function updateSliderValue(val) {
    if (compareSlider) compareSlider.value = val;
    if (panelCompare) panelCompare.style.setProperty('--exposure', `${val}%`);

    // Update efficiency value dynamically based on slider value
    const minEff = 65;
    const maxEff = 98;
    const currentEff = Math.round(minEff + (val / 100) * (maxEff - minEff));
    if (efficiencyValue) {
      efficiencyValue.textContent = `${currentEff}%`;
      // Update efficiency text color based on value
      if (currentEff > 90) {
        efficiencyValue.style.color = '#2e7d32';
      } else if (currentEff > 80) {
        efficiencyValue.style.color = '#4caf50';
      } else {
        efficiencyValue.style.color = '#f9a825';
      }
    }
  }

  // Handle manual interaction
  if (compareSlider) {
    compareSlider.addEventListener('input', (e) => {
      // Cancel any running auto-animation
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      sliderAnimated = true; // prevent re-triggering auto-animation
      updateSliderValue(e.target.value);
    });
  }

  // Auto-animation on scroll reveal
  if (maintenanceSection) {
    const maintenanceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !sliderAnimated) {
          sliderAnimated = true;

          // Animate slider from 50 (middle) to 100 (fully clean)
          const duration = 2000;
          const startTime = performance.now();
          const startVal = 50;
          const endVal = 100;

          function tick(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = startVal + (endVal - startVal) * easeOut;

            updateSliderValue(currentVal);

            if (progress < 1) {
              animFrameId = requestAnimationFrame(tick);
            } else {
              animFrameId = null;
            }
          }

          animFrameId = requestAnimationFrame(tick);
        }
      });
    }, {
      threshold: 0.3
    });

    maintenanceObserver.observe(maintenanceSection);
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ============================================
  // CONTACT FORM
  // ============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;

      // Simulate form submission
      submitBtn.textContent = 'Sending...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = '#2e7d32';
        submitBtn.style.opacity = '1';

        // Reset form
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ============================================
  // HERO SCROLL-DRIVEN VIDEO + GSAP TIMELINE
  // ============================================
  const heroBg = document.getElementById('heroBg');
  const heroImage = document.getElementById('heroImage');
  const heroCanvas = document.getElementById('heroCanvas');
  const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
  const heroOverlay = document.getElementById('heroOverlay');
  const heroSunGlow = document.getElementById('heroSunGlow');
  const heroPanelGlow = document.getElementById('heroPanelGlow');
  const heroParticles = document.getElementById('heroParticles');
  const heroEnergyLines = document.getElementById('heroEnergyLines');
  const heroScrollIndicator = document.getElementById('heroScrollIndicator');
  const heroScrollWrapper = document.getElementById('heroScrollWrapper');
  const heroSection = document.getElementById('home');
  const heroEyebrow = document.getElementById('heroEyebrow');
  const heroHeading = document.getElementById('heroHeading');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroBtnPrimary = document.getElementById('heroBtnPrimary');
  const heroBtnSecondary = document.getElementById('heroBtnSecondary');

  // --- Reduced motion check ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Buttery Smooth Lerp Ticker variables ---
  let smoothProgress = 0;
  let targetProgress = 0;
  let lastRenderedProgress = -1;
  // --- Canvas Image Sequence Scrubbing ---
  let isReady = false;

  if (heroImage && heroCanvas) heroImage.style.display = 'none';

  const isMobile = window.innerWidth < 768;
  const frameDir = isMobile ? 'images/hero-frames-mobile' : 'images/hero-frames';
  const imgW = isMobile ? 720 : 1280;
  const imgH = isMobile ? 1280 : 720;

  const frameCount = 600;
  const frames = new Array(frameCount + 1).fill(null);

  // Preload frame 1 immediately to unlock the UI
  const firstFrame = new Image();
  firstFrame.src = `${frameDir}/frame-0001.webp`;
  frames[1] = firstFrame;
  firstFrame.onload = () => {
    isReady = true;
    resizeCanvas();
    if (heroCanvas) heroCanvas.classList.add('ready');
    if (pageLoader) setTimeout(() => pageLoader.classList.add('loaded'), 300);
    loadChunks();
  };
  firstFrame.onerror = () => { loadChunks(); };

  // Helper to generate progressive preloading indices
  function getProgressiveIndices() {
    const indices = [];
    const visited = new Set();
    visited.add(1);

    function addStep(step, start) {
      for (let i = start; i <= frameCount; i += step) {
        if (!visited.has(i)) {
          indices.push(i);
          visited.add(i);
        }
      }
    }

    addStep(20, 20); // Batch 1: Every 20th frame (coarse timeline anchors)
    addStep(20, 10); // Batch 2: Every 10th frame (medium anchors)
    addStep(10, 5);  // Batch 3: Every 5th frame
    addStep(2, 2);   // Batch 4: Every 2nd frame (even frames)
    addStep(1, 3);   // Batch 5: The remaining odd frames

    return indices;
  }

  // Load remaining frames in batches of 30 to prevent network/browser freeze
  function loadChunks() {
    const queue = getProgressiveIndices();
    let queueIndex = 0;

    function loadBatch() {
      if (queueIndex >= queue.length) return;
      let batchPromises = [];
      for (let i = 0; i < 30 && queueIndex < queue.length; i++) {
        const frameIdx = queue[queueIndex];
        queueIndex++;
        batchPromises.push(new Promise((resolve) => {
          const img = new Image();
          frames[frameIdx] = img;
          img.src = `${frameDir}/frame-${frameIdx.toString().padStart(4, '0')}.webp`;
          img.onload = () => {
            if (isReady) renderFrame();
            resolve();
          };
          img.onerror = resolve;
        }));
      }
      Promise.all(batchPromises).then(() => {
        setTimeout(loadBatch, 5); // 5ms breather between batches
      });
    }
    loadBatch();
  }

  function resizeCanvas() {
    if (!heroCanvas) return;
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
    renderFrame();
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Safety fallback
  setTimeout(() => {
    if (!isReady) {
      isReady = true;
      resizeCanvas();
      if (heroCanvas) heroCanvas.classList.add('ready');
      if (pageLoader) pageLoader.classList.add('loaded');
    }
  }, 4000);

  function renderFrame() {
    if (!heroCtx || !isReady) return;

    // Map progress (0 to 1) to frame index (1 to 600)
    let frameIndex = Math.floor(smoothProgress * (frameCount - 1)) + 1;
    frameIndex = Math.max(1, Math.min(frameCount, frameIndex));

    let imgToDraw = frames[frameIndex];

    // If the exact frame isn't completely loaded yet, fallback to the nearest completely loaded frame (bidirectional search)
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      let dist = 1;
      while (dist < frameCount) {
        const prevIdx = frameIndex - dist;
        if (prevIdx >= 1 && frames[prevIdx] && frames[prevIdx].complete && frames[prevIdx].naturalWidth > 0) {
          imgToDraw = frames[prevIdx];
          break;
        }
        const nextIdx = frameIndex + dist;
        if (nextIdx <= frameCount && frames[nextIdx] && frames[nextIdx].complete && frames[nextIdx].naturalWidth > 0) {
          imgToDraw = frames[nextIdx];
          break;
        }
        dist++;
      }
    }

    // Abort if absolutely no frames are loaded yet
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) return;

    const canvasW = heroCanvas.width;
    const canvasH = heroCanvas.height;
    const canvasRatio = canvasW / canvasH;
    const imgRatio = imgW / imgH;

    let drawW, drawH, drawX, drawY;
    if (canvasRatio > imgRatio) {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    }

    heroCtx.clearRect(0, 0, canvasW, canvasH);
    heroCtx.drawImage(imgToDraw, drawX, drawY, drawW, drawH);
  }

  // --- GSAP Timeline setup ---
  let heroTL = null;

  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    heroTL = gsap.timeline({ paused: true });

    // --- Background effects (0% - 100%) ---
    // Sun rises (using GPU yPercent translation instead of layout top)
    if (heroSunGlow) {
      heroTL.fromTo(heroSunGlow,
        { yPercent: 0, scale: 1, opacity: 0.3 },
        { yPercent: -100, scale: 2.2, opacity: 1, ease: 'none', duration: 1 },
        0
      );
    }

    // Panel glow activates (using transform scale/xPercent and opacity only)
    if (heroPanelGlow) {
      heroTL.fromTo(heroPanelGlow,
        { opacity: 0, scale: 0.8, xPercent: -50 },
        { opacity: 1, scale: 1.1, xPercent: -50, ease: 'none', duration: 0.6 },
        0.2
      );
    }

    // Energy lines intensify
    if (heroEnergyLines) {
      heroTL.fromTo(heroEnergyLines,
        { opacity: 0.3 },
        { opacity: 1, ease: 'none', duration: 1 },
        0
      );
    }

    // Particles intensify
    if (heroParticles) {
      heroTL.fromTo(heroParticles,
        { opacity: 0.4 },
        { opacity: 1, ease: 'none', duration: 1 },
        0
      );
    }

    // Scroll indicator fades out fast
    if (heroScrollIndicator) {
      heroTL.to(heroScrollIndicator,
        { opacity: 0, duration: 0.08, ease: 'none' },
        0
      );
    }

    // --- Stage 1: Text Pops In on early scroll ---
    const revealFrom = { opacity: 0, y: 60, scale: 0.85 };
    const revealTo = (dur) => ({ opacity: 1, y: 0, scale: 1, ease: 'back.out(1.5)', duration: dur });

    if (heroEyebrow) heroTL.fromTo(heroEyebrow, { ...revealFrom }, revealTo(0.1), 0.0);
    if (heroHeading) heroTL.fromTo(heroHeading, { ...revealFrom }, revealTo(0.1), 0.02);
    if (heroSubtitle) heroTL.fromTo(heroSubtitle, { ...revealFrom }, revealTo(0.1), 0.04);
    if (heroBtnPrimary) heroTL.fromTo(heroBtnPrimary, { ...revealFrom }, revealTo(0.1), 0.06);
    if (heroBtnSecondary) heroTL.fromTo(heroBtnSecondary, { ...revealFrom }, revealTo(0.1), 0.08);

    // Fade out text late in the scroll so the end of the 3D animation is fully visible
    const heroContentWrapper = document.getElementById('heroContent');
    if (heroContentWrapper) {
      heroTL.to(heroContentWrapper, { opacity: 0, y: -40, scale: 0.95, duration: 0.15, ease: 'power2.in' }, 0.80);
    }
  }

  // --- Buttery Smooth Lerp Ticker on requestAnimationFrame ---

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && heroScrollWrapper && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: heroScrollWrapper,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        targetProgress = self.progress;
      }
    });

    // Run tick loop at native refresh rate (60Hz / 120Hz / 144Hz)
    function tick() {
      if (isReady) {
        // Only calculate and render if the user is actually near the hero section
        const heroHeight = heroScrollWrapper ? heroScrollWrapper.offsetHeight : window.innerHeight * 12;
        if (window.scrollY < heroHeight + window.innerHeight) {
          const lerpFactor = isMobile ? 0.15 : 0.04;
          smoothProgress += (targetProgress - smoothProgress) * lerpFactor;

          // Snap when close enough to avoid endless microscopic decimal calculations
          if (Math.abs(targetProgress - smoothProgress) < 0.001) {
            smoothProgress = targetProgress;
          }

          if (Math.abs(lastRenderedProgress - smoothProgress) > 0.001) {
            if (heroTL) {
              heroTL.progress(smoothProgress);
            }
            renderFrame();
            lastRenderedProgress = smoothProgress;
          }
        }
      }
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });

  } else if (prefersReducedMotion) {
    // Reduced motion: show everything immediately
    [heroEyebrow, heroHeading, heroSubtitle, heroBtnPrimary, heroBtnSecondary].forEach(el => {
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      }
    });
  }

  // ============================================
  // SERVICE CARD TILT EFFECT
  // ============================================
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    let rect, centerX, centerY;
    let ticking = false;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
      centerX = rect.width / 2;
      centerY = rect.height / 2;
    });

    card.addEventListener('mousemove', (e) => {
      if (!ticking && rect) {
        window.requestAnimationFrame(() => {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
          ticking = false;
        });
        ticking = true;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      rect = null;
    });
  });

  // ============================================
  // ENERGY FLOW ANIMATION ON SCROLL
  // ============================================
  const energyNodes = document.querySelectorAll('.energy-node-icon');

  const energyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'energyPulse 2s ease-in-out infinite';
      } else {
        entry.target.style.animation = '';
      }
    });
  }, {
    threshold: 0.5
  });

  energyNodes.forEach(node => {
    energyObserver.observe(node);
  });

  // Add energy pulse keyframes dynamically
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes energyPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      50% { box-shadow: 0 4px 20px rgba(46,125,50,0.3), 0 0 0 8px rgba(46,125,50,0.05); }
    }
  `;
  document.head.appendChild(styleSheet);

  // ============================================
  // PRELOAD IMAGES
  // ============================================
  const imagePaths = [
    'images/hero-bg.png',
    'images/solar-residential.png',
    'images/solar-commercial.png',
    'images/ev-charger.png',
    'images/wind-turbines.png',
    'images/training.png',
    'images/energy-audit.png',
    'images/solar-installation.png'
  ];

  imagePaths.forEach(path => {
    const img = new Image();
    img.src = path;
  });


  // ============================================
  // PRODUCT CAROUSEL — clean rewrite
  // ============================================
  (function () {
    const cards = document.querySelectorAll('.carousel-card');

    const products = [
      {
        title: "Product 1",
        text: "Description for Product 1."
      },
      {
        title: "Product 2",
        text: "Description for Product 2."
      },
      {
        title: "Product 3",
        text: "Description for Product 3."
      },
      {
        title: "Product 4",
        text: "Description for Product 4."
      }
    ];

    let active = 0;

    function updateCarousel() {

      cards.forEach((card, index) => {

        let offset = index - active;

        if (offset < -2) offset += cards.length;
        if (offset > 2) offset -= cards.length;

        let transform = '';
        let opacity = 0;

        switch (offset) {

          case 0:
            transform =
              'translate(-50%,-50%) translateZ(150px) scale(1)';
            opacity = 1;
            break;

          case -1:
            transform =
              'translate(-50%,-50%) translateX(-320px) rotateY(35deg) scale(.85)';
            opacity = .6;
            break;

          case 1:
            transform =
              'translate(-50%,-50%) translateX(320px) rotateY(-35deg) scale(.85)';
            opacity = .6;
            break;

          default:
            transform =
              'translate(-50%,-50%) translateZ(-300px) scale(.7)';
            opacity = 0;
        }

        card.style.transform = transform;
        card.style.opacity = opacity;
        card.style.zIndex = 100 - Math.abs(offset);

      });

      const titleEl = document.getElementById('cDetailTitle');
      const textEl = document.getElementById('cDetailText');
      if (titleEl) titleEl.textContent = products[active].title;
      if (textEl) textEl.textContent = products[active].text;
    }

    document.getElementById('cNext').onclick = () => {
      active = (active + 1) % cards.length;
      updateCarousel();
    };

    document.getElementById('cPrev').onclick = () => {
      active = (active - 1 + cards.length) % cards.length;
      updateCarousel();
    };

    updateCarousel();
  })();

});
// ============================================
// PARTNERS SECTION HOVER EFFECTS
// ============================================
(function () {
  document.querySelectorAll('.bs-card').forEach(function (card) {
    var spot = card.querySelector('.bs-spot');
    var color = card.dataset.color || '#888888';
    spot.style.background = 'radial-gradient(120px circle at 50% 50%, ' + color + '33, transparent 70%)';

    let r;
    let ticking = false;

    card.addEventListener('mouseenter', function () {
      r = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', function (e) {
      if (!ticking && r) {
        window.requestAnimationFrame(() => {
          var x = ((e.clientX - r.left) / r.width) * 100;
          var y = ((e.clientY - r.top) / r.height) * 100;
          spot.style.background = 'radial-gradient(120px circle at ' + x + '% ' + y + '%, ' + color + '33, transparent 70%)';
          ticking = false;
        });
        ticking = true;
      }
    });

    card.addEventListener('mouseleave', function () {
      r = null;
      spot.style.background = 'radial-gradient(120px circle at 50% 50%, ' + color + '33, transparent 70%)';
    });
  });
})();
// ============================================
// INSTAGRAM REELS MARQUEE SECTION
// ============================================
(function () {
  // Configurable array for future Instagram Reels integration.
  // Replace the image URLs with actual video embeds/URLs later.
  const reelsData = [
    {
      category: "Solar",
      mediaUrl: "images/solar-residential.png",
      caption: "Check out this beautiful 10kW residential installation in action! ☀️🔋 #solar #cleanenergy",
      color: "#F2B544"
    },
    {
      category: "EV Charging",
      mediaUrl: "images/ev-charger.png",
      caption: "Level 2 EV Charger installed and ready to go! Charge from home effortlessly. 🚗⚡",
      color: "#2BD4C5"
    },
    {
      category: "Training",
      mediaUrl: "images/training.png",
      caption: "Hands-on technical training session today. Empowering the next generation of engineers. 🛠️🎓",
      color: "#FF8A3D"
    },
    {
      category: "Wind Energy",
      mediaUrl: "images/wind-turbines.png",
      caption: "Our new residential wind turbine model testing phase. Harvesting the breeze! 🌬️🏠",
      color: "#9ca3af"
    },
    {
      category: "Commercial",
      mediaUrl: "images/solar-commercial.png",
      caption: "Massive commercial rooftop project completed! Helping businesses slash their energy bills. 🏢📉",
      color: "#F2B544"
    },
    {
      category: "Solar",
      mediaUrl: "images/solar-installation.png",
      caption: "Team hard at work on another premium install. Precision matters. 👷‍♂️🔧",
      color: "#2BD4C5"
    }
  ];

  const track1 = document.getElementById('reelsTrack1');
  const track2 = document.getElementById('reelsTrack2');
  if (!track1 || !track2) return;

  function createCardHTML(reel) {
    return `
      <div class="reel-card">
        <img src="${reel.mediaUrl}" class="reel-media" alt="${reel.category} video" loading="lazy" decoding="async">
        <div class="reel-play-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
        <div class="reel-overlay">
          <div class="reel-top">
            <div class="reel-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
            <div class="reel-tag" style="background: ${reel.color}33; color: ${reel.color}; border-color: ${reel.color}66;">
              ${reel.category}
            </div>
          </div>
          <div class="reel-bottom">
            <p class="reel-caption">${reel.caption}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Generate cards
  let cardsHTML1 = '';
  let cardsHTML2 = '';

  // Track 1 gets original order
  reelsData.forEach(reel => { cardsHTML1 += createCardHTML(reel); });
  // Track 2 gets reversed order for variety
  [...reelsData].reverse().forEach(reel => { cardsHTML2 += createCardHTML(reel); });

  // Duplicate for infinite loop (3 sets should be enough to fill any screen width safely)
  track1.innerHTML = cardsHTML1 + cardsHTML1 + cardsHTML1;
  track2.innerHTML = cardsHTML2 + cardsHTML2 + cardsHTML2;

  // Animation State
  let x1 = 0;
  let x2 = 0;
  let baseSpeed = 0.8;
  let scrollVelocity = baseSpeed;
  let targetVelocity = baseSpeed;
  let isHovering = false;
  let isVisible = false;
  let lastScrollY = window.scrollY;
  let tickingScroll = false;

  // Intersection Observer to pause when out of view
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(document.getElementById('reels'));

  // Pause on hover
  const allCards = document.querySelectorAll('.reel-card');
  allCards.forEach(card => {
    card.addEventListener('mouseenter', () => isHovering = true);
    card.addEventListener('mouseleave', () => isHovering = false);
  });

  // Calculate scroll velocity
  window.addEventListener('scroll', () => {
    if (!tickingScroll) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;
        // Boost velocity based on scroll speed, much more subtly
        let boost = Math.abs(delta) * 0.05;
        if (boost > 5) boost = 5;
        targetVelocity = baseSpeed + boost;

        lastScrollY = currentScrollY;
        tickingScroll = false;
      });
      tickingScroll = true;
    }
  });

  // Calculate exact set width dynamically
  let setWidth = 1824; // fallback
  setTimeout(() => {
    if (allCards.length > 0) {
      const cardW = allCards[0].offsetWidth;
      // 24px gap is defined in CSS
      setWidth = (cardW + 24) * reelsData.length;
    }
  }, 100);

  window.addEventListener('resize', () => {
    if (allCards.length > 0) {
      setWidth = (allCards[0].offsetWidth + 24) * reelsData.length;
    }
  });

  // Render Loop
  function renderMarquee() {
    if (isVisible) {
      // Lerp velocity back to base speed very softly
      targetVelocity += (baseSpeed - targetVelocity) * 0.03;

      // If hovering, smooth down to 0
      let currentSpeed = isHovering ? 0 : targetVelocity;
      scrollVelocity += (currentSpeed - scrollVelocity) * 0.08;

      // Only translate on desktop (mobile uses native scroll snap)
      if (window.innerWidth > 768) {
        // Move Track 1 Left
        x1 -= scrollVelocity;
        // Move Track 2 Right
        x2 += scrollVelocity * 0.85;

        // Reset positions dynamically
        if (x1 <= -setWidth) x1 += setWidth;
        if (x2 >= 0) x2 -= setWidth;

        // Use toFixed to prevent extreme subpixel values, but keep some decimal for smoothness
        track1.style.transform = `translate3d(${x1.toFixed(2)}px, 0, 0)`;
        track2.style.transform = `translate3d(${(x2 - setWidth).toFixed(2)}px, 0, 0)`;
      } else {
        // Reset transforms if resized to mobile
        track1.style.transform = '';
        track2.style.transform = '';
      }
    }
    requestAnimationFrame(renderMarquee);
  }

  // Start loop
  requestAnimationFrame(renderMarquee);

})();
// ============================================
// BRANDS SECTION LOGIC
// ============================================
(function () {
  const brandsSection = document.getElementById('brands');
  if (!brandsSection) return;

  var state = { product: 'all' };

  // Spotlight follow using RequestAnimationFrame for performance
  document.querySelectorAll('.brands-card').forEach(function (card) {
    var spot = card.querySelector('.spot');
    var color = card.dataset.color || '#888';
    let r;
    let ticking = false;

    card.addEventListener('mouseenter', function () {
      r = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', function (e) {
      if (!ticking && r) {
        window.requestAnimationFrame(() => {
          var x = ((e.clientX - r.left) / r.width) * 100;
          var y = ((e.clientY - r.top) / r.height) * 100;
          spot.style.background = 'radial-gradient(150px circle at ' + x + '% ' + y + '%, ' + color + '26, transparent 70%)';
          ticking = false;
        });
        ticking = true;
      }
    });

    card.addEventListener('mouseleave', function () {
      r = null;
      spot.style.background = '';
    });
  });

  // Filter pills
  document.querySelectorAll('#brands .pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      var f = pill.dataset.filter;
      var v = pill.dataset.val;
      state[f] = v;

      // Update active pill styles per row
      document.querySelectorAll('#brands [data-filter="' + f + '"]').forEach(function (p) {
        p.classList.remove('active-neutral');
      });

      pill.classList.add('active-neutral');

      applyFilters();
      // ScrollTrigger refresh in case layout height changes
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 350);
      }
    });
  });

  function applyFilters() {
    var cards = document.querySelectorAll('#brands .brands-card[data-product]');
    var visible = 0;

    cards.forEach(function (card) {
      var prod = card.dataset.product;
      var prodMatch = state.product === 'all' || prod === state.product;

      if (prodMatch) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Rebuild grid layout so hidden (absolute) cards don't leave gaps
    var grid = document.getElementById('brandsGrid');
    var allCards = Array.from(cards);
    allCards.forEach(function (c) { grid.appendChild(c); });

    var emptyMsg = document.getElementById('brandsEmptyMsg');
    if (emptyMsg) {
      emptyMsg.classList.toggle('show', visible === 0);
    }
  }
})();
