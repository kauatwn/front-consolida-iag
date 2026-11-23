---
name: 'Consolida IAG'
colors:
  primary: '#00172c'
  on-primary: '#ffffff'
  primary-container: '#122c44'
  on-primary-container: '#7c94b0'
  secondary: '#a23e18'
  on-secondary: '#ffffff'
  secondary-container: '#fe8357'
  on-secondary-container: '#6f2000'
  tertiary: '#001b0f'
  on-tertiary: '#ffffff'
  tertiary-container: '#003220'
  on-tertiary-container: '#5d9f7f'
  surface: '#f8f9fb'
  on-surface: '#191c1e'
  surface-variant: '#e0e3e5'
  on-surface-variant: '#43474d'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  background: '#f8f9fb'
  on-background: '#191c1e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  inverse-primary: '#b0c9e7'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  outline-subtle: '#e2e5ea'
  accent-soft: '#fdf6f2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
typography:
  primary-font: 'Work Sans'
  mono-font: 'JetBrains Mono'
spacing:
  xs: 0.375rem
  sm: 0.75rem
  md: 1.25rem
  lg: 2rem
  xl: 3rem
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  max-width-content: 42rem
---

# Design System: Consolida IAG

> Sistema de identidade visual e diretrizes de UI para o totem/kiosk de pedidos semanais de insumos do Instituto Anchieta Grajaú.

## 1. Design Principles

### Institucional

The interface reflects the trust and seriousness of a welfare institution. Visual choices prioritize credibility — navy blue as the dominant color, clean whitespace, and restrained use of accent color.

### Accessibility-First

Every interactive element meets WCAG 2.1 AA contrast ratios. Text sizes are generous, focus states are always visible, and semantic HTML with ARIA roles underpins all components. No information is conveyed by color alone.

### Kiosk-Optimized

The app runs on a wall-mounted totem with touch input only. Interaction targets are never below 44 × 44 px. Horizontal swipe gestures are suppressed. `user-select: none` prevents accidental text selection. The layout assumes no keyboard is available.

### Mobile-First

Layout is a single-column flow capped at `max-w-2xl` (~42 rem). Components stack vertically and rely on `dvh`/`svh` viewport units to handle device chrome correctly. All touch feedback is instantaneous (no hover-only affordances).

---

## 2. Visual Identity

### Brand Personality

Calm, trustworthy, institutional. The design should feel like a well-run school cafeteria — organized, legible, and efficient — not a consumer retail app.

### Color Mood

Deep navy (`#00172c`) anchors every screen as the primary brand color, used for headers, primary actions, and key labels. Terracotta/rust (`#a23e18`) is the accent: used only for primary CTAs, active states, and highlights — never for large fills. Blue-gray surfaces (`#f8f9fb` / `#eceef0`) give the UI a cool, airy quality that contrasts gently with the warm accent.

### Typographic Mood

Work Sans provides a friendly yet professional feel — slightly humanist, legible at small sizes. JetBrains Mono is reserved for numeric data (quantities, prices, counts), giving those values a precise, structured appearance without feeling cold.

---

## 3. Color System

All tokens live in the `@theme` block of `src/styles.css` and are consumed as CSS custom properties.

### Primary — Navy

| Token                              | Hex       | Semantic Use                                 |
| ---------------------------------- | --------- | -------------------------------------------- |
| `--color-primary`                  | `#00172c` | App bar bg, primary button bg, key headings  |
| `--color-on-primary`               | `#ffffff` | Text/icons on primary surfaces               |
| `--color-primary-container`        | `#122c44` | Elevated primary surface (e.g. modal header) |
| `--color-on-primary-container`     | `#7c94b0` | Text on primary-container                    |
| `--color-primary-fixed`            | `#d0e4ff` | Light tint of primary (chips bg on dark)     |
| `--color-primary-fixed-dim`        | `#b0c9e7` | Dimmed primary-fixed                         |
| `--color-on-primary-fixed`         | `#001d34` | Text on primary-fixed                        |
| `--color-on-primary-fixed-variant` | `#314962` | Secondary text on primary-fixed              |
| `--color-inverse-primary`          | `#b0c9e7` | Primary on dark/inverse surfaces             |

### Secondary — Terracotta / Rust

| Token                                | Hex       | Semantic Use                               |
| ------------------------------------ | --------- | ------------------------------------------ |
| `--color-secondary`                  | `#a23e18` | CTA buttons, active indicators, focus ring |
| `--color-on-secondary`               | `#ffffff` | Text/icons on secondary surfaces           |
| `--color-secondary-container`        | `#fe8357` | Soft secondary fill (badges, chips)        |
| `--color-on-secondary-container`     | `#6f2000` | Text on secondary-container                |
| `--color-secondary-fixed`            | `#ffdbcf` | Pale terracotta tint                       |
| `--color-secondary-fixed-dim`        | `#ffb4a1` | Dimmed secondary-fixed                     |
| `--color-on-secondary-fixed`         | `#390c00` | Text on secondary-fixed                    |
| `--color-on-secondary-fixed-variant` | `#822801` | Secondary text on secondary-fixed          |

