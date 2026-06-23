import './style.css';
import { 
  createIcons, 
  Sun, 
  Leaf, 
  Battery, 
  Zap, 
  GraduationCap, 
  Wind, 
  CheckCircle2, 
  ChevronDown, 
  MessageSquare, 
  Menu, 
  X, 
  Shield, 
  BarChart3, 
  Star 
} from 'lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  createIcons({
    icons: {
      Sun, Leaf, Battery, Zap, GraduationCap, Wind, CheckCircle2, ChevronDown, MessageSquare, Menu, X, Shield, BarChart3, Star
    }
  });

  initNavigation();
  initHeroAnimations();
  initScrollReveals();
  initSolarSchematic();
  initPanelCleaning();
  initEnergyAudit();
  initEVCharger();
  initWindEnergy();
  initCounters();
  initGalleryFilter();
  initTestimonials();
  initFAQAccordion();
  initContactForm();
});

/* ==========================================================================
   1. Navigation Controllers
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('open')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    createIcons({ icons: { Menu, X } });
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
      createIcons({ icons: { Menu } });
    });
  });

  // Handle scroll events: Sticky navbar & active section highlighting
  window.addEventListener('scroll', () => {
    // 1. Sticky Class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 2. Section Active Link & Dark/Light header text mapping
    let currentId = 'home';
    let isDarkSection = true; // Hero starts dark

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
        isDarkSection = section.classList.contains('dark-bg');
      }
    });

    // Toggle active link class
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });

    // Toggle header dark text styling
    if (isDarkSection) {
      document.body.classList.add('dark-bg-active');
    } else {
      document.body.classList.remove('dark-bg-active');
    }
  });
}

/* ==========================================================================
   2. Hero cinematic SVG & scroll animations
   ========================================================================== */
function initHeroAnimations() {
  // 1. Blade spinning animation
  const bladeTimeline = gsap.timeline({ repeat: -1 });
  bladeTimeline.to('#hero-turbine-blades', {
    rotation: 360,
    duration: 6,
    ease: 'none',
    transformOrigin: 'center center'
  });

  // 2. Glow flow lines timeline
  const flowTimeline = gsap.timeline({ repeat: -1 });
  // Animate the stroke-dashoffset of the path lines to show energy moving
  // First, make paths visible
  gsap.set('#flow-wind, #flow-solar, #flow-ev', { opacity: 0.7, strokeDasharray: '8,8' });
  
  flowTimeline.to('#flow-wind, #flow-solar, #flow-ev', {
    strokeDashoffset: -40,
    duration: 2,
    ease: 'none'
  });

  // 3. Scroll Triggered Sun Rise & Sky fade
  gsap.to('#hero-sun', {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    cy: 80,
    r: 55,
    ease: 'power1.out'
  });

  gsap.to('#hero-sun-corona', {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    cy: 80,
    r: 80,
    opacity: 0.25,
    ease: 'power1.out'
  });

  // Gradually shift the morning glow sky
  gsap.to('.hero-sky-bg', {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    background: 'radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.18) 0%, rgba(10, 17, 40, 0) 80%)',
    ease: 'none'
  });

  // Make wind turbine spin slightly faster as we scroll down
  gsap.to(bladeTimeline, {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    timeScale: 3.5, // spins 3.5x faster at the bottom of hero
    ease: 'none'
  });
}

/* ==========================================================================
   3. Scroll reveals (staggered entries)
   ========================================================================== */
