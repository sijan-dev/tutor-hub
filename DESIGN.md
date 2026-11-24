---
name: Tutor Hub
description: A quiet, working interface for finding tutors and running lessons.
colors:
  paper: "#f6f5f1"
  surface: "#ffffff"
  ink: "#17181a"
  muted: "#66655f"
  line: "#dedbd3"
  accent: "#a33a2b"
  ok: "#1f6b45"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  display-mobile:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  control:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
  small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0em"
  caption:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.12em"
  micro:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.08em"
rounded:
  sm: "2px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "#33343a"
    textColor: "{colors.paper}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    height: "36px"
    padding: "0 8px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 12px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sm}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: Tutor Hub

## Overview

**Creative North Star: "The Marked Paper"**

Tutor Hub should read like a well-kept notebook: warm paper, dark ink, thin ruled lines, and a single red pencil mark where attention is needed. There is no stage, no glow, and no decoration competing with the content. The interface is a working tool for students and tutors, so the design earns trust by being legible, quiet, and predictable rather than by being impressive.

Structure carries the hierarchy. Pages are built from plain rows and sections separated by 1px hairlines, with generous whitespace doing the work that cards, shadows, and gradients would otherwise do. Controls are small, nearly square, and clearly labeled. One typeface handles every level, and the difference between a heading and a label comes from size, weight, and case rather than color or ornament.

The visual language explicitly rejects the earlier look: violet and indigo gradients, glass panels, neon glow, 3D decoration, tilt effects, confetti, sound effects, emoji icons, pill badges, and oversized rounded corners. None of those return as "polish."

**Key Characteristics:**
- Warm paper ground, white surfaces, and near-black ink; no dark marketing stages.
- One vermilion accent used sparingly for focus, selection, price, and destructive states.
- 1px hairlines and whitespace instead of shadows, borders, or card grids.
- A single family, Archivo, across display, body, and labels.
- Flat controls with 2px corners; circles only for avatars and status dots.
- Motion limited to color and border transitions.

## Colors

A warm neutral field with one earthy red signal. The palette is low-chroma by default and never leans on saturated fills for structure.

### Primary
- **Pencil Vermilion** (`accent`): The only accent. Reserved for focus rings, selected markers, error text, saved states, and prices that need emphasis. It is never a large fill and never a decorative wash.

### Tertiary
- **Field Green** (`ok`): Availability and positive confirmation only. Never used for general emphasis.

### Neutral
- **Ink** (`ink`): Headings, body copy, primary button fills, and active states.
- **Muted Ink** (`muted`): Secondary copy, metadata, placeholders, and inactive controls.
- **Paper** (`paper`): The page ground. Every screen sits on it; controls never float above a second background.
- **Surface** (`surface`): White fills for panels, inputs, popovers, and modals. In dark mode it is a slightly lifted charcoal.
- **Hairline** (`line`): The only separator. Borders, dividers, input strokes, and table rules are all 1px of this color.

### Named Rules
**The One Mark Rule.** Vermilion marks at most one thing per region: the focused field, the selected tab, the price, or the error. If two elements compete for it, neither gets it.

**The No-Wash Rule.** There are no tinted backgrounds, gradient fills, or colored panels. Emphasis comes from ink weight, a hairline, or the single accent mark.

**The Contrast-By-Tone Rule.** Depth and grouping come from paper versus surface, plus a hairline. Never from shadow, blur, or a third background tone.

## Typography

**Display Font:** Archivo (with ui-sans-serif, system-ui)
**Body Font:** Archivo
**Label/Mono Font:** Archivo; tabular numerals for rates and dates.

**Character:** One grotesque doing all the work. Archivo is plain enough to disappear in dense dashboards and tight enough to feel deliberate at display sizes. Weight contrast is modest: 400 for reading, 500 for control labels, 600 for headings.

### Hierarchy
- **Display** (600, 2.75rem, line-height 1.1, tracking -0.03em): Page titles only. Steps down to 2.25rem on small screens and never appears inside a panel.
- **Headline** (600, 2rem, line-height 1.15, tracking -0.025em): Section and dialog headings, and detail-page names.
- **Title** (600, 1rem, line-height 1.4): Row names, panel titles, and list anchors.
- **Body** (400, 0.9375rem, line-height 1.625): Descriptions, messages, and form values. Long copy holds around 65ch.
- **Control** (500, 0.875rem, line-height 1.4): Button labels, tabs, inputs, and navigation.
- **Small** (500, 0.8125rem, line-height 1.5): Dense UI copy, inline actions, and compact table facts.
- **Caption** (400, 0.75rem, line-height 1.5): Helper text, timestamps, and subject tags.
- **Label** (600, 0.6875rem, tracking 0.12em, uppercase): Filter groups, field labels, and stat captions.
- **Micro** (600, 0.625rem, tracking 0.08em): Notification counts and the smallest status markers only.

### Named Rules
**The One-Family Rule.** No second typeface, no display serif, no monospace except for a transaction code. Contrast comes from size, weight, and case.

**The No-Eyebrow Rule.** Headings stand alone. No small uppercase kicker sits above a title to announce what the section is; the heading already does that.

**The Quiet-Metadata Rule.** Labels, captions, and secondary facts are 11–12px, muted, and never bolder than the content they describe.

## Layout

Pages use a centered 1152px container (`max-w-6xl`) with 20px gutters on mobile and 32px from `sm` up. The sticky top bar is 56px tall. Content begins with a page title block at 48–64px, then sections separated by 40–56px of vertical space.

Discovery pages use a two-column split: a fixed 224px filter rail beside a fluid result list, collapsing to one column below `lg`. Dashboards stack a header, a row of plain stats separated by hairlines, then tabbed content. Lists are full-width rows with 20px vertical padding and a hairline between items; they do not become card grids.

