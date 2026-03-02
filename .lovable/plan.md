# "Beyond Work" Personal Interests Section

## Placement

The new section will sit between **Skills Matrix** and **JD Analyzer** (Fit Check). This is the natural spot — after showcasing professional capabilities, a personal touch humanizes the portfolio before the interactive hiring tool.

## Design Approach

A lightweight, visually distinct section using icon "chips" or tags in a flowing grid. Each interest gets a small icon + label, keeping the aesthetic clean and consistent with the existing design system (glass-card, font-body, muted tones). No heavy cards — just a casual, scannable layout that feels personal without being cluttered.

## Interests Mapping

Each item gets a relevant Lucide icon:

- **Pilates** -- Dumbbell
- **Pickleball** -- CircleDot
- **Motorcyclist** -- Bike (closest available)
- **MX-5 Driver** -- Car
- **Sauna Enthusiast** -- Flame
- **Boston Terriers** -- Dog
- **Hiking** -- TreePine
- **Healthy Lifestyle** -- Heart
- **AI in Daily Life** -- Sparkles
- **70s/80s/90s Music** -- Music
- **Plant Mom** -- Plants

## Technical Plan

### 1. Create `src/components/BeyondWorkSection.tsx`

- Simple functional component
- Uses a `glass-card` container matching existing section styling
- Section header: small uppercase tracking label ("Beyond the Backlog" or similar)
- Renders interests as a flex-wrap grid of pill-shaped chips, each with an icon and label
- Subtle hover effect (scale or color shift) for interactivity
- Responsive: wraps naturally on mobile

### 2. Update `src/pages/Index.tsx`

- Import `BeyondWorkSection`
- Place it between `<SkillsMatrix />` and `<JDAnalyzer />`

### No database changes needed

The content is personal/static and doesn't need to be editable from the admin panel. It can be hardcoded in the component.