function initScrollReveals() {
  // Stagger reveal about feature cards
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.about-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });

  // Stagger reveal service cards
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Stagger reveal solar solutions cards
  gsap.from('.solution-card', {
    scrollTrigger: {
      trigger: '.solar-solutions-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: -40,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });
}

/* ==========================================================================
   4. Solar Solutions Interactive Schematic Toggle
   ========================================================================== */
function initSolarSchematic() {
  const btnOnGrid = document.getElementById('toggle-ongrid');
  const btnHybrid = document.getElementById('toggle-hybrid');
  
  const batteryEl = document.getElementById('battery-element');
  const gridEl = document.getElementById('grid-element');
  
  const pathToGrid = document.getElementById('path-to-grid');
  const pulseToGrid = document.getElementById('pulse-to-grid');
  
  const pathToBattery = document.getElementById('path-to-battery');
  const pulseToBattery = document.getElementById('pulse-to-battery');

  // SVG dash array pulse animations setup
  gsap.set('.schematic-pulse', { strokeDasharray: '6,6' });

  // On-Grid system configuration
  btnOnGrid.addEventListener('click', () => {
    btnOnGrid.classList.add('active');
    btnHybrid.classList.remove('active');
    
    // Animate opacity changes
    gsap.to(gridEl, { opacity: 1, duration: 0.4 });
    gsap.to(batteryEl, { opacity: 0.2, duration: 0.4 });
    
    // Update lines and pulses
    pathToGrid.setAttribute('stroke', '#10b981');
    pulseToGrid.style.display = 'block';
    
    pathToBattery.setAttribute('stroke', '#64748b');
    pulseToBattery.style.display = 'none';
  });

  // Hybrid storage configuration
  btnHybrid.addEventListener('click', () => {
    btnHybrid.classList.add('active');
    btnOnGrid.classList.remove('active');
    
    // Animate opacity changes
    gsap.to(gridEl, { opacity: 0.2, duration: 0.4 });
    gsap.to(batteryEl, { opacity: 1, duration: 0.4 });
    
    // Update lines and pulses
    pathToGrid.setAttribute('stroke', '#64748b');
    pulseToGrid.style.display = 'none';
    
    pathToBattery.setAttribute('stroke', '#fbbf24');
    pulseToBattery.style.display = 'block';
  });
}

/* ==========================================================================
   5. Interactive panel wipe comparison & gauge
   ========================================================================== */
function initPanelCleaning() {
  const slider = document.getElementById('wipe-slider');
  const dustyPanel = document.getElementById('dusty-panel-overlay');
  const handleIndicator = document.getElementById('wipe-handle-indicator');
  const gaugeFill = document.getElementById('gauge-fill');
  const gaugeVal = document.getElementById('gauge-value');

  // Circular gauge calculations (dasharray is 126 representing semi-circle arc length)
  const arcLength = 126;
  
  // Set initial slider output
  updatePanelCleanliness(slider.value);

  slider.addEventListener('input', (e) => {
    updatePanelCleanliness(e.target.value);
  });

  function updatePanelCleanliness(value) {
    const numericVal = parseInt(value, 10);
    
    // Update clip-path styling property
    document.documentElement.style.setProperty('--wipe-percentage', `${numericVal}%`);
    
    // Calculate efficiency (from 55% base dusty to 100% clean)
    const efficiency = 55 + Math.round((numericVal / 100) * 45);
    gaugeVal.textContent = `${efficiency}%`;

    // Map efficiency gauge fill stroke offset
    // 55% efficiency is partially full, 100% is fully stroked. 
    // Dashoffset: 126 is empty, 0 is full.
    // Scale efficiency value from 0 to 100 to offset range [126, 0]
    const percentFilled = (efficiency - 50) / 50; // maps [50, 100] -> [0, 1]
    const offset = arcLength - (percentFilled * arcLength);
    gaugeFill.style.strokeDashoffset = Math.max(0, Math.min(arcLength, offset));

    // Update gauge stroke color based on efficiency
    if (efficiency < 75) {
      gaugeFill.style.stroke = '#ef4444'; // Red
      gaugeVal.style.fill = '#ef4444';
    } else if (efficiency < 95) {
      gaugeFill.style.stroke = '#fbbf24'; // Yellow
      gaugeVal.style.fill = '#d97706';
    } else {
      gaugeFill.style.stroke = '#10b981'; // Green
      gaugeVal.style.fill = '#10b981';
      
      // Sparkle micro-animations once at 100% clean
      if (numericVal === 100) {
        triggerSparkles();
      }
    }
  }

  function triggerSparkles() {
    gsap.killTweensOf('.sparkle');
    gsap.set('.sparkle', { scale: 0, opacity: 0 });
    
    gsap.to('.sparkle-1', { animation: 'sparkle-anim 1.2s forwards' });
    gsap.to('.sparkle-2', { animation: 'sparkle-anim 1.2s forwards 0.2s' });
    gsap.to('.sparkle-3', { animation: 'sparkle-anim 1.2s forwards 0.4s' });
  }
}

/* ==========================================================================
   6. Energy Audit Dashboard Simulation
   ========================================================================== */
function initEnergyAudit() {
  const btnRun = document.getElementById('btn-run-audit');
  const auditedBar = document.getElementById('audited-bar');
  const auditedBarText = document.getElementById('audited-bar-text');
  const savingsArrow = document.getElementById('savings-arrow');
  const savingsBadge = document.getElementById('savings-badge-box');
  const wasteNum = document.getElementById('waste-number');
  const savingsNum = document.getElementById('savings-number');

  let hasAudited = false;

  btnRun.addEventListener('click', () => {
    if (hasAudited) return; // Prevent double simulations
    hasAudited = true;
    
    btnRun.textContent = "Optimization Complete";
    btnRun.setAttribute('disabled', 'true');
    btnRun.style.opacity = '0.6';

    // Animate SVG Bar Height
    // In SVG, height of red bar is 120 (from y=50 to 170). 
    // We want the green bar to rise to y=120, height=50 (approx 1,950 kWh vs 4,800 kWh).
    gsap.to(auditedBar, {
      y: 120,
      height: 50,
      duration: 1.5,
      ease: 'power2.out'
    });

    // Fade in markers
    gsap.to([auditedBarText, savingsArrow, savingsBadge], {
      opacity: 1,
      duration: 0.6,
      delay: 0.8
    });

    // Count up annual savings text
    let savingsVal = { val: 0 };
    gsap.to(savingsVal, {
      val: 1850,
      duration: 2,
      ease: 'power1.out',
      onUpdate: () => {
        savingsNum.textContent = `$${Math.round(savingsVal.val).toLocaleString()}`;
      }
    });

    // Count down wastage percentage text
    let wasteVal = { val: 45 };
    gsap.to(wasteVal, {
      val: 12,
      duration: 1.8,
      ease: 'power1.out',
      onUpdate: () => {
        wasteNum.textContent = `${Math.round(wasteVal.val)}%`;
      }
    });
  });
}

/* ==========================================================================
   7. EV Charger plug-in flow charging simulator
   ========================================================================== */
function initEVCharger() {
  const btnPlug = document.getElementById('btn-plug-in');
  const optionHome = document.getElementById('ev-home-card');
  const optionComm = document.getElementById('ev-commercial-card');
  
  const led = document.getElementById('charger-led-indicator');
  const screenStatus = document.getElementById('charger-screen-status');
  const screenPercent = document.getElementById('charger-screen-percent');
  const batteryLevel = document.getElementById('vehicle-battery-level');
  const legendStatus = document.getElementById('charge-status-legend');

  let isCharging = false;
  let chargeTimeline = null;

  // Toggle charger cards option
  optionHome.addEventListener('click', () => {
    optionHome.classList.add('active');
    optionComm.classList.remove('active');
  });
  optionComm.addEventListener('click', () => {
    optionComm.classList.add('active');
    optionHome.classList.remove('active');
  });

  btnPlug.addEventListener('click', () => {
    if (!isCharging) {
      // Plug In & start charge sequence
      isCharging = true;
      btnPlug.classList.add('plugged');
      btnPlug.innerHTML = `<i data-lucide="x"></i> Disconnect`;
      createIcons({ icons: { X } });
      
      led.classList.add('charging');
      screenStatus.textContent = "CHARGING";
      screenStatus.style.color = "#fbbf24";
      legendStatus.textContent = "Charging... (12%)";
      legendStatus.style.color = "#fbbf24";

      // Setup timeline simulation
      let pct = { val: 12 };
      chargeTimeline = gsap.timeline();
      
      chargeTimeline.to(batteryLevel, {
        width: "56px", // fills up the 60px frame padding
        duration: 5,
        ease: "none"
      });

      chargeTimeline.to(pct, {
        val: 100,
        duration: 5,
        ease: "none",
        onUpdate: () => {
          const rounded = Math.round(pct.val);
          screenPercent.textContent = `${rounded}%`;
          legendStatus.textContent = `Charging... (${rounded}%)`;
        },
        onComplete: () => {
          led.classList.remove('charging');
          led.style.backgroundColor = "#10b981"; // static green
          screenStatus.textContent = "COMPLETE";
          screenStatus.style.color = "#10b981";
          legendStatus.textContent = "Fully Charged (100%)";
          legendStatus.style.color = "#10b981";
        }
      }, 0);

    } else {
      // Disconnect charger
      isCharging = false;
      if (chargeTimeline) {
        chargeTimeline.kill();
      }
      
      btnPlug.classList.remove('plugged');
      btnPlug.innerHTML = `<i data-lucide="zap"></i> Plug in Vehicle`;
      createIcons({ icons: { Zap } });

      led.classList.remove('charging');
      led.style.backgroundColor = "#fbbf24"; // back to orange standby
      screenStatus.textContent = "STANDBY";
      screenStatus.style.color = "#0ea5e9";
      screenPercent.textContent = "-- %";
      legendStatus.textContent = "0% (Disconnected)";
      legendStatus.style.color = "";
      
      gsap.to(batteryLevel, { width: 0, duration: 0.5 });
    }
  });
}

/* ==========================================================================
   8. Wind turbine rotation speed adjuster simulation
   ========================================================================== */
function initWindEnergy() {
  const windSlider = document.getElementById('wind-speed-slider');
  const lblCondition = document.getElementById('lbl-wind-condition');
  const lblSpeed = document.getElementById('lbl-wind-speed');
  const rpmStat = document.getElementById('turbine-rpm');
  const outputStat = document.getElementById('turbine-output');

  // Setup infinite rotating timelines
  const mainTurbineTween = gsap.to('#spinning-wind-blades', {
    rotation: 360,
    duration: 8,
    repeat: -1,
    ease: 'none',
    transformOrigin: 'center center'
  });

  const backTurbineTween = gsap.to('#spinning-wind-blades-back', {
    rotation: 360,
    duration: 10,
    repeat: -1,
    ease: 'none',
    transformOrigin: 'center center'
  });

  // Wind state catalog mapping
  const windStates = [
    { cond: "Calm", speed: "0 km/h", rpm: "0 RPM", output: "0 W", speedScale: 0 },
    { cond: "Light Air", speed: "5 km/h", rpm: "6 RPM", output: "45 W", speedScale: 0.3 },
    { cond: "Gentle Breeze", speed: "12 km/h", rpm: "18 RPM", output: "350 W", speedScale: 1.0 },
    { cond: "Fresh Breeze", speed: "28 km/h", rpm: "35 RPM", output: "1.2 kW", speedScale: 2.2 },
    { cond: "Strong Breeze", speed: "45 km/h", rpm: "52 RPM", output: "2.8 kW", speedScale: 3.5 },
    { cond: "Gale Storm", speed: "65 km/h", rpm: "72 RPM", output: "4.2 kW", speedScale: 5.0 },
    { cond: "Hurricane Force", speed: "90 km/h", rpm: "92 RPM", output: "5.5 kW", speedScale: 7.0 }
  ];

  // Set initial state
  updateWindTurbineSpeed(windSlider.value);

  windSlider.addEventListener('input', (e) => {
    updateWindTurbineSpeed(e.target.value);
  });

  function updateWindTurbineSpeed(index) {
    const idx = parseInt(index, 10);
    const state = windStates[idx];

    // Update labels
    lblCondition.textContent = state.cond;
    lblSpeed.textContent = state.speed;
    rpmStat.textContent = state.rpm;
    outputStat.textContent = state.output;

    // Dynamically adjust GSAP tween timescales
    gsap.to(mainTurbineTween, { timeScale: state.speedScale, duration: 0.8 });
    gsap.to(backTurbineTween, { timeScale: state.speedScale * 0.9, duration: 0.8 });
    
    // Highlight output text color when generating massive power
    if (idx >= 4) {
      outputStat.style.color = "#10b981"; // bright emerald green
    } else if (idx === 0) {
      outputStat.style.color = "#64748b"; // muted slate
    } else {
      outputStat.style.color = ""; // default green
    }
  }
}

/* ==========================================================================
   9. Counters numeric increment animations
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      onEnter: () => {
        let countVal = { val: 0 };
        gsap.to(countVal, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = Math.round(countVal.val).toLocaleString();
          }
        });
      }
    });
  });
}

/* ==========================================================================
   10. Filterable Project Case Gallery Grid
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCat === filterValue) {
          // Show matching items
          gsap.to(item, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            display: 'block',
            ease: 'power2.out'
          });
        } else {
          // Hide mismatched items
          gsap.to(item, {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            display: 'none',
            ease: 'power2.out'
          });
        }
      });
    });
  });
}

/* ==========================================================================
   11. Testimonial carousel controls
   ========================================================================== */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let autoPlayTimer = null;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  // Dots click events
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(slideIndex);
      resetAutoPlay();
    });
  });

  // Autoplay loop
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }, 6000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();
}

