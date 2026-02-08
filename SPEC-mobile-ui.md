# SPEC: Mobile UI Improvements — Retractable Tool Panels

## Problem Statement

The graph visualization app has **8+ fixed-position UI overlays** all competing for the same screen space. On desktop (1280px+) this works. On mobile (320-430px) it falls apart:

| Component | Position | Width | Mobile Issue |
|---|---|---|---|
| **ModeToggle** | top-right | ~280px (3 buttons) | Overlaps SearchBar; cramped taps |
| **SearchBar** | top-center | 320px (`w-80`) | Leaves 0-55px margin on a 375px screen |
| **GraphControls** | top-left | 256px expanded | Overlaps SearchBar when open |
| **NodeDetailPanel** | right edge | 384px (`w-96`) | **Wider than the viewport** — unusable |
| **CampaignPanel** | right edge | 420px (`w-[420px]`) | **Wider than the viewport** — unusable |
| **RoleInsightPanel** | right edge | 384px (`w-96`) | **Wider than the viewport** — unusable |
| **ZoomControls** | bottom-right | 100px D-pad + zoom row | Overlaps bottom CTAs |
| **LegendPanel** | bottom-left | ~180px | Overlaps bottom CTAs |
| **Bottom CTAs** | bottom-center | ~350px | Overlaps Legend + ZoomControls |
| **PresentationController** | bottom-center | 672px (`max-w-2xl`) narration card | Clips on narrow screens |

The core insight: **on mobile, the 3D graph is the product and the UI chrome should get out of its way.** Users need the ability to retract/collapse every tool so they can focus on the graph, then pull tools back when needed.

---

## Design Principles

1. **Graph-first**: Maximize 3D viewport on small screens; minimize persistent chrome
2. **Progressive disclosure**: Only show what the user is actively using
3. **Thumb-friendly**: Bottom-anchored interactions; min 44px touch targets
4. **Reversible**: Every panel can be dismissed and re-opened; no dead ends
5. **Zero desktop regression**: All changes use `md:` (768px) breakpoint — desktop layout stays identical

---

## Architecture Overview

```
Mobile (<768px)                        Desktop (>=768px)
┌─────────────────────┐               ┌──────────────────────────────────┐
│ [Mode] ····· [☰ HUD]│               │ [Filter]  [Search]   [Mode]     │
│                     │               │                          ┌──────┤
│                     │               │                          │Detail│
│     3D GRAPH        │               │       3D GRAPH           │Panel │
│     (full viewport) │               │                          │      │
│                     │               │                          └──────┤
│                     │               │ [Legend]            [ZoomCtrl]  │
│ ┌─ Bottom Sheet ──┐ │               │      [Campaign CTA] [Role CTA] │
│ │ (drag up/down)  │ │               └──────────────────────────────────┘
│ └─────────────────┘ │
│  [+][-] [●●●] [HUD] │
└─────────────────────┘
```

---

## Implementation Plan

### Phase 1: Viewport Detection + UI Store

**Files**: `src/lib/store/ui-store.ts`, new `src/lib/hooks/use-mobile.ts`

**What to build**:

- `useMobile()` hook — returns `isMobile` boolean based on `window.matchMedia('(max-width: 767px)')`. Listen for changes so it reacts to rotation.
- Extend `useUIStore` with:
  ```
  mobileHudOpen: boolean       // toolbar tray expanded
  toggleMobileHud: () => void
  activeBottomSheet: 'node' | 'campaign' | 'role' | null
  bottomSheetSnap: 'peek' | 'half' | 'full'
  setBottomSheet: (sheet, snap) => void
  dismissBottomSheet: () => void
  ```

**Why**: Every subsequent phase needs to know if we're on mobile, and the store needs states for the new mobile-only UI patterns. This is the foundation.

---

### Phase 2: Retractable Mobile HUD (Tool Tray)

**Files**: new `src/components/graph/MobileHud.tsx`, modify `src/app/graph/page.tsx`

**What to build**:

A floating action button (FAB) in the bottom-right that expands into a radial or vertical tray of tool buttons:

```
Collapsed:     [≡]          (single 48px circle)

Expanded:      [Search]
               [Filter]
               [Legend]
               [Zoom +]
               [Zoom -]
               [Fit All]
               [≡]          (now acts as close)
```

**Behavior**:
- Tapping the FAB opens the tray with a staggered animation (framer-motion)
- Tapping a tool (e.g., Search) opens that tool's UI inline (search input slides in from top, filter panel overlays, etc.)
- Tapping the FAB again or tapping outside closes the tray
- When any right-side panel (bottom sheet) is open, the HUD auto-collapses to stay out of the way

