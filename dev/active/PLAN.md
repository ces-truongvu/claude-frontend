# Landing Page Development Plan

## Overview
Convert the static HTML leaderboard template (`templates/index.html`) into a fully functional React + TypeScript application with component-based architecture, type safety, and modern development practices.

## Template Analysis

The template features:
- **Navigation**: Logo and login button
- **Header Section**: Badge, title, and description
- **Leaderboard Card**:
  - Filter tabs (This Week / All Time)
  - Top 3 ranked players with special styling
  - Additional ranked players (4-5)
  - Current user banner (rank 42)
  - "View full leaderboard" footer
- **Footer**: Simple credit text
- **Styling**: Tailwind CSS with custom hover animations
- **Icons**: Lucide icons for UI elements

---

## Phase Complexity Summary

| Phase | Complexity | Key Challenges |
|-------|-----------|----------------|
| 1 | **S (Small)** | Planning and simple data structures |
| 2 | **S (Small)** | Basic static components |
| 3 | **L (Large)** | Complex variants, conditional styling, many edge cases |
| 4 | **M (Medium)** | State management and event handling |
| 5 | **M (Medium)** | Detail-oriented styling work |
| 6 | **M (Medium)** | Testing, integration, and QA |
| 7 | **XL (Extra Large)** | Advanced features (optional/future) |

**Core Development (Phases 1-6)**: 2S + 3M + 1L = Moderate-to-Large project

---

## Phase 1: Project Foundation & Component Structure
**Complexity: S (Small)**

### Goals
- Set up component architecture
- Define TypeScript interfaces
- Create mock data structure

### Tasks
1. **Define TypeScript interfaces** (`src/types/leaderboard.ts`)
   ```typescript
   interface Player {
     id: string
     rank: number
     name: string
     username: string
     avatar: string
     score: number
     trend: 'up' | 'down' | 'neutral'
     trendValue: number
     isVerified?: boolean
     isTopRank?: boolean
   }

   interface LeaderboardData {
     period: 'week' | 'alltime'
     players: Player[]
     currentUser: Player
   }
   ```

2. **Create mock data** (`src/data/mockLeaderboard.ts`)
   - Populate with the 5 players from template
   - Include current user data (rank 42, Guest User, 2,340 points)
   - Add additional players for "View full" functionality

3. **Plan component hierarchy**
   ```
   App
   └── LandingPage
       ├── Navigation
       ├── Header
       ├── LeaderboardCard
       │   ├── LeaderboardTabs
       │   ├── LeaderboardList
       │   │   ├── LeaderboardItem (x5)
       │   │   └── CurrentUserBanner
       │   └── LeaderboardFooter
       └── Footer
   ```

### Success Criteria
- [ ] TypeScript interfaces defined and exported
- [ ] Mock data matches template exactly
- [ ] Component hierarchy documented

---

## Phase 2: Core Layout Components
**Complexity: S (Small)**

### Goals
- Build static layout structure
- Implement navigation and footer
- Set up main page container

### Tasks
1. **Create `Navigation` component** (`src/components/Navigation.tsx`)
   - Logo: "LB" badge (stone-900, rounded-lg, rotated 3deg)
   - "Leaderboard" text (font-semibold, tracking-tight)
   - Login button (text-sm, stone-500 hover:stone-900)
   - Max-width: 2xl, centered with mx-auto

2. **Create `Footer` component** (`src/components/Footer.tsx`)
   - Heart icon from Lucide (filled, w-3 h-3)
   - Text: "Made with ❤️ for wigglers everywhere."
   - Centered, stone-400 color

3. **Create `Header` component** (`src/components/Header.tsx`)
   - Badge: "Weekly Refresh" with sparkles icon (purple-100 bg, purple-700 text)
   - H1: "Top Wigglers" (text-4xl sm:text-5xl, font-semibold)
   - Paragraph: "The friendliest competition..." (stone-500, max-w-md)

4. **Create `LandingPage` component** (`src/pages/LandingPage.tsx`)
   - Compose Navigation, Header, main content area, and Footer
   - Apply background: stone-50 with grid pattern
   - Flex layout: min-h-screen, flex-col

### Success Criteria
- [ ] All layout components render correctly
- [ ] Background grid pattern displays
- [ ] Responsive padding and max-widths applied
- [ ] Typography matches template

---

## Phase 3: Leaderboard Components
**Complexity: L (Large)**

### Goals
- Build reusable leaderboard item component with variants
- Implement ranking variations (top 3 vs others)
- Create tab filter component