### Tertiary — Forest Green

| Token                               | Hex       | Semantic Use                      |
| ----------------------------------- | --------- | --------------------------------- |
| `--color-tertiary`                  | `#001b0f` | Deep green (rarely used directly) |
| `--color-on-tertiary`               | `#ffffff` | Text on tertiary                  |
| `--color-tertiary-container`        | `#003220` | Green surface for success states  |
| `--color-on-tertiary-container`     | `#5d9f7f` | Text on tertiary-container        |
| `--color-tertiary-fixed`            | `#adf1cd` | Pale green tint                   |
| `--color-tertiary-fixed-dim`        | `#91d5b2` | Dimmed tertiary-fixed             |
| `--color-on-tertiary-fixed`         | `#002114` | Text on tertiary-fixed            |
| `--color-on-tertiary-fixed-variant` | `#035137` | Secondary text on tertiary-fixed  |

### Surface — Blue-Gray

| Token                               | Hex       | Semantic Use                       |
| ----------------------------------- | --------- | ---------------------------------- |
| `--color-surface`                   | `#f8f9fb` | App background, card base          |
| `--color-on-surface`                | `#191c1e` | Body text, default icon color      |
| `--color-surface-variant`           | `#e0e3e5` | Chip/pill background, divider fill |
| `--color-on-surface-variant`        | `#43474d` | Secondary text, placeholder        |
| `--color-surface-dim`               | `#d8dadc` | Pressed/disabled surface           |
| `--color-surface-bright`            | `#f8f9fb` | Elevated card surfaces             |
| `--color-surface-container-lowest`  | `#ffffff` | Modals, overlaid sheets            |
| `--color-surface-container-low`     | `#f2f4f6` | Input fields, inline containers    |
| `--color-surface-container`         | `#eceef0` | Cards, section containers          |
| `--color-surface-container-high`    | `#e6e8ea` | Pressed card state                 |
| `--color-surface-container-highest` | `#e0e3e5` | Strongly elevated container        |
| `--color-inverse-surface`           | `#2d3133` | Dark snackbar/toast bg             |
| `--color-inverse-on-surface`        | `#eff1f3` | Text on inverse surface            |

### Background

| Token                   | Hex       | Semantic Use         |
| ----------------------- | --------- | -------------------- |
| `--color-background`    | `#f8f9fb` | Root page background |
| `--color-on-background` | `#191c1e` | Text over background |

### Outline & Borders

| Token                     | Hex       | Semantic Use                                       |
| ------------------------- | --------- | -------------------------------------------------- |
| `--color-outline`         | `#74777e` | Medium borders, text field outlines                |
| `--color-outline-variant` | `#c3c6ce` | Subtle dividers, separator lines                   |
| `--color-outline-subtle`  | `#e2e5ea` | Very subtle borders (category pills, card borders) |

### Extended Accents

| Token                 | Hex       | Semantic Use                                                |
| --------------------- | --------- | ----------------------------------------------------------- |
| `--color-accent-soft` | `#fdf6f2` | Warm blush bg for selected items (e.g. active product card) |

### Semantic

| Token                        | Hex       | Semantic Use                          |
| ---------------------------- | --------- | ------------------------------------- |
| `--color-error`              | `#ba1a1a` | Error state text/icon                 |
| `--color-on-error`           | `#ffffff` | Text on error                         |
| `--color-error-container`    | `#ffdad6` | Error background (validation banners) |
| `--color-on-error-container` | `#93000a` | Text on error-container               |

---

## 4. Typography

### Font Families

| Role                          | Family         | CSS Token                                           |
| ----------------------------- | -------------- | --------------------------------------------------- |
| Body, headings, labels        | Work Sans      | `--font-sans`, `--font-body-*`, `--font-headline-*` |
| Numbers, quantities, metadata | JetBrains Mono | `--font-mono`, `--font-label-numeric`               |

Work Sans is loaded via Google Fonts with weights 400, 500, 600, 700. JetBrains Mono is loaded with weights 500, 700. Both include the Latin-ext subset for Portuguese diacritics (ã, ç, õ, etc.).

### Type Scale

