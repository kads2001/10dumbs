/**
 * ============================================================================
 * JAVASCRIPT UTILITIES & DOM HELPERS
 * 10 Dumbs Inc. Production Frontend
 * ============================================================================
 */

/**
 * Safe querySelector helper
 * @param {string} selector
 * @param {Element|Document} [scope=document]
 * @returns {Element|null}
 */
export const $ = (selector, scope = document) => {
  try {
    return scope.querySelector(selector);
  } catch (err) {
    console.warn(`Invalid selector: ${selector}`, err);
    return null;
  }
};

/**
 * Safe querySelectorAll helper returning an Array
 * @param {string} selector
 * @param {Element|Document} [scope=document]
 * @returns {Element[]}
 */
export const $$ = (selector, scope = document) => {
  try {
    return Array.from(scope.querySelectorAll(selector));
  } catch (err) {
    console.warn(`Invalid selector: ${selector}`, err);
    return [];
  }
};

/**
 * Debounce function for performance-sensitive events (resize, input)
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 200) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function for high-frequency events (scroll)
 * @param {Function} fn
 * @param {number} limit
 * @returns {Function}
 */
export const throttle = (fn, limit = 100) => {
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

/**
 * Check if the user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