### Tasks
1. **Create `LeaderboardTabs` component** (`src/components/LeaderboardTabs.tsx`)
   - Two buttons: "This Week" (active) and "All Time"
   - State management for active tab
   - Active styling: bg-white, rounded-lg, shadow-sm, border-stone-200
   - Inactive: text-stone-500, hover:text-stone-700
   - Container: bg-stone-50, rounded-xl, p-1

2. **Create `LeaderboardItem` component** (`src/components/LeaderboardItem.tsx`)
   - **Props**: `player: Player`, `variant?: 'top1' | 'top3' | 'default'`

   - **Rank badge styling**:
     - Position 1: bg-yellow-100, text-yellow-700, w-10 h-10, with crown badge overlay
     - Position 3: bg-orange-100, text-orange-800
     - Position 2: bg-stone-100, text-stone-600
     - Others (4+): text-stone-400, no background

   - **Avatar**:
     - DiceBear API: `https://api.dicebear.com/7.x/notionists/svg?seed={name}&backgroundColor={color}`
     - Size: w-12 h-12, rounded-full
     - Ranks 4+: grayscale opacity-80, remove on hover

   - **Player info**:
     - Name: font-semibold, text-base, stone-900
     - Verified badge (if applicable): badge-check icon, blue-400, fill-blue-50
     - Username: text-stone-400, text-sm, @username format

   - **Score & trend**:
     - Score: font-semibold, text-lg, tracking-tight
     - Trend badge:
       - Up: green-600 text, green-50 bg, trending-up icon
       - Down: red-500 text, red-50 bg, trending-down icon
       - Neutral: stone-400, minus icon

   - **Hover effects by variant**:
     - Top 1: hover:bg-yellow-50/50, hover:border-yellow-100, yellow-400 left accent bar
     - Top 3: hover:bg-orange-50/50, hover:border-orange-100, orange-400 left accent bar
     - Default: hover:bg-stone-50, hover:border-stone-200
     - All: translateY(-2px) on hover, transition-all duration-200

3. **Create `CurrentUserBanner` component** (`src/components/CurrentUserBanner.tsx`)
   - Dark background: bg-stone-900, text-white
   - Rank badge: w-8 h-8, bg-stone-700, rounded-full
   - Labels: "You" (text-sm, stone-200), "Guest User" (font-semibold)
   - Score: font-mono, text-lg
   - Chevron-right icon: stone-500
   - Hover: scale-[1.01], cursor-pointer
   - Shadow: shadow-lg shadow-stone-300/50

4. **Create `LeaderboardFooter` component** (`src/components/LeaderboardFooter.tsx`)
   - Button: "View full leaderboard" with arrow-right icon
   - Styling: bg-stone-50, border-t border-stone-100, p-4
   - Text: text-sm, stone-500, hover:stone-800

5. **Create `LeaderboardCard` container** (`src/components/LeaderboardCard.tsx`)
   - White card: bg-white, rounded-[2rem], shadow-xl shadow-stone-200/60
   - Border: border-stone-100
   - Compose: Tabs, List (gap-2, p-3), Divider (after rank 3), Current user banner, Footer
   - Overflow: hidden

### Success Criteria
- [ ] All variants render with correct styling
- [ ] Hover effects work smoothly
- [ ] Icons display correctly (Lucide)
- [ ] Avatars load from DiceBear API
- [ ] Grayscale effect on ranks 4+ removes on hover
- [ ] Left accent bars appear on hover for top ranks

---

## Phase 4: State Management & Interactivity
**Complexity: M (Medium)**

### Goals
- Implement tab switching logic
- Filter leaderboard data by period
- Add click handlers for interactive elements

### Tasks
1. **Add state to `LandingPage`**
   - `const [period, setPeriod] = useState<'week' | 'alltime'>('week')`
   - Filter mock data based on selected period
   - Pass filtered players to LeaderboardCard

2. **Implement tab switching**
   - LeaderboardTabs receives `activePeriod` and `onPeriodChange` props
   - Click handlers update parent state via callback
   - Active tab styling updates based on `activePeriod`
   - List re-renders with filtered data

3. **Add placeholder click handlers**
   - Login button: `() => console.log('Login clicked')`
   - LeaderboardItem: `() => console.log('Player:', player.name)`
   - CurrentUserBanner: `() => console.log('View profile')`
   - LeaderboardFooter: `() => console.log('View full leaderboard')`

4. **Add loading state** (optional)
   - `const [isLoading, setIsLoading] = useState(false)`
   - Simulate async fetch with `setTimeout`
   - Show skeleton loaders or spinner