| Name            | Size             | Weight  | Line Height | Font           | Use                                  |
| --------------- | ---------------- | ------- | ----------- | -------------- | ------------------------------------ |
| `display-lg`    | 1.75rem (28px)   | 700     | 1.15        | Work Sans      | Screen titles, section headers       |
| `headline-lg`   | 1.375rem (22px)  | 600     | 1.2         | Work Sans      | Category name in app bar             |
| `headline-md`   | 1.125rem (18px)  | 600     | 1.25        | Work Sans      | Product name in card                 |
| `body-lg`       | 1rem (16px)      | 400     | 1.5         | Work Sans      | Descriptions, body copy              |
| `body-md`       | 0.875rem (14px)  | 400     | 1.5         | Work Sans      | Secondary descriptions, captions     |
| `caption`       | 0.75rem (12px)   | 400     | 1.4         | Work Sans      | Tags, unit labels, timestamps        |
| `label-badge`   | 0.75rem (12px)   | 600     | 1           | Work Sans      | Cart count badge, status chips       |
| `label-numeric` | 0.9375rem (15px) | 500/700 | 1           | JetBrains Mono | Quantities, cart totals, item counts |

> **Rule:** Any number that a kitchen leader reads and acts on (quantity entered, cart total, step count) uses JetBrains Mono weight 700. Supporting numeric context (unit "kg", "cx") uses weight 500.

---

## 5. Spacing & Layout

### Layout Structure

The app uses a **single-column centered layout** with a maximum content width of `max-w-2xl` (~42rem / 672px). On wider screens the content area is centered with auto margins. The page never scrolls horizontally.

```text
┌─────────────────────────────────────┐
│          App Header (sticky)        │  ← full-width, navy bg
├─────────────────────────────────────┤
│      Category Scroll Pills (sticky) │  ← full-width, surface bg
├─────────────────────────────────────┤
│                                     │
│    ┌───────────────────────────┐    │
│    │       Product Cards       │    │  ← max-w-2xl, padded gutter
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│        Cart Summary Bar (fixed)     │  ← full-width, above safe area
└─────────────────────────────────────┘
```

### Spacing Tokens

| Token                     | Value            | Typical Use                           |
| ------------------------- | ---------------- | ------------------------------------- |
| `--spacing-space-xs`      | `0.375rem` (6px) | Icon gaps, tight inline spacing       |
| `--spacing-space-sm`      | `0.75rem` (12px) | Padding inside chips/badges           |
| `--spacing-space-md`      | `1.25rem` (20px) | Card internal padding, section gaps   |
| `--spacing-space-lg`      | `2rem` (32px)    | Between card groups, section headers  |
| `--spacing-space-xl`      | `3rem` (48px)    | Large vertical rhythm breaks          |
| `--spacing-gutter`        | `1.25rem` (20px) | Horizontal page margin (default)      |
| `--spacing-gutter-mobile` | `0.75rem` (12px) | Horizontal page margin (small screen) |
| `--spacing-margin`        | `2rem` (32px)    | Outer section margin                  |
| `--spacing-margin-mobile` | `1rem` (16px)    | Outer section margin (small screen)   |

### Safe Area Utilities

`.pb-safe` and `.pt-safe` use `max()` to combine a minimum design padding with device safe area insets. This ensures content is never obscured by device notches or home indicators on iOS/Android.

---

## 6. Components

### Category Scroll Pills

A horizontally scrollable row of pill buttons, one per product category. Scrolls left/right on touch; snaps to active pill. No scrollbar shown.

- **Inactive pill:** `bg-surface-container`, `border border-outline-subtle`, `text-on-surface-variant`
- **Active pill:** `bg-secondary`, `text-on-secondary`, no border
- **Height:** 36px; `border-radius: 9999px` (fully rounded)
- **Icon:** Material Symbols Outlined icon to the left of label text, 20px
- **Scroll:** `overflow-x: auto; scrollbar-width: none;` with momentum scrolling

### Product Card with Stepper

A card per product showing name, unit, optional description, and a quantity stepper.

- **Card:** `bg-surface-container-lowest`, `border border-outline-subtle`, `border-radius: 12px`, `padding: --spacing-space-md`
- **Selected state:** `bg-accent-soft`, `border-color: --color-secondary`
- **Product name:** `headline-md` (Work Sans 600, 18px)
- **Unit label:** `caption` (Work Sans 400, 12px), `color: --color-on-surface-variant`
- **Stepper:** Decrement (`−`) / quantity display / Increment (`+`) in a row
  - Buttons: 44 × 44px min touch target, `bg-surface-container`, circular
  - Quantity display: JetBrains Mono 700, 20px, `color: --color-secondary` when > 0
  - Increment button: `bg-secondary`, `text-on-secondary` when quantity > 0

### Cart Summary Bar