**Conditional rendering in `page.tsx`**:
```tsx
{isMobile ? <MobileHud /> : (
  <>
    <GraphControls />
    <SearchBar />
    <LegendPanel />
    <ZoomControls />
  </>
)}
```

**Why**: Instead of having 4 separate fixed-position controls cluttering mobile, one button gives access to all of them. This is the "retract" mechanism you asked about — tools are hidden by default and summoned on demand.

---

### Phase 3: Bottom Sheet for Detail Panels

**Files**: new `src/components/graph/MobileBottomSheet.tsx`, modify `NodeDetailPanel.tsx`, `CampaignPanel.tsx`, `RoleInsightPanel.tsx`

**What to build**:

A reusable `<MobileBottomSheet>` component that wraps panel content and provides:
- **Three snap points**: `peek` (80px visible — just the header), `half` (50vh), `full` (90vh)
- **Drag handle** at the top (standard mobile pattern)
- **Swipe down to dismiss** when at peek snap
- **Spring physics** via framer-motion's `useDragControls`

**Snap points**:
```
Full (90vh):   ┌─────────────────────┐
               │  ═══  drag handle   │
               │  Node: Draft Content│
               │  Description...     │
               │  Metadata...        │
               │  Connections...     │
               └─────────────────────┘

Half (50vh):   ┌─────────────────────┐
               │  ═══                │
               │  Node: Draft Content│
               │  Description...     │
               └─────────────────────┘

Peek (80px):   ┌─────────────────────┐
               │  ═══  Draft Content │
               └─────────────────────┘
```

**Per-panel adaptations**:
- `NodeDetailPanel`: Show node name + type badge in peek header; full content in half/full
- `CampaignPanel`: Show campaign phase + progress bar in peek; node card + log in half/full
- `RoleInsightPanel`: Show role name + step N/M in peek; walkthrough content in half/full

**Why**: Right-side sliding panels are a desktop pattern. On mobile, bottom sheets are the native idiom (Maps, Uber, Spotify all use this). Users can peek at info while keeping most of the graph visible, then drag up for details.

---

### Phase 4: Responsive ModeToggle

**Files**: modify `src/components/graph/ModeToggle.tsx`

**What to change**:

On mobile, compress the mode toggle:
- Use **icon-only buttons** with tooltips instead of text labels
- Icons: Guided = `Presentation` (or `PlayCircle`), Explore = `Compass`, Campaign = `Rocket`
- Reduce padding: `px-2.5 py-2` on mobile vs current `px-4 py-2`
- Move to **top-left** on mobile (top-right conflicts with the HUD FAB area)

```tsx
// In the button render:
<button className="px-2.5 py-2 md:px-4 md:py-2 ...">
  <ModeIcon className="w-4 h-4 md:hidden" />
  <span className="hidden md:inline">{label}</span>
</button>
```

**Why**: Three text buttons at 280px total width eat 75% of a 375px screen. Icon-only cuts this to ~120px.

---

### Phase 5: Responsive SearchBar

**Files**: modify `src/components/graph/SearchBar.tsx`

**What to change**:

- On mobile, search starts as a **search icon button** (not a full input bar)
- Tapping it expands to a full-width overlay input (`w-[calc(100%-2rem)]`)
- Results dropdown becomes full-width below the input
- `Escape` or the X button collapses back to icon
- Remove `⌘K` hint on mobile (no keyboard shortcut on touch devices)

```tsx
// Mobile: icon button that expands
{isMobile && !isExpanded ? (
  <button onClick={() => setExpanded(true)} className="p-2.5 rounded-xl glass-panel">
    <Search className="w-4 h-4" />
  </button>
) : (
  <div className="w-[calc(100%-2rem)] md:w-80 ...">
    {/* existing search input */}
  </div>
)}
```

**Why**: A 320px-wide search bar that's always visible is wasteful on mobile when users search infrequently. Icon-to-expand is the standard mobile pattern.

---

### Phase 6: Presentation Mode Mobile Fixes

**Files**: modify `src/components/presentation/PresentationController.tsx`

**What to change**:

1. **Pipeline diagram**: Scale down icons on mobile — already partially done with `w-14 h-14 md:w-16 md:h-16`, but the connector spacing (`mx-1.5 md:mx-3`) still causes overflow on narrow screens. Add `overflow-x-auto` or scale the entire diagram with `transform: scale(0.75)` on mobile.

2. **Narration card**: Change `max-w-2xl` to `max-w-[calc(100%-2rem)]` on mobile so it respects viewport edges.

