

## Redesign Ventures as a Master Project Hub

Transform the current Ventures page from a single-product pitch into a master project overview that ties together three interconnected products under one unified vision.

### The Three Products

1. **Agentic Resume Portfolio** (existing content) -- The job-seeker side. AI-powered platform for building, tailoring, and publishing living resume portfolios with a conversational agent.

2. **Agentic Recruiter** (new) -- The recruiter side. A subscription-based portal where recruiters create accounts, post jobs via an agent, scan the Resume Portfolio network for matching candidates, evaluate competencies (strategic thinking, motivation, trust, leadership, change management), and manage the full recruitment lifecycle through a built-in CRM.

3. **Verified Credentials Portal** (new) -- The trust layer. The infrastructure that connects both sides -- enabling job seekers to attach verifiable credentials (identity, address, employment history, education, testimonials) and recruiters to verify candidates are who they say they are.

### Page Structure

**Master Landing Section** -- A new hero area at the top of `/ventures` introducing the unified vision: three products forming a complete recruitment ecosystem. Visual diagram showing how the three products connect (Seekers -> Resume Portfolio -> Verified Credentials <- Recruiter Portal).

**Product Cards** -- Three clickable cards, each expanding into its own detailed section:

- **Card 1: Agentic Resume Portfolio** -- Retains all existing epics (1-9) and subscription tiers. Presented as the job-seeker experience.

- **Card 2: Agentic Recruiter** -- New section with epics covering:
  - Account creation and subscription
  - Job posting via conversational agent
  - Competency framework configuration (strategic thinking, motivation, trust, growing people, leading change)
  - AI clarification agent (asks follow-up questions to narrow candidates)
  - Candidate search and matching across the Resume Portfolio network
  - Results dashboard with match scores
  - Recruitment CRM (pipeline stages, notes, scheduling, outreach)
  - Verified credential checks on candidates

- **Card 3: Verified Credentials Portal** -- New section expanding on Epic 9, covering:
  - Identity verification (mDL, eID, eIDAS 2.0)
  - Address verification
  - Employment history credentials
  - Education credentials (W3C VCs, Open Badges)
  - Testimonial/reference credentials
  - Wallet integration (Apple Wallet, Google Wallet)
  - How recruiters consume and verify credentials

### Technical Changes

**Files to create:**
- `src/pages/VenturesHub.tsx` -- New master page component with the three-product overview and navigation between sections

**Files to modify:**
- `src/pages/Ventures.tsx` -- Refactor to become a sub-view or merge content into VenturesHub
- `src/App.tsx` -- Update routing: `/ventures` points to the new hub page

**No database changes required** -- This is purely a frontend content/layout update to the pitch-deck presentation.

### Layout Details

- Top: Master hero with project name, vision statement, and a simple flow diagram
- Middle: Three product cards in a row (mobile: stacked), each with icon, title, one-line description, and "Explore" button
- Bottom: When a product is selected, its detailed epics and content expand below (using tabs or accordion), reusing the existing epic card + accordion pattern
- The existing Resume Portfolio epics and subscription table move into the first product tab
- Navigation stays the same (back to portfolio, AuthGuard protection)

