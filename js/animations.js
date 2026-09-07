/**
 * ============================================================================
 * ANIMATIONS & MOTION MODULE
 * 10 Dumbs Inc. Production Frontend
 * ============================================================================
 */

import { $$, prefersReducedMotion } from './utilities.js';

export function initAnimations() {
  if (prefersReducedMotion()) return;

  // 1. Subtle Scroll Reveal Elements
  const revealElements = $$('[data-reveal]');
  if (!revealElements.length || !('IntersectionObserver' in window)) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    [data-reveal].revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}