Spacing follows a 4px base. The recurring steps are 4, 8, 12, 16, 20, 24, 32, 48, and 64px. Density is even: marketing moments are allowed 48–64px of air, working surfaces use 16–24px, and nothing is padded beyond 32px without reason.

Below `md`, navigation collapses into a single menu, the filter rail moves above results, stat rows wrap 2-up, and multi-column forms become single-column. Tables and long lists wrap rather than scroll horizontally.

## Elevation & Depth

**There are no shadows.** The system is entirely flat: no `box-shadow`, no backdrop blur, no glow, no gradient. Depth is expressed through tone (paper behind, surface in front), a 1px hairline, and spacing. Popovers and dialogs sit above content with a hairline border and an opaque surface, not a shadow.

### Named Rules
**The Flat-Field Rule.** A surface at rest has no shadow. If an element needs to separate from its background, add a hairline or space, never elevation.

**The Opaque-Overlay Rule.** Menus, popovers, and dialogs use a solid surface color. Translucency and blur are not part of the system.

## Shapes

The form language is nearly square. Panels, inputs, buttons, chips, and dialogs use a 2px radius; nothing is pill-shaped. Circles are reserved for avatars, status dots, spinners, and radio controls.

Borders are always 1px. A 2px border is allowed only as a selection or focus indicator, never as decoration. Images and avatars are clipped square with the same 2px radius; there are no rings, stickers, or floating frames.

**The Nearly-Square Rule.** If a corner radius reads as a design feature, it is too large. 2px is the ceiling.

**The Single-Line Rule.** No border-left stripes, no double rules, no thick dividers. Separators are one hairline or nothing.

## Components

### Buttons
- **Shape:** 2px radius, 40px tall (`btn-sm` is 32px), 16px horizontal padding, 500-weight 14px label.
- **Primary:** Solid ink fill with paper text. Used once per view for the main action.
- **Hover / Focus:** Fill lightens toward `#33343a`; focus uses a 2px vermilion outline at 2px offset. No lift, scale, or shadow.
- **Secondary:** Transparent fill, 1px hairline, ink label. Hover darkens the border.
- **Quiet:** No border, muted label, 36px tall. Used for inline actions such as Reset and Clear.
- **Destructive:** Hairline border with vermilion text; never a solid red fill.

### Chips
- **Style:** 1px hairline, 2px radius, 12px muted text, 2px/8px padding. Used for subject tags and read-only metadata.
- **State:** Selectable filters are text buttons with an underline or ink weight, not filled chips. A selected chip inverts to ink fill with paper text only when it is the primary control for that row.

### Rows / Containers
- **Corner Style:** 2px.
- **Background:** Surface for interactive rows and panels; paper for the page. No alternating tints.
- **Border:** 1px hairline between rows; a full border only when the container is a distinct panel or dialog.
- **Internal Padding:** 16–20px for rows, 20–24px for panels.
- **Rule:** Collections are lists first. A card grid is a last resort for genuinely independent objects, not the default for search results.

### Inputs / Fields
- **Style:** Surface fill, 1px hairline, 2px radius, 40px tall, 14px ink text.
- **Focus:** Border turns ink and a 2px vermilion outline appears. No glow or ring stack.
- **Error / Disabled:** Vermilion helper text, no colored field fill; disabled controls drop to 40% opacity.
- **Labels:** 11px uppercase, muted, 6px above the field.

### Navigation
- **Style:** Sticky 56px bar on paper with a 1px bottom hairline. Wordmark at 15px/600; links at 13px/500 in muted ink.
- **States:** Active link is ink; hover is ink. Notifications and profile controls are plain icon buttons with no background.
- **Mobile:** A single menu button opens a flat panel of links; sign-in and theme controls live inside it.

### Tabs
- **Style:** Underline tabs: 14px/500 label, 2px bottom border, 12px below the text.
- **States:** Active is ink text with an ink underline; inactive is muted and turns ink on hover. No filled tab backgrounds.

### Statistics
- **Style:** A label above a 30px/600 tabular figure, separated from its neighbors by a vertical hairline. No cards, icons, or colored trends.
- **Rule:** A number gets emphasis through size, not color. Green or red appears only when the value itself is a status.

### Signature Components
**Tutor row.** The catalog's core unit: square avatar, name, subject tags, one-line bio, location and levels, then rate and actions aligned right. The row is separated by hairlines, not boxed. Hover changes the name weight or underline only.

**Rate panel.** A sticky 280px column on profile pages holding the hourly rate, three plain facts, and a primary booking button. It is framed by top and bottom hairlines, not boxed as a floating card.

## Do's and Don'ts

### Do:
- **Do** build hierarchy from size, weight, spacing, and hairlines before reaching for color.
- **Do** use paper for the page, surface for panels, and a 1px hairline for every separator.
- **Do** keep one primary action per view, filled with ink.
- **Do** use 2px radii and flat surfaces everywhere.
- **Do** use vermilion for focus, selection, price, and error only.
- **Do** write direct labels ("Book session", "Reset filters") instead of promotional phrasing.
- **Do** keep demo and sample-data disclosures visible and plainly worded.

### Don't:
- **Don't** add gradients, glass, blur, glow, shadows, or 3D decoration.
- **Don't** use emoji as icons, sound effects, confetti, or celebratory animation.
- **Don't** introduce pill badges, 24px corners, tilt effects, or hover lifts.
- **Don't** put a small uppercase kicker above a heading.
- **Don't** fill cards or callouts with tinted backgrounds or colored side stripes.
- **Don't** use more than one typeface or set headings below 600 weight.
- **Don't** turn search results or dashboards into grids of identical cards.
- **Don't** repeat unverified marketing claims ("Nepal's first", "Top 1%"); this is a demo with sample data.
