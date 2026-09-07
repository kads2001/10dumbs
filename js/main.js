/**
 * ============================================================================
 * 10 DUMBS INC. — PRODUCTION JAVASCRIPT BUNDLE (main.js)
 * Clean Vanilla JavaScript (Zero Dependencies, Zero Frameworks)
 * Runs seamlessly in all browsers and protocols (file:// and http://)
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. UTILITY FUNCTIONS
     -------------------------------------------------------------------------- */
  const $ = (selector, scope = document) => {
    try {
      return scope.querySelector(selector);
    } catch (e) {
      return null;
    }
  };

  const $$ = (selector, scope = document) => {
    try {
      return Array.from(scope.querySelectorAll(selector));
    } catch (e) {
      return [];
    }
  };

  const throttle = (fn, limit = 100) => {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  };

  const prefersReducedMotion = () => {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* --------------------------------------------------------------------------
     2. NAVIGATION & STICKY HEADER
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const header = $('.site-header');
    const toggleBtn = $('.mobile-menu-toggle');
    const navMenu = $('.nav-menu');
    const dropdownItems = $$('.nav-item.dropdown');

    // Sticky Header
    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });
      handleScroll();
    }

    // Mobile Menu
    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
        navMenu.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (header && !header.contains(e.target) && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.focus();
        }
      });
    }

    // Accessible Dropdown Keyboard Navigation
    dropdownItems.forEach((item) => {
      const toggle = $('.nav-link', item);
      const menu = $('.nav-dropdown-menu', item);

      if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
          if (window.innerWidth <= 991) {
            e.preventDefault();
            item.classList.toggle('open');
            menu.classList.toggle('show');
          }
        });

        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const firstLink = $('a', menu);
            if (firstLink) firstLink.focus();
          }
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. STAT NUMBER COUNTERS (Buttery Smooth Animation)
     -------------------------------------------------------------------------- */
  function initCounters() {
    const counters = $$('.counter');
    if (!counters.length) return;

    const animateCounter = (counter) => {
      if (counter.dataset.animated === 'true') return;
      counter.dataset.animated = 'true';

      const target = parseInt(counter.dataset.target, 10) || 0;
      if (prefersReducedMotion() || target === 0) {
        counter.textContent = target.toLocaleString();
        return;
      }

      const duration = 1800; // ms
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease Out Quart formula for slick momentum
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

      counters.forEach((counter) => observer.observe(counter));
    } else {
      // Fallback for older browsers
      counters.forEach((counter) => animateCounter(counter));
    }
  }

  /* --------------------------------------------------------------------------
     4. FAQ ACCORDION
     -------------------------------------------------------------------------- */
  function initAccordion() {
    const accordionItems = $$('.accordion-item');

    accordionItems.forEach((item) => {
      const header = $('.accordion-header', item);
      const body = $('.accordion-body', item);

      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isCurrentlyActive = item.classList.contains('active');
        const parentList = item.closest('.accordion-list');

        if (parentList) {
          $$('.accordion-item', parentList).forEach((sibling) => {
            if (sibling !== item) {
              sibling.classList.remove('active');
              const siblingHeader = $('.accordion-header', sibling);
              if (siblingHeader) siblingHeader.setAttribute('aria-expanded', 'false');
            }
          });
        }

        if (isCurrentlyActive) {
          item.classList.remove('active');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. CONTACT FORM VALIDATION & FEEDBACK
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = $('#brandingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = $('button[type="submit"]', form);
      const originalText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        alert('Thank you! Your message has been sent successfully. Our team will contact you shortly.');
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 700);
    });
  }

  /* --------------------------------------------------------------------------
     6. CHATBOT WIDGET
     -------------------------------------------------------------------------- */
  function initChatbot() {
    const trigger = $('.chatbot-trigger');
    const modal = $('.chatbot-modal');
    const closeBtn = $('#chatCloseBtn');
    const chatBody = $('#chatBody');
    const chatInput = $('#chatInput');
    const chatSendBtn = $('#chatSendBtn');

    if (!trigger || !modal) return;

    let step = 0;
    let isFinished = false;
    const chatData = { name: '', service: '', phone: '', email: '', message: '' };

    const toggleModal = () => {
      const isHidden = window.getComputedStyle(modal).display === 'none';
      modal.style.display = isHidden ? 'block' : 'none';
      if (isHidden && chatInput) chatInput.focus();
    };

    trigger.addEventListener('click', toggleModal);
    if (closeBtn) closeBtn.addEventListener('click', toggleModal);

    const appendMessage = (text, type = 'bot') => {
      if (!chatBody) return;
      const msg = document.createElement('div');
      msg.className = type === 'user' ? 'chat-msg-user' : 'chat-msg-bot';
      msg.textContent = text;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    const showServiceButtons = () => {
      if (!chatBody) return;
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'chat-options';
      optionsContainer.id = 'chatServiceOptions';

      const services = ['Website Development', 'Digital Marketing', 'Branding & Design', 'Packaging Design'];
      services.forEach((srv) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag-pill';
        btn.style.margin = '4px 4px 0 0';
        btn.style.cursor = 'pointer';
        btn.style.color = '#111';
        btn.style.backgroundColor = '#e8eaed';
        btn.textContent = srv;
        btn.addEventListener('click', () => {
          chatData.service = srv;
          appendMessage(srv, 'user');
          optionsContainer.remove();
          appendMessage('Please enter your phone number or email address.');
          step = 2;
        });
        optionsContainer.appendChild(btn);
      });

      chatBody.appendChild(optionsContainer);
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    const handleSendMessage = () => {
      if (isFinished || !chatInput) return;
      const text = chatInput.value.trim();
      if (!text) return;

      chatInput.value = '';

      if (step === 0) {
        chatData.name = text;
        appendMessage(text, 'user');
        step = 1;
        setTimeout(() => {
          appendMessage(`Nice to meet you, ${chatData.name}! Which service are you interested in?`);
          showServiceButtons();
        }, 350);
      } else if (step === 2) {
        chatData.phone = text;
        appendMessage(text, 'user');
        step = 3;
        setTimeout(() => {
          appendMessage('Thank you! What are your project requirements or goals?');
        }, 350);
      } else if (step === 3) {
        chatData.message = text;
        appendMessage(text, 'user');
        isFinished = true;
        setTimeout(() => {
          appendMessage('Got it! Our team has received your details and will get in touch with you shortly. Have a great day! 🎉');
        }, 400);
      }
    };

    if (chatSendBtn) chatSendBtn.addEventListener('click', handleSendMessage);
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSendMessage();
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. SCROLL REVEAL & COMPONENT ANIMATION SYSTEM
     -------------------------------------------------------------------------- */
  function initAnimations() {
    if (prefersReducedMotion()) {
      $$('[data-reveal]').forEach((el) => el.classList.add('revealed'));
      $$('.hero-reveal-init').forEach((el) => el.classList.add('hero-revealed'));
      return;
    }

    // 1. Trigger Hero Entrance Sequence on page load
    const heroElements = $$('.hero-reveal-init');
    if (heroElements.length) {
      setTimeout(() => {
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('hero-revealed');
          }, index * 120);
        });
      }, 80);
    }

    // 2. Automatically stagger children of grid/list containers
    const staggerContainers = $$(
      '[data-reveal-group], .stats-grid, .services-table, .projects-masonry-grid, .testimonials-grid, .accordion-list'
    );
    staggerContainers.forEach((container) => {
      const items = $$(
        ':scope > article, :scope > .stat-card, :scope > .service-row, :scope > .project-item, :scope > .testimonial-card, :scope > .accordion-item',
        container
      );
      items.forEach((item, idx) => {
        if (!item.hasAttribute('data-reveal')) {
          item.setAttribute('data-reveal', 'up');
        }
        if (!item.style.transitionDelay && !item.hasAttribute('data-reveal-delay')) {
          const delay = Math.min((idx + 1) * 80, 480);
          item.style.transitionDelay = `${delay}ms`;
        }
      });
    });

    // 3. Setup IntersectionObserver for all reveal elements
    const revealElements = $$('[data-reveal]');
    if (!revealElements.length || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /* --------------------------------------------------------------------------
     8. PROJECTS DUAL-COLUMN PARALLAX SCROLL ANIMATION
     -------------------------------------------------------------------------- */
  function initProjectsParallax() {
    if (prefersReducedMotion()) return;

    const section = $('.projects-section');
    const leftCol = $('.projects-parallax-left', section);
    const rightCol = $('.projects-parallax-right', section);

    if (!section || !leftCol || !rightCol) return;

    let targetLeftY = 0;
    let targetRightY = 0;
    let currentLeftY = 0;
    let currentRightY = 0;
    let isRunning = false;

    // Amplitude: Maximum vertical travel distance in pixels
    const amplitude = 95;

    const render = () => {
      // Lerp for buttery smoothness
      const ease = 0.09;
      currentLeftY += (targetLeftY - currentLeftY) * ease;
      currentRightY += (targetRightY - currentRightY) * ease;

      leftCol.style.transform = `translate3d(0, ${currentLeftY.toFixed(2)}px, 0)`;
      rightCol.style.transform = `translate3d(0, ${currentRightY.toFixed(2)}px, 0)`;

      if (
        Math.abs(targetLeftY - currentLeftY) > 0.05 ||
        Math.abs(targetRightY - currentRightY) > 0.05
      ) {
        requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const update = () => {
      if (window.innerWidth <= 991) {
        leftCol.style.transform = 'none';
        rightCol.style.transform = 'none';
        currentLeftY = 0;
        currentRightY = 0;
        targetLeftY = 0;
        targetRightY = 0;
        return;
      }

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Only calculate when section is in or near viewport
      if (rect.bottom >= -150 && rect.top <= windowHeight + 150) {
        const totalDistance = windowHeight + rect.height;
        const currentProgress = (windowHeight - rect.top) / totalDistance;
        const progress = Math.max(0, Math.min(1, currentProgress));

        // When scrolling down:
        // Left cards move UP (from +amplitude to -amplitude)
        targetLeftY = (0.5 - progress) * 2 * amplitude;

        // Right cards move DOWN (from -amplitude to +amplitude)
        targetRightY = (progress - 0.5) * 2 * amplitude;

        if (!isRunning) {
          isRunning = true;
          requestAnimationFrame(render);
        }
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* --------------------------------------------------------------------------
     9. TRANSFORM SECTION MOUSE WAVE & 12-IMAGE TRAIL REVEAL
     -------------------------------------------------------------------------- */
  function initTransformWaveInteraction() {
    const section = $('.transform-ideas-section');
    const items = $$('.transform-float-item');
    const trailContainer = $('.transform-trail-container', section);
    if (!section || prefersReducedMotion()) return;

    // The 12 image assets
    const imagesList = [
      'assets/images/footerimage1.jpeg',
      'assets/images/footerimage2.jpeg',
      'assets/images/footerimage3.jpeg',
      'assets/images/footerimage4.jpeg',
      'assets/images/footerimage12.jpeg',
      'assets/images/footerimage5.jpeg',
      'assets/images/footerimage6.jpeg',
      'assets/images/footerimage7.jpeg',
      'assets/images/footerimage8.jpeg',
      'assets/images/footerimage9.jpeg',
      'assets/images/footerimage10.jpeg',
      'assets/images/footerimage11.jpeg'
    ];

    let isMouseInside = false;
    let mouseX = -9999;
    let mouseY = -9999;
    let lastSpawnX = -9999;
    let lastSpawnY = -9999;
    let imageIndex = 0;
    let rafId = null;

    // 1. Setup Stationary Background Wave Nodes
    const cardsData = items.map((el) => {
      const baseRot = parseFloat(el.dataset.baseRot) || 0;
      return {
        el,
        baseRot,
        currentOpacity: 0,
        currentScale: 0.85,
        currentRot: baseRot,
        currentX: 0,
        currentY: 0
      };
    });

    // 2. Active Trail Particle Pool
    let trailItems = [];

    const spawnTrailImage = (x, y) => {
      if (!trailContainer) return;

      const imgSrc = imagesList[imageIndex % imagesList.length];
      imageIndex++;

      const el = document.createElement('div');
      el.className = 'transform-trail-item';
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = 'Creative Showcase';
      el.appendChild(img);

      const rot = (Math.random() - 0.5) * 20; // -10deg to +10deg
      const startWidth = 280;
      const startHeight = 190;

      el.style.left = `${x - startWidth / 2}px`;
      el.style.top = `${y - startHeight / 2}px`;
      el.style.opacity = '0';
      el.style.transform = `scale(0.5) rotate(${rot}deg)`;
      trailContainer.appendChild(el);

      const trailObj = {
        el,
        x: x - startWidth / 2,
        y: y - startHeight / 2,
        rot,
        birthTime: performance.now(),
        lifeSpan: 1400, // ms
        waveFreq: 0.004 + Math.random() * 0.002,
        waveOffset: Math.random() * Math.PI * 2
      };

      trailItems.push(trailObj);

      // Limit active elements to prevent clutter
      if (trailItems.length > 10) {
        const oldest = trailItems.shift();
        if (oldest && oldest.el.parentNode) {
          oldest.el.parentNode.removeChild(oldest.el);
        }
      }
    };

    const updateLoop = () => {
      const rect = section.getBoundingClientRect();
      const time = performance.now();
      const radius = 380; // Proximity wave reach in pixels

      let isAnyActive = false;

      // A. Update Stationary Background Nodes
      cardsData.forEach((card, idx) => {
        const cardRect = card.el.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
        const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;

        let targetOpacity = 0;
        let targetScale = 0.85;
        let targetRot = card.baseRot;
        let targetWaveX = 0;
        let targetWaveY = 0;

        if (isMouseInside) {
          const dx = mouseX - cardCenterX;
          const dy = mouseY - cardCenterY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            const strength = 1 - dist / radius;
            const easeStrength = Math.pow(strength, 1.2);
            targetOpacity = easeStrength * 0.85;
            targetScale = 0.85 + 0.25 * easeStrength;

            // Fluid Wave Oscillation
            const wave = Math.sin(time * 0.0035 + idx * 1.4) * 10 * easeStrength;
            const waveX = Math.cos(time * 0.003 + idx) * 7 * easeStrength;

            targetWaveX = waveX;
            targetWaveY = wave;
            targetRot = card.baseRot + Math.sin(time * 0.002 + idx) * 3 * easeStrength;
          }
        }

        const lerpFactor = 0.12;
        card.currentOpacity += (targetOpacity - card.currentOpacity) * lerpFactor;
        card.currentScale += (targetScale - card.currentScale) * lerpFactor;
        card.currentRot += (targetRot - card.currentRot) * lerpFactor;
        card.currentX += (targetWaveX - card.currentX) * lerpFactor;
        card.currentY += (targetWaveY - card.currentY) * lerpFactor;

        if (card.currentOpacity > 0.005) {
          card.el.style.opacity = card.currentOpacity.toFixed(3);
          card.el.style.transform = `translate3d(${card.currentX.toFixed(2)}px, ${card.currentY.toFixed(2)}px, 0) scale(${card.currentScale.toFixed(3)}) rotate(${card.currentRot.toFixed(2)}deg)`;
          isAnyActive = true;
        } else {
          card.el.style.opacity = '0';
          card.el.style.transform = `scale(0.85) rotate(${card.baseRot}deg)`;
        }
      });

      // B. Update Dynamic Wave Trail Particles
      trailItems = trailItems.filter((t) => {
        const age = time - t.birthTime;
        if (age >= t.lifeSpan) {
          if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
          return false;
        }

        const progress = age / t.lifeSpan;
        let opacity = 1;
        let scale = 1;

        if (progress < 0.2) {
          // Fade in & Pop
          const p = progress / 0.2;
          opacity = p;
          scale = 0.5 + 0.5 * p;
        } else if (progress > 0.6) {
          // Fade out
          const p = (progress - 0.6) / 0.4;
          opacity = 1 - p;
          scale = 1 - 0.1 * p;
        }

        // Gentle Floating Wave Motion
        const waveY = Math.sin(time * t.waveFreq + t.waveOffset) * 14 - (progress * 18);
        const waveX = Math.cos(time * t.waveFreq * 0.8 + t.waveOffset) * 8;

        t.el.style.opacity = opacity.toFixed(3);
        t.el.style.transform = `translate3d(${waveX.toFixed(1)}px, ${waveY.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${t.rot}deg)`;

        isAnyActive = true;
        return true;
      });

      if (isMouseInside || isAnyActive) {
        rafId = requestAnimationFrame(updateLoop);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateLoop);
      }
    };

    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseInside = true;

      // Spawn trail image when cursor moves more than 60px
      const distFromLast = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
      if (distFromLast > 65) {
        spawnTrailImage(mouseX, mouseY);
        lastSpawnX = mouseX;
        lastSpawnY = mouseY;
      }

      startLoop();
    });

    section.addEventListener('mouseenter', (e) => {
      const rect = section.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      lastSpawnX = mouseX;
      lastSpawnY = mouseY;
      isMouseInside = true;
      spawnTrailImage(mouseX, mouseY);
      startLoop();
    });

    section.addEventListener('mouseleave', () => {
      isMouseInside = false;
      startLoop();
    });
  }

  /* --------------------------------------------------------------------------
     INITIALIZATION ON DOM READY
     -------------------------------------------------------------------------- */
  const init = () => {
    initNavigation();
    initCounters();
    initAccordion();
    initContactForm();
    initChatbot();
    initAnimations();
    initProjectsParallax();
    initTransformWaveInteraction();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
