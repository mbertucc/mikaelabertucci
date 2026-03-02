
# Contrast Ratio Audit -- Dark Mode

## Findings

After calculating contrast ratios for all `muted-foreground` usage in dark mode:

**Passing (no changes needed):**
- `text-muted-foreground` (base, no opacity) achieves ~6.5:1 against background and ~5.3:1 against card surfaces. Well above WCAG AA (4.5:1). Used across ExperienceSection, AboutSection, SkillsMatrix, JDAnalyzer, DarkFactorySection, etc.
- Placeholder text at `/50` opacity is exempt from WCAG requirements (not persistent content).

**Failing:**
- **Footer disclaimer** (`text-muted-foreground/60` in Footer.tsx): "This portfolio is AI-queryable..." text at 60% opacity yields ~3.5:1 contrast against the background. Fails WCAG AA for normal text (requires 4.5:1).

## Proposed Fix

**File: `src/components/Footer.tsx` (line 33)**
- Change `text-muted-foreground/60` to `text-muted-foreground/80`
- This brings the effective contrast to ~4.8:1, passing WCAG AA while maintaining the subdued visual hierarchy intended for footer disclaimer text.

This is a single-line change. No other files need modification -- all other `muted-foreground` usage passes at full opacity.
