# 10 Dumbs Inc. — Frontend Architecture & Design System

A production-grade, modular frontend project built strictly using **Vanilla HTML5, CSS3, and Modern Vanilla JavaScript (ES6+)**.

---

## 1. Core Principles

- **Zero Framework Bloat**: No React, Next.js, Vue, Tailwind CSS, or unnecessary Bootstrap/jQuery dependencies.
- **Strict CSS Architecture**: Single source of truth using native CSS Custom Properties (`:root`), modular stylesheets, fluid typography, and zero `!important` declarations.
- **Modular Vanilla JavaScript**: ES6 modules (`type="module"`), isolated component handlers, event delegation, and null-safe DOM querying.
- **Semantic HTML5 & Accessibility**: Proper heading hierarchy, ARIA attributes, keyboard navigability, and responsive fluid containers.

---

## 2. Project Directory Structure

```
10dumbs/
│
├── index5.html                 # Primary Homepage
├── img/                        # Core image and logo assets
│
├── assets/
│   ├── images/                 # Optimized brand and media assets
│   ├── icons/                  # SVG icons and favicons
│   ├── fonts/                  # Custom typography files
│   └── videos/                 # Video presentations and background loops
│
├── css/
│   ├── style.css               # Core CSS (Design Tokens, Reset, Typography, Layout, Components, Utilities)
│   └── responsive.css          # Breakpoint media queries (1024px, 900px, 600px)
│
├── js/
│   ├── utilities.js            # DOM helpers ($, $$, debounce, throttle, prefersReducedMotion)
│   ├── navigation.js           # Header sticky effect, mobile hamburger toggle, dropdowns
│   ├── components.js           # Accordion, stat counters, contact form, chatbot
│   ├── animations.js           # IntersectionObserver scroll reveals
│   └── main.js                 # Unified application lifecycle initialization (DOMContentLoaded)
│
└── README.md                   # Complete architectural guide and development standards
```

---

## 3. CSS Architecture & Organization

Styles are structured into two clean files:

1. **`style.css`**: Complete design system, design tokens (`:root`), reset, fluid typography, container & layout, components, and utilities.
2. **`responsive.css`**: Clean, grouped media queries for tablet (1024px), small tablet / mobile landscape (900px), and mobile phones (600px).

### Design Tokens (`css/variables.css` Summary)

```css
:root {
  /* Brand Colors */
  --color-primary: #1877f2;
  --color-primary-hover: #0d62d4;
  --color-accent: #f15a24;
  --color-dark-bg: #0e0e11;
  --color-dark-surface: #151518;
  --color-light-bg: #ffffff;
  --color-light-surface: #fafbfc;
  --color-text-main: #111111;
  --color-text-muted: #666666;

  /* Fluid Typography Scale */
  --fs-display: clamp(2.5rem, 5vw + 1rem, 4rem);
  --fs-h1: clamp(2.25rem, 4vw + 0.8rem, 3.75rem);
  --fs-h2: clamp(1.85rem, 3vw + 0.6rem, 2.75rem);
  --fs-h3: clamp(1.35rem, 2vw + 0.4rem, 1.75rem);
  --fs-h4: clamp(1.1rem, 1.2vw + 0.2rem, 1.35rem);
  --fs-body: 1rem;
  --fs-body-sm: 0.875rem;
  --fs-caption: 0.75rem;

  /* Spacing Scale */
  --space-3xs: 0.25rem;  /* 4px */
  --space-2xs: 0.5rem;   /* 8px */
  --space-xs: 0.75rem;   /* 12px */
  --space-sm: 1rem;      /* 16px */
  --space-md: 1.5rem;    /* 24px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 3rem;      /* 48px */
  --space-2xl: 4rem;     /* 64px */

  /* Global Container */
  --container-max-width: 1280px;
  --container-width: min(100% - 40px, var(--container-max-width));
}
```

---

## 4. JavaScript Architecture

The JavaScript system is modular and initializes cleanly from `js/main.js`:

```javascript
import { initNavigation } from './navigation.js';
import { initAccordion, initCounters, initContactForm, initChatbot } from './components.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccordion();
  initCounters();
  initContactForm();
  initChatbot();
  initAnimations();
});
```

### Module Responsibilities:
- **`utilities.js`**: Safe DOM selection (`$`, `$$`), `debounce`, `throttle`, and accessibility helpers.
- **`navigation.js`**: Header scroll events, ARIA-compliant mobile hamburger menu toggle, keyboard accessibility.
- **`components.js`**: Accordion interactions with `aria-expanded`, animated counter numbers via `IntersectionObserver`, chatbot interaction loop, form validation.
- **`animations.js`**: Scroll-triggered element reveals with `prefers-reduced-motion` compliance.

---

## 5. UI Component Catalog

| Component | Selector | Description |
|---|---|---|
| **Buttons** | `.btn`, `.btn-primary`, `.btn-dark`, `.btn-white`, `.btn-glass`, `.btn-outline-primary` | Standard pill buttons with optional `.btn-icon-circle` |
| **Section Badge** | `.section-badge` | Coral dot indicator with uppercase category text |
| **Stats Card** | `.stat-card`, `.stat-value`, `.stat-title`, `.stat-desc` | 4-column statistical callout card with animated counters |
| **Service Card** | `.service-card`, `.service-thumbnail`, `.service-tags`, `.tag-pill` | Dark surface service showcase card with tags and circular arrow |
| **Marquee** | `.marquee-wrapper`, `.marquee-row`, `.marquee-track` | CSS-powered infinite logo loop with linear motion |
| **Portfolio Card**| `.portfolio-card`, `.portfolio-image-wrap`, `.portfolio-tags` | 2-column masonry showcase with floating category tags |
| **Accordion** | `.accordion-list`, `.accordion-item`, `.accordion-header`, `.accordion-body` | Accessible collapsible accordion with toggle icon |
| **Chatbot** | `.chatbot-trigger`, `.chatbot-modal`, `.chatbot-header`, `.chatbot-body` | Floating interactive lead-generation assistant |

---

## 6. Development Rules & Quality Checklist

1. **No Inline or Internal Styles**: All styles belong in `css/*.css`.
2. **Zero `!important`**: Manage specificity using standard element + class hierarchies.
3. **Use Design Tokens**: Never hardcode colors like `#1877f2` or margins like `24px` directly. Use `var(--color-primary)` and `var(--space-md)`.
4. **Accessibility First**:
   - Always use proper `<button>` elements for interactive click targets.
   - Maintain `alt` text for images.
   - Include ARIA attributes (`aria-expanded`, `aria-label`) on toggles.
5. **Clean JavaScript**:
   - Avoid global variables.
   - Check if an element exists before adding listeners.
   - Use `const` and `let` (no `var`).