### Success Criteria
- [ ] Tab switching updates leaderboard data
- [ ] Click handlers log to console
- [ ] State flows correctly from parent to children
- [ ] No prop-drilling issues

---

## Phase 5: Styling & Polish
**Complexity: M (Medium)**

### Goals
- Replicate exact styles from template
- Ensure responsive design
- Add smooth animations

### Tasks
1. **Verify Tailwind classes**
   - Colors: stone-50/100/200/400/500/600/700/800/900, purple-100/200/700, yellow-100/400/700, orange-100/800, green-50/600, red-50/500, blue-50/400
   - Font weights: font-light (300), font-normal (400), font-medium (500), font-semibold (600)
   - Border radius: rounded-full, rounded-lg, rounded-xl, rounded-2xl, rounded-[2rem]
   - Shadows: shadow-sm, shadow-lg, shadow-xl with custom colors
   - Spacing: p-1/2/3/4, gap-1/2/3/4, mx-auto, max-w-2xl

2. **Add custom CSS** (`src/index.css`)
   ```css
   body {
     font-family: "Outfit", "Inter", sans-serif;
     background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
     background-size: 24px 24px;
   }

   .hide-scrollbar::-webkit-scrollbar {
     display: none;
   }
   .hide-scrollbar {
     -ms-overflow-style: none;
     scrollbar-width: none;
   }

   .hover-bounce:hover {
     transform: translateY(-2px);
   }
   ```

3. **Integrate Lucide icons**
   - Import from `lucide-react`: `Sparkles`, `BadgeCheck`, `TrendingUp`, `TrendingDown`, `Minus`, `ChevronRight`, `ArrowRight`, `Heart`
   - Use consistent sizing: w-3 h-3 (badge icons), w-4 h-4 (standard), w-5 h-5 (larger)
   - Add fills: `fill="currentColor"` for BadgeCheck and Heart

4. **Responsive design**
   - Hide rank labels on mobile: `hidden sm:flex` (line 100-105)
   - Adjust title size: `text-4xl sm:text-5xl`
   - Adjust padding: `px-4 sm:px-6`
   - Test at 768px breakpoint (Tailwind `md`)
   - Optional: Use `useIsMobile()` hook for conditional rendering

5. **Typography**
   - Import Google Fonts in `index.html`:
     ```html
     <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
     ```
   - Apply: `font-family: "Outfit", "Inter", sans-serif`
   - Verify tracking: `tracking-tight`, `tracking-tighter`, `tracking-wider`

### Success Criteria
- [ ] Pixel-perfect match with template
- [ ] Responsive at all breakpoints
- [ ] Smooth hover animations
- [ ] Icons render correctly
- [ ] Typography matches exactly

---

## Phase 6: Integration & Testing
**Complexity: M (Medium)**

### Goals
- Connect all components
- Test user interactions
- Optimize performance
- Prepare for future API integration

### Tasks
1. **Full integration**
   - Import all components into `LandingPage`
   - Wire up props and callbacks
   - Verify state updates trigger re-renders
   - Check for TypeScript errors

2. **Manual testing checklist**
   - [ ] Click "This Week" and "All Time" tabs
   - [ ] Hover over all leaderboard items
   - [ ] Click login button
   - [ ] Click leaderboard items
   - [ ] Click current user banner
   - [ ] Click "View full leaderboard"
   - [ ] Resize viewport to mobile (< 768px)
   - [ ] Check all icons render
   - [ ] Verify avatars load
   - [ ] Check browser console for errors

3. **Code quality**
   - Run `npm run lint` and fix all issues
   - Run `npm run build` and fix TypeScript errors
   - Add JSDoc comments to complex functions
   - Remove debug console.logs (except intentional handlers)
   - Ensure no `any` types

4. **Performance optimization**
   - Use `React.memo` for `LeaderboardItem` (prevents re-renders)
   - Consider `useMemo` for filtered data
   - Lazy load images if needed (DiceBear is fast)
   - Check bundle size with `npm run build`

5. **Prepare for API integration**
   - Create `src/services/leaderboardService.ts`:
     ```typescript
     export async function fetchLeaderboard(period: 'week' | 'alltime') {
       // TODO: Replace with real API call
       return mockLeaderboardData[period];
     }
     ```
   - Document expected API response format
   - Add error boundary component (optional)

### Success Criteria
- [ ] All tests pass (manual)
- [ ] No console errors or warnings
- [ ] TypeScript strict mode passes
- [ ] ESLint shows zero warnings
- [ ] Production build succeeds
- [ ] Performance is smooth (no jank)

