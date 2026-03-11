

## Foundation Refresh: Accent Color Pop + Bolder Typography

### What changes

**1. Typography — Switch display font to Sora**

Sora is a geometric sans-serif with rounded terminals — more energetic and modern than Montserrat while staying professional. It has excellent weight range for bold headlines.

- Add Sora (weights 400, 500, 600, 700) via Google Fonts in `index.html`
- Update `--font-sans` and font-family config in `tailwind.config.ts` and `index.css` so `font-display` uses Sora
- Keep Montserrat for body text (`font-body`) — the contrast between display and body fonts adds visual energy
- Bump hero `h1` from `text-6xl md:text-8xl` to `text-7xl md:text-9xl` with `font-bold` for more punch
- Make section headings slightly larger and bolder across the board

**2. Accent Color Pop — Warm Coral**

Add a warm coral accent (`--accent-warm: 12 80% 60%` / approx `#E8634A`) that injects energy without replacing the existing teal primary. The coral appears on high-impact interactive elements.

Files touched: `src/index.css`, `tailwind.config.ts`

- Add `--accent-warm` and `--accent-warm-foreground` CSS variables (light + dark mode)
- Add `accent-warm` color to Tailwind config
- Update `tailwind.config.ts` to reference the new color

**3. Apply accent-warm to key touchpoints**

The coral accent appears where it matters — places the user interacts with or notices first:

| Element | Current | New |
|---------|---------|-----|
| Hero status badge dot | `bg-primary` (teal) | `bg-accent-warm` (coral) |
| Hero title italic line | `text-primary` | `text-accent-warm` |
| "Ask AI About Me" button | `bg-primary` | `bg-accent-warm` with warm glow |
| Nav "MB" logo | `text-primary` | `text-accent-warm` |
| Hover states on nav links | `hover:text-foreground` | `hover:text-accent-warm` |
| "Deep Dive with AI" button | `text-primary` border | `text-accent-warm` border |
| `.glow-primary` utility | teal glow | add `.glow-warm` with coral glow |

Files touched: `HeroIntro.tsx`, `Navbar.tsx`, `AboutSection.tsx`, `index.css`

The teal primary stays for data-focused elements (stat rings, skill tags, section labels) — creating a clear visual hierarchy: **coral = personality/action**, **teal = substance/data**.

### Files modified

- `index.html` — add Sora font import
- `src/index.css` — add `--accent-warm` vars, `.glow-warm` utility, Sora in font stacks
- `tailwind.config.ts` — add `accent-warm` color, update `display` font family to Sora
- `src/components/HeroIntro.tsx` — larger h1, coral accent on subtitle and badge dot
- `src/components/Navbar.tsx` — coral on logo, AI button, hover states
- `src/components/AboutSection.tsx` — coral on "Deep Dive with AI" button