3. **Step dots**: With 15+ steps, dots overflow. On mobile, show only a window of 7 dots centered on the current step (with fade edges), or replace with a simple `3/15` counter.

4. **Navigation buttons**: Increase touch target to 48px minimum. Current `p-2` (32px) is too small for thumbs.

```tsx
// Navigation buttons
<button className="p-3 md:p-2 rounded-full glass-panel ...">
```

**Why**: Guided mode is likely the first thing a new user sees. If it looks broken on their phone, they leave.

---

### Phase 7: Hide D-Pad on Mobile, Keep Essentials

**Files**: modify `src/components/graph/ZoomControls.tsx`

**What to change**:

- **Hide the orbit D-pad on mobile** — touch/drag on the 3D canvas already handles orbiting natively via Three.js/OrbitControls
- Keep only **Zoom In**, **Zoom Out**, **Fit All** as a compact horizontal bar
- Move to bottom-left on mobile (since bottom-right is the HUD FAB)
- Or integrate zoom buttons directly into the MobileHud tray (Phase 2)

```tsx
{!isMobile && (
  <div className="relative w-[100px] h-[100px]">
    {/* D-pad orbit buttons */}
  </div>
)}

<div className="flex gap-1">
  {/* Zoom in/out/fit — always shown */}
</div>
```

**Why**: The D-pad duplicates native touch orbit controls and takes 100x100px of precious mobile space. Removing it on mobile is pure win.

---

## Phasing & Priority

| Phase | Effort | Impact | Do First? |
|---|---|---|---|
| **1. Viewport + Store** | Small | Foundation for everything | Yes (prerequisite) |
| **2. Mobile HUD** | Medium | Biggest single improvement — declutters the whole screen | Yes |
| **3. Bottom Sheets** | Medium-Large | Fixes the broken side panels | Yes |
| **4. ModeToggle** | Small | Quick win, prevents overlap | Yes |
| **5. SearchBar** | Small | Quick win | Second pass |
| **6. Presentation fixes** | Medium | Important for first impression | Second pass |
| **7. D-Pad removal** | Small | Quick win | Second pass |

**Recommended build order**: 1 → 4 → 7 → 2 → 5 → 3 → 6

Start with the small, high-impact wins (viewport hook, mode toggle, d-pad), then tackle the two larger features (HUD tray, bottom sheets), and finish with presentation polish.

---

## Files Changed Summary

| File | Change Type |
|---|---|
| `src/lib/hooks/use-mobile.ts` | **New** — viewport detection hook |
| `src/lib/store/ui-store.ts` | **Modify** — add mobile HUD + bottom sheet state |
| `src/components/graph/MobileHud.tsx` | **New** — retractable tool tray |
| `src/components/graph/MobileBottomSheet.tsx` | **New** — reusable bottom sheet wrapper |
| `src/components/graph/ModeToggle.tsx` | **Modify** — icon-only on mobile |
| `src/components/graph/SearchBar.tsx` | **Modify** — icon-to-expand on mobile |
| `src/components/graph/ZoomControls.tsx` | **Modify** — hide D-pad on mobile |
| `src/components/graph/NodeDetailPanel.tsx` | **Modify** — wrap in bottom sheet on mobile |
| `src/components/graph/CampaignMode/CampaignPanel.tsx` | **Modify** — wrap in bottom sheet on mobile |
| `src/components/graph/RoleMode/RoleInsightPanel.tsx` | **Modify** — wrap in bottom sheet on mobile |
| `src/components/presentation/PresentationController.tsx` | **Modify** — responsive fixes |
| `src/app/graph/page.tsx` | **Modify** — conditional mobile vs desktop rendering |
| `src/app/globals.css` | **Modify** — bottom sheet + HUD animations if needed |

---

## What This Does NOT Cover

- **Offline / PWA** — out of scope
- **Native mobile app** — this is responsive web only
- **Tablet-specific layouts** — we use a single 768px breakpoint; tablets get the desktop layout
- **3D performance on low-end devices** — separate concern (Three.js tuning)
- **Dark mode** — the current light-only theme is not affected

---

## Open Questions for You

1. **HUD position**: Bottom-right FAB (iOS-style) or bottom-center toolbar (Android-style)? I'm recommending bottom-right.
2. **Bottom sheet library**: Build from scratch with framer-motion (more control, no extra dep) or use something like `react-spring-bottom-sheet`? I lean toward building it since we already have framer-motion.
3. **Do you want the ModeToggle visible at all times on mobile, or should it also go into the HUD?** I'm recommending keeping it always visible (it's the primary navigation) but making it compact.