---

## Phase 7: Advanced Features (Future)
**Complexity: XL (Extra Large)** *(Optional)*

### Optional Enhancements
1. **Animations with Framer Motion**
   - Install: `npm install framer-motion`
   - Stagger list items on mount
   - Slide transition between tabs
   - Smooth layout shifts with `layout` prop

2. **Real-time updates**
   - WebSocket connection for live scores
   - Toast notifications (Sonner) for rank changes
   - Optimistic UI updates
   - Reconnection logic

3. **Comprehensive accessibility**
   - ARIA labels: `aria-label="Leaderboard rank 1"`
   - Keyboard navigation: Tab through items, Enter to click
   - Focus indicators: `focus:ring-2 focus:ring-purple-500`
   - Screen reader: `role="list"`, `aria-live="polite"` for updates
   - Skip links for navigation

4. **Additional features**
   - Player detail modal (using Dialog from shadcn/ui)
   - Pagination or infinite scroll
   - Search/filter players by name
   - Share leaderboard (copy link or social)
   - Dark mode toggle (next-themes already installed)
   - Export to PDF/CSV

### Success Criteria (if implemented)
- [ ] Animations are smooth (60fps)
- [ ] WebSocket connection is stable
- [ ] Accessibility audit passes (Lighthouse)
- [ ] Dark mode works throughout
- [ ] Advanced features don't break core functionality

---

## Overall Success Criteria

### Functional Requirements
- [ ] All components render without errors
- [ ] Tab switching works and filters data correctly
- [ ] Hover effects match template exactly
- [ ] Click handlers are wired up
- [ ] Responsive design works at all breakpoints (mobile, tablet, desktop)

### Technical Requirements
- [ ] TypeScript strict mode passes (no errors)
- [ ] ESLint shows no warnings
- [ ] Production build succeeds (`npm run build`)
- [ ] Bundle size is reasonable (< 500KB gzipped)

### Quality Requirements
- [ ] Code is clean and well-commented
- [ ] Component props are typed with interfaces
- [ ] No hardcoded values (use constants or props)
- [ ] Follows React best practices (hooks rules, key props, etc.)
- [ ] Manual testing passes on Chrome and Firefox

### Design Requirements
- [ ] Pixel-perfect match with template
- [ ] All colors, fonts, and spacing match
- [ ] Icons display correctly
- [ ] Animations are smooth and performant

---

## Estimated Timeline

| Phase | Complexity | Estimated Time |
|-------|-----------|----------------|
| Phase 1 | S | 1-2 hours |
| Phase 2 | S | 2-3 hours |
| Phase 3 | L | 3-4 hours |
| Phase 4 | M | 1-2 hours |
| Phase 5 | M | 2-3 hours |
| Phase 6 | M | 1-2 hours |
| **Total (Core)** | | **10-16 hours** |
| Phase 7 (Optional) | XL | 8-12 hours |

**Total with advanced features**: 18-28 hours

---

## Development Notes

### Template-Specific Details
- **DiceBear API**: Works without authentication, customize with `seed` and `backgroundColor` params
- **Lucide Icons**: Already in dependencies (`lucide-react`)
- **Font Family**: Outfit (primary) and Inter (fallback)
- **Color Palette**: Stone (neutral), Purple (accent), Yellow (rank 1), Orange (rank 3), Green (up trend), Red (down trend)

### Project Architecture
- Use `@/` path alias for imports (already configured)
- Follow shadcn/ui component composition patterns
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Avoid inline styles - use Tailwind exclusively
- Keep components small and focused (single responsibility)

### Best Practices
- Export interfaces separately for reuse
- Use TypeScript's `Pick`, `Omit`, `Partial` for derived types
- Memoize expensive computations with `useMemo`
- Use `useCallback` for event handlers passed as props
- Add `key` prop when mapping arrays
- Handle loading and error states gracefully

### Critical Path
**Phase 3** is the bottleneck due to:
- Multiple component variants
- Complex conditional styling
- Many hover effects and transitions
- Integration of external avatar API

Allocate extra time for testing and polish in this phase.

---

## Next Steps

1. Review and approve this plan
2. Set up development environment (`npm install`)
3. Create feature branch: `git checkout -b feature/landing-page`
4. Begin Phase 1: TypeScript interfaces and mock data
5. Iterate through phases sequentially
6. Commit after each phase completion
7. Create PR when Phases 1-6 are complete

---

*Plan created: 2025-11-24*
*Target: React 19 + TypeScript + Vite + Tailwind CSS*
*Status: Ready for development*
