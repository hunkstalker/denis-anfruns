# Design Document

This document outlines the core UI/UX principles and design tokens for the project. These rules ensure consistency, scalability, and a premium feel across the site.

## 1. Spacing System (Rhythm)

We use a standard 4px-based grid. Spacing is not arbitrary; it follows a strict mathematical scale to create visual rhythm.

### Grid Gaps

For lists and card grids, we use a **responsive spacing scale**.

- **Rule**: `grid gap-4 sm:gap-6 lg:gap-8`
- **Why**: As the viewport grows, content needs more "breathing room" (negative space) to avoid looking cluttered.
  - Mobile: `16px` (gap-4)
  - Tablet: `24px` (gap-6)
  - Desktop: `32px` (gap-8)

### Card Padding (Breathing Room)

Internal spacing within cards must also scale.

- **Rule**: `p-4 sm:p-6`
- **Why**: Larger cards on desktop feel "empty" if padding remains tight. Increasing padding maintains the visual density balance.

## 2. Card Components

Cards (DevLogs, TILs) should feel like siblings from the same design family.

- **Border Radius**: `rounded-xl sm:rounded-2xl`
  - Start softer on small screens, increase roundness on larger layouts for a modern, friendly feel.
- **Shadows**: `shadow-sm hover:shadow-md`
  - Subtlety is key. Use small initial shadows that grow on interaction to provide depth feedback.
- **Borders**: Thin, subtle borders that darken slightly on hover.
  - Light: `border-zinc-200 hover:border-black/15`
  - Dark: `border-zinc-700/50 hover:border-white/15`
- **Transitions**: `transition-shadow duration-300`
  - Always smooth out state changes. Hard jumps feel "cheap".

## 3. Typography & Links

Text hierarchy guides the user's eye.

- **Links**: Two types of interactions.
  - **Inline Links**: Standard text decoration or color shift.
  - **Action Links**: "Read more", "View all".
    - **Style**: Use `text-[--tangerine-hover]`.
    - **Icon**: Always pair with an arrow icon (`ArrowUpRight` or `ArrowLink`).
    - **Interaction**: The arrow should animate on hover (`group-hover:translate-x-1`). This little movement signals "clickable/actionable".

## 4. Animations (The "Premium" Feel)

Motion should be purposeful, not decorative.

- **Staggered Entry (Cascade)**:
  - Lists should not appear all at once. Use a staggered delay (`index * 0.1s`).
  - **Direction**: Slide up (`y: 20 -> y: 0`) and fade in.
  - **Synchronization**: If multiple lists appear side-by-side (e.g., Blog Feed + Sidebar), they must start at the same time ($t=0$).

- **Magic Layout**:
  - When filtering or reordering, items should _drift_ to their new positions, not jump. Use `framer-motion`'s `layout` prop.

## 5. Internationalization (i18n)

- **Golden Rule**: **NO hardcoded text**.
  - Every visible string must come from `src/i18n/ui.ts`.
  - Components should accept labels via props (e.g., `labels={{ readNote: t(...) }}`) to remain pure and language-agnostic.

---

_Adhere to these rules for all future components to maintain the site's design integrity._