A fixed bottom bar that appears only when the cart has items. Shows item count and a "Review order" button.

- **Background:** `--color-primary` (navy)
- **Text:** `--color-on-primary` (white)
- **Item count badge:** `bg-secondary`, `text-on-secondary`, JetBrains Mono 700
- **CTA button:** `bg-secondary`, `text-on-secondary`, `border-radius: 9999px`, minimum height 48px
- **Safe area:** `.pb-safe` padding ensures content clears the home indicator

### Confirm Modal / Review Sheet

A bottom sheet (or centered modal on wide screens) presenting the full cart for review before submission.

- **Overlay:** `rgba(0,0,0,0.5)` backdrop, `role="dialog"`, `aria-modal="true"`
- **Sheet:** `bg-surface-container-lowest`, `border-radius: 20px 20px 0 0` (bottom sheet) or `12px` (centered)
- **Header:** Product name + quantity in `headline-md` / `label-numeric`
- **Submit button:** Full-width, `bg-secondary`, min height 52px, Work Sans 600 16px
- **Cancel:** Text-only link, `color: --color-on-surface-variant`
- **Focus trap:** Angular CDK `A11yModule` `cdkTrapFocus` on the sheet

### Observation Textarea

A free-text field below the product list for general notes from the kitchen leader.

- **Label:** Work Sans 500, 14px, `color: --color-on-surface`
- **Input:** `bg-surface-container-low`, `border border-outline-variant`, `border-radius: 8px`, `padding: 12px`
- **Focus state:** `border-color: --color-secondary`, `outline: 2px solid --color-secondary`
- **Placeholder:** `color: --color-on-surface-variant`
- **Min height:** 80px; resizes vertically via `cdkTextareaAutosize`

---

## 7. Accessibility

### ARIA Roles & Landmarks

- App header: `role="banner"`, `<header>` element
- Main content: `role="main"`, `<main>` element
- Cart bar: `role="complementary"` or `aria-live="polite"` for cart count updates
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title

### Focus Management

- On modal open: focus moves to the first focusable element inside the modal (CDK `cdkFocusInitial`)
- On modal close: focus returns to the element that triggered the open
- Focus ring: `outline: 2px solid var(--color-secondary); outline-offset: 2px` on `:focus-visible`

### CDK Usage

| CDK Feature                   | Used In                                              |
| ----------------------------- | ---------------------------------------------------- |
| `A11yModule` / `cdkTrapFocus` | Confirm modal — traps focus inside while open        |
| `cdkFocusInitial`             | Auto-focuses first actionable element in modal       |
| `cdkTextareaAutosize`         | Observation textarea grows with content              |
| `ScrollingModule`             | Category pills virtual scroll (if list is very long) |

### Touch Targets

- All interactive elements: **minimum 44 × 44 px** touch target
- Stepper buttons: 44 × 44px with centered icon
- Category pills: min height 36px, min width 64px (augmented by transparent hit area if needed)
- Cart bar CTA: min height 48px, full-width

### Additional A11y Concerns

- Number inputs use `type="number"` with explicit `min="0"` and `max` values; spin buttons are hidden via CSS
- Category pills use `role="tab"` / `aria-selected` or `role="radio"` / `aria-checked` pattern
- Cart item count announced via `aria-live="polite"` region
- All icon-only buttons have `aria-label` attributes

---

## 8. Icons

### Lucide Angular (Action Icons)

Used for interactive/action icons within the Angular component tree.

```bash
npm install lucide-angular
```

| Icon            | Use                              |
| --------------- | -------------------------------- |
| `ShoppingCart`  | Cart button in app bar           |
| `Minus`, `Plus` | Stepper decrement/increment      |
| `Check`         | Confirm submission success state |
| `X`             | Close modal / clear field        |
| `ChevronRight`  | Navigation affordance            |
| `ClipboardList` | Observation / notes section      |

Import via `LucideAngularModule` with a named icon subset — never import the full icon set.

### Material Symbols Outlined (Category & Display Icons)

Loaded via Google Fonts CDN. Used for category display icons in scroll pills and other decorative/structural icons.

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>
```

Usage in HTML:

```html
<span class="material-symbols-outlined" aria-hidden="true">restaurant</span>
```

| Symbol              | Category              |
| ------------------- | --------------------- |
| `restaurant`        | Alimentos gerais      |
| `kitchen`           | Utensílios de cozinha |
| `local_drink`       | Bebidas               |
| `cleaning_services` | Limpeza               |
| `inventory_2`       | Embalagens / estoque  |
| `eco`               | Hortifruti            |

> **Rule:** Category icons in pills are `aria-hidden="true"` — the pill text label alone must be sufficient for screen reader users. Never use an icon-only pill.
