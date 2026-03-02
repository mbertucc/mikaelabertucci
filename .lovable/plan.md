

# Tighten Experience Cards + Add "Ask AI" Button

## Part 1: Content Reduction (Resume Writer Recommendations)

Each card currently shows 5 sections: Challenge, Approach, Technical Work, Outcome, and Lessons Learned. This is too dense for a portfolio scanner. As a recruiter, here's the trim strategy:

**Default visible sections: Challenge + Outcome only.** These are what hiring managers scan for -- the problem and the measurable result. The other 3 sections (Approach, Technical Work, Lessons Learned) move behind a collapsible "Show Details" toggle within each card.

This cuts each card's visible content by roughly 60%, making the page scannable while keeping the depth available on demand.

**Changes to `src/components/ExperienceSection.tsx`:**
- Split SECTIONS into `PRIMARY_SECTIONS` (Challenge, Outcome) and `DETAIL_SECTIONS` (Approach, Technical Work, Lessons Learned)
- Add per-card `expandedCards` state (a Set of role IDs)
- Render primary sections always, detail sections only when expanded
- Add a small "Show Details" / "Hide Details" toggle link below primary sections

## Part 2: "Ask AI" Button Per Experience Card

Add a small button in the top-right corner of each card header that opens the ChatDrawer with a role-specific pre-filled question.

**Changes to `src/components/ExperienceSection.tsx`:**
- Accept an `onAskAI` callback prop (or dispatch the existing `open-chat` custom event)
- Add a button with a small AI/chat icon in the card header area (top-right), labeled "Ask AI"
- On click, dispatch `open-chat` with a message like: `"Tell me more about Mikaela's experience as {role.title_progression} at {role.company}. What was the impact and what skills were demonstrated?"`

**Changes to `src/pages/Index.tsx`:**
- No changes needed -- the existing `open-chat` custom event listener already handles opening ChatDrawer with an initial message

## Technical Details

### ExperienceSection.tsx modifications:
1. Add `expandedCards` state: `useState<Set<string>>(new Set())`
2. Split sections constant into primary (ai_situation, achievements) and detail (ai_approach, ai_technical_work, ai_lessons_learned)
3. In `renderCard`, render primary sections first, then a collapsible detail block
4. Add "Show Details" toggle button (using ChevronDown icon, already imported)
5. Add "Ask AI" button in the header row using the `MessageSquare` icon (from lucide-react)
6. Fire `window.dispatchEvent(new CustomEvent("open-chat", { detail: "..." }))` on click with a role-specific prompt

No new files, no database changes, no new dependencies.
