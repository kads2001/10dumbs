/**
 * ============================================================================
 * NAVIGATION & HEADER MODULE
 * 10 Dumbs Inc. Production Frontend
 * ============================================================================
 */

import { $, $$, throttle } from './utilities.js';

export function initNavigation() {
  const header = $('.site-header');
  const toggleBtn = $('.mobile-menu-toggle');
  const navMenu = $('.nav-menu');
  const dropdownItems = $$('.nav-item.dropdown');

  // 1. Sticky Header Shadow on Scroll
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });
    handleScroll(); // Initial check
  }

  // 2. Mobile Menu Toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
      }
    });
  }

  // 3. Dropdown Accessibility
  dropdownItems.forEach((item) => {
    const toggle = $('.nav-link', item);
    const menu = $('.nav-dropdown-menu', item);

    if (toggle && menu) {
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
