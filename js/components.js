/**
 * ============================================================================
 * INTERACTIVE COMPONENTS MODULE
 * 10 Dumbs Inc. Production Frontend
 * ============================================================================
 */

import { $, $$, prefersReducedMotion } from './utilities.js';

/**
 * Initialize Accordions with Accessible ARIA Controls
 */
export function initAccordion() {
  const accordionItems = $$('.accordion-item');

  accordionItems.forEach((item) => {
    const header = $('.accordion-header', item);
    const body = $('.accordion-body', item);

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');
      const parentList = item.closest('.accordion-list');

      // If in a single-expand accordion list, close siblings
      if (parentList) {
        $$('.accordion-item', parentList).forEach((sibling) => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const siblingHeader = $('.accordion-header', sibling);
            if (siblingHeader) siblingHeader.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Toggle current item
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

/**
 * Initialize Stat Number Counters with IntersectionObserver
 */
export function initCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.target || '0';
    });
    return;
  }

  const runCounterAnimation = (counter) => {
    const target = Number(counter.dataset.target) || 0;
    const duration = 1600; // ms
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease-out cubic formula
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easeOutProgress * target);

      counter.textContent = currentVal.toLocaleString();

      if (frame >= totalFrames) {
        counter.textContent = target.toLocaleString();
        clearInterval(counterInterval);
      }
    }, frameRate);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        runCounterAnimation(counter);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach((counter) => observer.observe(counter));
}

/**
 * Initialize Contact Form with Client-Side Feedback
 */
export function initContactForm() {
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
    }, 800);
  });
}

/**
 * Initialize Interactive Chatbot Widget
 */
export function initChatbot() {
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
      }, 400);
    } else if (step === 2) {
      chatData.phone = text;
      appendMessage(text, 'user');
      step = 3;
      setTimeout(() => {
        appendMessage('Thank you! What are your project requirements or goals?');
      }, 400);
    } else if (step === 3) {
      chatData.message = text;
      appendMessage(text, 'user');
      isFinished = true;
      setTimeout(() => {
        appendMessage('Got it! Our team has received your details and will get in touch with you shortly. Have a great day! 🎉');
      }, 500);
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
