

## Reframe Top 5 as BC Government Project Portfolio

All content (Challenge, Outcome, Approach, Technical Work, Lessons Learned) stays exactly as-is. Only the **visual grouping and card headers** change.

### Changes — `src/components/ExperienceSection.tsx` only

**1. Add a BC Government wrapper around the top 5 cards**
- A container with a header: **"BC Provincial Government"** + date range **"2018 – Present"**
- A one-line intro: *"Seven years delivering digital products across multiple ministries and programs."*
- Styled with a subtle left border or background tint to visually group them

**2. Swap card header hierarchy**
- Parse `company` field on `" — "` to extract the project name
- **Project name** becomes the `h3` heading (e.g., "Multi-Registry Portfolio")
- **Org + role title** drops to a smaller subtitle line (e.g., "BC Registries & Online Services · Certified Product Owner")
- Date range and Ask AI button stay in the same position

**3. Everything else untouched**
- Challenge, Outcome sections remain always-visible
- Approach, Technical Work, Lessons Learned remain in the collapsible "Show Details" toggle
- Earlier Career section unchanged
- `renderSections`, `renderBulletText`, all section constants — no changes