/* ==========================================================================
   12. FAQ Accordion panel sliders
   ========================================================================== */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const faqAnswer = faqItem.querySelector('.faq-answer');
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = '0px';
      });

      if (!isActive) {
        faqItem.classList.add('active');
        // Set dynamic height from scrollHeight
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   13. Contact form validated fields submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('consultation-form');
  const statusMsg = document.getElementById('form-status-msg');
  const whatsappBtn = document.getElementById('btn-whatsapp-chat');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Status text checking
    statusMsg.className = "form-status-msg";
    statusMsg.style.display = "block";
    statusMsg.textContent = "Checking details & booking slot...";

    // Mock API post request delay
    setTimeout(() => {
      const name = document.getElementById('frm-name').value;
      const service = document.getElementById('frm-service').value;

      statusMsg.className = "form-status-msg success";
      statusMsg.textContent = `Thank you, ${name}! Your site visit request for ${service.replace('-', ' ')} is submitted successfully. An engineer will call you shortly.`;
      
      form.reset();
    }, 1500);
  });

  // Direct WhatsApp click action
  whatsappBtn.addEventListener('click', () => {
    const phoneNumber = "18005550199";
    const message = encodeURIComponent("Hello AeroSolar! I would like to book a site visit consultation for my property.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  });
}
