import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import "../resume.css";
import headshot from "@/assets/mikaela-headshot.png";

/* ════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════ */

const PROFILE = {
  email: "hello@mikaelabertucci.com",
  linkedin: "https://linkedin.com/in/mikaelabertucci",
  github: "https://github.com/mbertucc",
};

const METHOD = [
  {
    num: "01", tone: "sky", label: "The Input", title: "Legislative Complexity",
    body: "Three simultaneous registries — Manufactured Home, Personal Property, Business Registry — each with its own Act, regulations, edge cases, and municipal enforcement regime. A scope normally split across two people.",
    stat: "3", statLbl: "Concurrent\nRegistries",
  },
  {
    num: "02", tone: "indigo", label: "The Process", title: "16-Agent Pipeline",
    body: "A personal PO workflow pipeline — Chain-of-Thought agents running in parallel. Edge-case detection, consistency checking, and Gherkin spec generation as discrete agent roles. **40 hours of legislative analysis → 2.5 hours.**",
    stat: "16", statLbl: "Multilevel\nAI Agents",
  },
  {
    num: "03", tone: "emerald", label: "The Output", title: "Ship-Ready Spec",
    body: "Story maps, acceptance criteria, and Gherkin specs a dev team or AI agent can act on immediately. **116.5 hours saved across a single 6-week sprint cycle** — reinvested in judgment, not paperwork.",
    stat: "116.5", statLbl: "Hours Saved\nPer Sprint Cycle",
  },
];

const LEDGER = [
  {
    key: "analysis", value: "40→2.5", unit: "hr", label: "Legislative\nAnalysis",
    detailLabel: "Analysis Compression",
    detail: [
      "Human-in-the-Loop agent framework across three registries — MHR, PPR, Business Registry.",
      "Discovery agent scans the relevant Act and regulations; extracts obligations, triggers, and edge cases.",
      "AI handles the volume. I handle every regulatory judgment call.",
      "Per-domain cycle time: 40 hours → 2.5 hours. Same rigor, none of the drudgery.",
    ],
  },
  {
    key: "saved", value: "116.5", unit: "hr", label: "Saved In One\n6-Week Sprint",
    detailLabel: "Compounding Savings",
    detail: [
      "Measured across a real 6-week sprint cycle on the multi-registry portfolio.",
      "≈ 19 hours a week reinvested into team unblocking, strategy, and stakeholder work.",
      "The personal workflow pipeline handles the volume — judgment stays where it belongs.",
    ],
  },
  {
    key: "agents", value: "16", unit: "", label: "Multilevel AI\nAgents Deployed",
    detailLabel: "Agent Architecture",
    detail: [
      "16-agent pipeline maintaining legislative context across all three registries in parallel.",
      "Edge-case detection, consistency checking, and Gherkin spec generation as discrete agent roles.",
      "Expanded from the context-engineering framework I originated at the Short-Term Rental Registry.",
    ],
  },
  {
    key: "pivots", value: "3", unit: "", label: "Ministerial Pivots\nAbsorbed — STRR",
    detailLabel: "Political Durability",
    detail: [
      "Short-Term Rental Registry — politically sensitive, consumer-facing, hard legislative deadlines.",
      "Shipped through 3 major ministerial directional pivots without disrupting sprint velocity or morale.",
      "Where the legislation-to-AI context-engineering discipline was born before becoming a 16-agent practice.",
    ],
  },
];

const EXPERIENCE = [
  {
    date: "2025 — Present", title: "Founder & Product Lead", sub: "Delpheus · Solo venture",
    org: "Claude Code + Supabase + Vercel + Anthropic API", current: true,
    challenge: "Build an AI-native product specification platform — 0-to-1, solo, on Anthropic's full stack — that closes the translation gap between business intent and buildable AI agent instructions.",
    outcomes: [
      "Architected the full product: React + Vite + Tailwind frontend, Supabase backend, three production edge functions (chat, JD analyzer, site-metrics) calling the Claude API.",
      "Prototype with Claude Code daily — agentic spec generation, context engineering, human-in-the-loop validation workflows.",
      "Built mikaelabertucci.com as a live product demo of the methodology — an AI-queryable portfolio, not a static resume.",
    ],
  },
  {
    date: "Mar 2025 — Present", title: "Certified Product Owner — Multi-Registry Portfolio",
    sub: "MHR · PPR · Business Registry", org: "BC Registries and Online Services", current: true,
    challenge: "Part of a high-performing MHR/PPR team that pivoted to support Business Registry migration — building features to migrate users from the legacy system to the new platform while expanding the context engineering framework built at STRR across all three regulatory domains.",
    outcomes: [
      "Reduced legislative analysis from 40 hours to 2.5 hours per regulatory domain using a Human-in-the-Loop agent framework — 116.5 hours saved across a single 6-week sprint cycle.",
      "Built a 16-agent personal workflow pipeline for legislative analysis — parallel agents handling edge case detection, consistency checking, and Gherkin spec generation across all three regulatory domains.",
      "Developed domain expertise across three distinct regulatory environments in days, not weeks — eliminating traditional knowledge-transfer timelines.",
      "Maintained human judgment as the final decision layer on all regulatory calls.",
    ],
  },
  {
    date: "Jan 2024 — Mar 2025", title: "Certified Product Owner — Short-Term Rental Registry",
    sub: "STRR · Consumer-facing, ministerial oversight", org: "BC Registries and Online Services", current: false,
    challenge: "Politically sensitive consumer-facing registry with shifting requirements and hard legislative deadlines. Where the context engineering framework originated.",
    outcomes: [
      "Shipped STRR absorbing 3 major ministerial directional pivots without disrupting sprint velocity or team morale.",
      "Pioneered legislation-to-AI context engineering as a PO discipline — feeding the Short-Term Rental Act directly into structured prompts to generate story maps and acceptance criteria.",
      "Coached Housing branch executives on Agile maturity; built organizational capability that outlasted the engagement.",
    ],
  },
  {
    date: "May 2023 — Jan 2024", title: "Certified Scrum Master & Agile Coach",
    sub: "Privacy Branch · DPIA Tool", org: "BC Provincial Government", current: false,
    challenge: "Build Agile delivery capability from scratch inside a team of privacy policy analysts with zero iterative delivery experience.",
    outcomes: [
      "Met the team at their baseline rather than imposing a framework — designed workshops bridging document-based policy work with iterative digital product delivery.",
      "Established the rituals and working agreements the team still uses.",
    ],
  },
  {
    date: "Sep 2018 — Dec 2021", title: "Certified Product Owner — PIMS",
    sub: "Property Information Management System", org: "Strategic Real Estate Services, Ministry of Citizens' Services", current: false,
    challenge: "Build PIMS from zero — a GIS-integrated, open-source real estate inventory system consolidating property data scattered across 180+ BC municipalities.",
    outcomes: [
      "Delivered an enterprise open-source platform now used daily by 8 Ministries and 5 Broader Public Sector clients.",
      "Cut Ministry response times by 50% through user-workflow-first system design.",
      "Secured $1M in funding and Exchange Lab residency through Sprint With Us procurement.",
      "Led bi-weekly user research with a UX designer and 7-developer team. MVP on time, on budget, in scope.",
    ],
  },
  {
    date: "2016 — 2018", title: "Senior Freedom of Information Analyst",
    sub: "Foundational legislative rigor", org: "BC Ministry of Citizens' Services", current: false,
    challenge: "Read legislation to extract obligations, triggers, and edge cases — the analytical rigor that later became the foundation of the AI context-engineering work.",
    outcomes: [
      "Built the pattern-recognition muscle for legislative language that now powers the 16-agent pipeline.",
      "Reading an Act and extracting rules is the same skill — just now with agents doing the first pass.",
    ],
  },
  {
    date: "2000 — 2005", title: "Project Manager — Real Estate & Mortgage Technology",
    sub: "Multi-Active Software · Infinity Mortgages", org: "Private sector", current: false,
    challenge: "Build Realtylink.org and Canadamortgage.com — early-stage proptech and fintech before modern frameworks existed.",
    outcomes: [
      "Database design (SQL), front-end development (HTML), wireframing, business process mapping.",
      "First-principles product delivery without the modern tooling — the muscle memory still shows up in the founder work today.",
    ],
  },
];

const SKILLS = {
  strong: {
    label: "AI & Builder",
    items: ["Claude Code", "Anthropic API", "Context Engineering", "Multi-agent Architecture (16-agent pipelines)", "Chain-of-Thought Workflows", "Gherkin / BDD Spec Generation", "Human-in-the-Loop Validation", "Supabase", "Vercel", "React + Vite + Tailwind", "Edge Functions", "0-to-1 Product Development"],
  },
  moderate: {
    label: "Product & Delivery",
    items: ["CSP-PO — Certified Scrum Professional PO", "A-CSPO — Advanced CSPO", "0-to-1 Product Development", "Roadmapping", "Agile Coaching", "Sprint Planning", "Backlog Strategy", "Cross-Ministry Coordination", "Legislative Interpretation", "Stakeholder Management (Ministerial)", "Procurement (Sprint With Us)", "Definition of Ready", "Scenario Modeling"],
  },
  gap: {
    label: "Privacy & Trust",
    items: ["CIPP/C — Certified Information & Privacy Professional (Canada)", "Privacy-by-Design Architecture", "Legislative Compliance", "DPIA Frameworks", "SQL", "API Integration", "GIS Systems"],
  },
};

const INTERESTS = ["Pilates", "Pickleball", "Motorcyclist", "MX-5 Driver", "Sauna Enthusiast", "Boston Terriers", "Hiking", "Healthy Lifestyle", "AI in Daily Life", "70s · 80s · 90s Music", "Plant Mom", "Blockchain & Crypto"];

const JD_EXAMPLES = {
  strong: `Senior Product Owner — Digital Government Services\n\nWe're looking for a Senior Product Owner to lead our digital transformation initiatives within a provincial government ministry. You'll own the product vision for citizen-facing registry systems and drive AI integration to modernize service delivery.\n\nRequirements:\n- 8+ years in product ownership or management\n- Deep experience with government/public sector delivery\n- Track record of modernizing legacy systems\n- Experience with agile methodologies (CSM/CSPO preferred)\n- Stakeholder management across multiple departments\n- Familiarity with AI tools for productivity and requirements`,
  weak: `Senior Full-Stack Engineer — Platform Team\n\nWe're looking for a Senior Full-Stack Engineer to build and maintain our core platform. You'll write production code daily in TypeScript/React, design APIs, and own the full development lifecycle.\n\nRequirements:\n- 5+ years of professional software engineering\n- Expert-level TypeScript, React, and Node.js\n- Experience building and deploying microservices\n- Strong understanding of CI/CD pipelines\n- Database design and optimization (PostgreSQL)\n- Code review and mentorship of junior developers`,
};

/* ════════════════════════════════════════════════════════════
   LOGO MARK
   ════════════════════════════════════════════════════════════ */

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div className="r-logo-mark" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <radialGradient id="lgcore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a5f3fc"/>
            <stop offset="100%" stopColor="#818cf8"/>
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="4.5" fill="url(#lgcore)"/>
        <ellipse className="r-logo-ring-1" cx="16" cy="16" rx="11" ry="5.5" stroke="#38bdf8" strokeWidth="1.4" fill="none"/>
        <ellipse className="r-logo-ring-2" cx="16" cy="16" rx="11" ry="5.5" stroke="#818cf8" strokeWidth="1.1" fill="none"/>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   NAV
   ════════════════════════════════════════════════════════════ */

function Nav({ onAsk }: { onAsk: () => void }) {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav className="r-nav">
      <div className="r-nav-inner">
        <button className="r-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <LogoMark size={30}/>
          <span className="r-nav-name">Mikaela <em>Bertucci</em></span>
        </button>
        <div className="r-nav-links">
          <button className="r-nav-link" onClick={() => go("ventures")}>Delpheus</button>
          <button className="r-nav-link" onClick={() => go("method")}>Method</button>
          <button className="r-nav-link" onClick={() => go("experience")}>Experience</button>
          <button className="r-nav-link" onClick={() => go("fit")}>Fit Check</button>
          <button className="r-btn r-btn-outline" onClick={onAsk}>◊ Ask AI About Me</button>
        </div>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════════════════════
   SPEC CARD (hero right)
   ════════════════════════════════════════════════════════════ */

function SpecCard() {
  const [typed, setTyped] = useState(0);
  const full = "Agentic Product Owner, 2018 → present";
  useEffect(() => {
    const id = setInterval(() => {
      setTyped(t => t < full.length ? t + 1 : t);
    }, 40);
    return () => clearInterval(id);
  }, []);
  const now = new Date();
  const ref = `MB-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  return (
    <div className="r-spec-card">
      <div className="r-spec-head">
        <div className="r-spec-head-left">
          <span className="r-spec-dot"/>
          <span className="r-spec-head-label">Living Spec · v.2026</span>
        </div>
        <span className="r-spec-head-meta">REF {ref}</span>
      </div>
      {[
        { k: "Subject", v: <strong>Mikaela Bertucci</strong> },
        { k: "Role", v: <>{full.slice(0, typed)}<span className="r-type-cursor"/></> },
        { k: "Based", v: <>Victoria, BC · <span className="hl">Open to opportunities</span></> },
        { k: "Hypothesis", v: <>AI handles the volume. <strong>I handle the accountability.</strong></> },
        { k: "Building", v: <><strong>Delpheus</strong> — AI-native product spec platform. Solo, on Anthropic's stack. <span className="hl">Live.</span></> },
        { k: "Shipping", v: "16-agent pipeline · 3 concurrent registries · 116.5 hrs / sprint" },
        { k: "Certifications", v: "CSP-PO · A-CSPO · CIPP/C" },
        { k: "Blueprint", v: <span className="hl">See ventures ↓</span> },
      ].map(r => (
        <div key={r.k} className="r-spec-row">
          <span className="r-spec-key">{r.k}</span>
          <span className="r-spec-val">{r.v}</span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════════════════════ */

function Hero({ onAsk }: { onAsk: () => void }) {
  return (
    <section className="r-hero" id="top">
      <div className="r-hero-inner">
        <div>
          <p className="r-eyebrow">Founder · Product Owner · CIPP/C</p>
          <h1 className="r-hero-name">
            <span className="first">Mikaela</span>
            <span className="last">Bertucci</span>
          </h1>
          <p className="r-hero-tagline">
            I build products on Claude. As a solo founder I shipped <span className="accent">Delpheus</span> — an AI-native product spec platform — because the biggest bottleneck in AI-assisted development isn't the model. It's the human who can't translate business intent into something an agent can act on.
          </p>
          <div className="r-hero-meta">
            <span className="r-hero-pill emerald"><span className="r-hero-pulse"/>Open to opportunities · SF / NYC</span>
            <span className="r-hero-pill">Founder · Delpheus</span>
            <span className="r-hero-pill indigo">Multi-Registry PO · BC Gov</span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="r-btn r-btn-primary r-btn-lg" onClick={onAsk}>◊ Ask AI About Me</button>
            <a className="r-btn r-btn-outline r-btn-lg" href="#ventures">See Delpheus →</a>
          </div>
        </div>
        <div className="r-hero-right">
          <div className="r-portrait-orb">
            <div className="r-portrait-ring r-portrait-ring-1"/>
            <div className="r-portrait-ring r-portrait-ring-2"/>
            <div className="r-portrait-ring r-portrait-ring-3"/>
            <div className="r-portrait-glow"/>
            <img src={headshot} alt="Mikaela Bertucci" className="r-portrait-img"/>
          </div>
          <SpecCard/>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   VENTURES (Delpheus)
   ════════════════════════════════════════════════════════════ */

function Ventures() {
  return (
    <section className="r-section" id="ventures">
      <div className="r-wrap-narrow">
        <div className="r-section-head-row">
          <h2 className="r-section-title">Current venture — <span className="accent">Delpheus.</span></h2>
          <span className="r-section-n">§ 00 · Shipping</span>
        </div>
        <div className="r-ventures-grid">
          <div style={{ background: "linear-gradient(160deg, rgba(17,30,53,0.85), rgba(14,21,40,0.75))", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: 40, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(139,92,246,0.3), transparent)" }}/>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <LogoMark size={40}/>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 28, color: "#f1f5f9", letterSpacing: "-0.01em" }}>Delpheus</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#38bdf8", opacity: 0.75, marginTop: 2 }}>◊ AI-Native Product Spec Platform</div>
              </div>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#e2e8f0", margin: "0 0 20px" }}>
              A live product I architected, built, and ship solo — 0-to-1, on Anthropic's full stack. Closes the translation gap between rough business intent and spec an AI agent can actually act on.
            </p>
            <div className="r-stack-grid">
              {[
                { k: "Stack", v: "Claude Code · Anthropic API" },
                { k: "Frontend", v: "React · Vite · Tailwind" },
                { k: "Backend", v: "Supabase · Vercel" },
                { k: "Edge Functions", v: "chat · JD analyzer · metrics" },
              ].map(r => (
                <div key={r.k} className="r-stack-item">
                  <div className="r-stack-key">{r.k}</div>
                  <div className="r-stack-val">{r.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
              <a className="r-btn r-btn-primary" href="https://delpheus.ai" target="_blank" rel="noopener noreferrer">Visit Delpheus →</a>
              <a className="r-btn r-btn-outline" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>

          <div className="r-ventures-right">
            <div className="r-ventures-card">
              <div className="r-ventures-card-label sky">◊ Thesis</div>
              <div className="r-ventures-thesis">
                The biggest bottleneck in AI-assisted development <span style={{ color: "#38bdf8" }}>isn't the model.</span> It's the human who can't translate business intent into something an agent can act on.
              </div>
            </div>
            <div className="r-ventures-card">
              <div className="r-ventures-card-label indigo">◊ What I built · solo</div>
              <ul className="r-ventures-list">
                {[
                  "Full React + Vite + Tailwind frontend — architecture, auth, data model.",
                  "Supabase backend with three production edge functions calling the Anthropic API.",
                  "Spec-generation pipeline: rough intent → structured story map → Gherkin acceptance criteria.",
                  "CI/CD on Vercel; live in production; iterating with Claude Code daily.",
                ].map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="r-ventures-card emerald">
              <div className="r-ventures-card-label emerald" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}/>
                ◊ Why I built it
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#e2e8f0" }}>
                11+ years in technology, and the recent leaps in AI taught me one thing: <strong style={{ color: "#f1f5f9" }}>the gap in AI-assisted coding isn't the tools.</strong> It's the ability to clearly specify what to build — without overbuilding, and without letting AI lead you down rabbit holes. I built my PO discipline directly into Delpheus to help founders, product owners, and engineers manage scope, focus on an MVP, and ship it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   METHOD
   ════════════════════════════════════════════════════════════ */

function Method() {
  return (
    <section className="r-section" id="method">
      <div className="r-wrap-narrow">
        <div className="r-section-head-row">
          <h2 className="r-section-title">The Agentic Product Owner workflow — <span className="accent">three steps from legislation to ship-ready.</span></h2>
          <span className="r-section-n">§ 01 · Method</span>
        </div>
        <div className="r-method-grid">
          {METHOD.map(s => (
            <div key={s.num} className={`r-method-step ${s.tone}`}>
              <span className="r-method-num">{s.num}</span>
              <p className="r-method-label">{s.label}</p>
              <h3 className="r-method-title">{s.title}</h3>
              <p className="r-method-body" dangerouslySetInnerHTML={{ __html: s.body.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }}/>
              <div className="r-method-stat">
                <span className="r-method-stat-num">{s.stat}</span>
                <span className="r-method-stat-lbl">{s.statLbl}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "#94a3b8", textAlign: "center" }}>
          — Real cycle: Manufactured Home Registry Self-Serve, 6 weeks —
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   LEDGER
   ════════════════════════════════════════════════════════════ */

function Ledger() {
  const [active, setActive] = useState("analysis");
  const cur = LEDGER.find(l => l.key === active) || LEDGER[0];
  return (
    <section className="r-section r-section-dark" id="metrics">
      <div className="r-wrap-narrow">
        <div className="r-section-head-row">
          <h2 className="r-section-title">What this looks like <span className="accent">in practice.</span></h2>
          <span className="r-section-n">§ 02 · Ledger</span>
        </div>
        <div className="r-ledger" onMouseLeave={() => setActive("analysis")}>
          {LEDGER.map(l => (
            <div key={l.key} className={`r-ledger-cell ${active === l.key ? "active" : ""}`} onMouseEnter={() => setActive(l.key)}>
              <div className="r-ledger-value">{l.value}<span className="unit">{l.unit}</span></div>
              <div className="r-ledger-label">{l.label}</div>
            </div>
          ))}
        </div>
        <div className="r-ledger-detail">
          <div className="r-ledger-detail-label">{cur.detailLabel}</div>
          <ul>{cur.detail.map((d, i) => <li key={i}>{d}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   QUOTE BANNER
   ════════════════════════════════════════════════════════════ */

function QuoteBanner() {
  return (
    <section className="r-quote-banner">
      <div className="r-wrap-narrow">
        <p className="r-quote-text">"AI handles the volume. <span className="accent">I handle the accountability.</span>"</p>
        <p className="r-quote-attr"><span className="bar"/> Operating Principle · 2026 <span className="bar"/></p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   EXPERIENCE
   ════════════════════════════════════════════════════════════ */

function Experience({ onAsk }: { onAsk: (seed: string) => void }) {
  return (
    <section className="r-section" id="experience">
      <div className="r-wrap-narrow">
        <div className="r-section-head-row">
          <h2 className="r-section-title">Seven years — <span className="accent">BC Provincial Government.</span></h2>
          <span className="r-section-n">§ 03 · Experience</span>
        </div>
        <div className="r-xp-umbrella">
          <div className="r-xp-umbrella-top">
            <h3 className="r-xp-umbrella-org">BC Provincial Government</h3>
            <span className="r-xp-umbrella-span">2018 — PRESENT</span>
          </div>
          <p className="r-xp-umbrella-desc">
            Delivering digital products across multiple ministries and programs — Registries, Citizens' Services, and cross-ministry digital modernization.
          </p>
        </div>
        <div className="r-xp-list">
          {EXPERIENCE.map((r, i) => (
            <article key={i} className={`r-xp-role ${r.current ? "current" : ""}`}>
              <div className="r-xp-role-head">
                <div className="r-xp-date">{r.date}</div>
                <div>
                  <h3 className="r-xp-title">{r.title}</h3>
                  <div className="r-xp-title-sub">{r.sub} · {r.org}</div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  {r.current && <span className="r-xp-current-pill"><span className="r-hero-pulse"/>Current</span>}
                  <button className="r-xp-ask" onClick={() => onAsk(`Tell me more about Mikaela's work as ${r.title} at ${r.org}. What was the impact?`)}>◊ Ask AI</button>
                </div>
              </div>
              <div className="r-xp-body">
                <p className="r-xp-section-label">Challenge</p>
                <p className="r-xp-challenge">{r.challenge}</p>
                <p className="r-xp-section-label">Outcomes</p>
                <ul className="r-xp-outcomes">
                  {r.outcomes.map((o, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: o.replace(/([0-9]+(\.[0-9]+)?[%+x×]?\s*(?:hrs|hours|weeks|stories|ministries|registries|cycle)?)/g, '<span class="metric">$1</span>') }}/>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   SKILLS
   ════════════════════════════════════════════════════════════ */

function Skills() {
  const [tab, setTab] = useState<"strong" | "moderate" | "gap">("strong");
  const cur = SKILLS[tab];
  return (
    <section className="r-section r-section-dark" id="skills">
      <div className="r-wrap-narrow">
        <div className="r-section-head-row">
          <div>
            <h2 className="r-section-title">Skills — <span className="accent">honest calibration.</span></h2>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 14, color: "#94a3b8", marginTop: 12, maxWidth: 560 }}>Knowing what I don't know matters too.</p>
          </div>
          <span className="r-section-n">§ 04 · Skills</span>
        </div>
        <div className="r-skills-tabs">
          {(Object.keys(SKILLS) as Array<"strong" | "moderate" | "gap">).map(k => (
            <button key={k}
              className={`r-skills-tab ${tab === k ? "on" : ""} ${k === "moderate" ? "indigo" : k === "gap" ? "emerald" : ""}`}
              onClick={() => setTab(k)}>
              {SKILLS[k].label}<span className="count">{SKILLS[k].items.length}</span>
            </button>
          ))}
        </div>
        <div className="r-skills-cloud">
          {cur.items.map(s => (
            <span key={s} className={`r-skill-chip ${tab}`}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   FIT CHECK
   ════════════════════════════════════════════════════════════ */

interface VerdictResult {
  verdict: "strong" | "mid" | "weak";
  verdictLabel: string;
  opening: string;
  gaps: string[];
  transfers: string[];
  recommendation: string;
}

function FitCheck() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<VerdictResult | null>(null);

  const analyze = async () => {
    if (!text.trim()) return;
    setStatus("loading"); setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("jd-analyzer", {
        body: { jobDescription: text },
      });
      if (error) throw error;
      // Map the edge function verdict format to our display format
      const raw = data as { verdict?: string; verdictLabel?: string; opening?: string; gaps?: string[]; transfers?: string[]; recommendation?: string };
      const verdictMap: Record<string, "strong" | "mid" | "weak"> = {
        "strong-fit": "strong", "worth-conversation": "mid", "not-your-person": "weak",
        "strong": "strong", "mid": "mid", "weak": "weak",
      };
      setResult({
        verdict: verdictMap[raw.verdict ?? "mid"] ?? "mid",
        verdictLabel: raw.verdictLabel ?? "Worth a Conversation",
        opening: raw.opening ?? "",
        gaps: raw.gaps ?? [],
        transfers: raw.transfers ?? [],
        recommendation: raw.recommendation ?? "",
      });
      setStatus("done");
    } catch {
      setResult({
        verdict: "mid", verdictLabel: "Worth a Conversation",
        opening: "The Oracle is resting. Here's a human template in the meantime.",
        gaps: ["Real-time analysis needs a live connection.", "Your JD will be assessed against Mikaela's actual strengths and gaps."],
        transfers: ["Paste again when you're online.", "Or email hello@mikaelabertucci.com directly for a personal take."],
        recommendation: "If this were live, I'd tell you honestly whether Mikaela is the right person — including when she isn't. Try the Strong Fit Example for a preview.",
      });
      setStatus("done");
    }
  };

  return (
    <section className="r-section" id="fit">
      <div className="r-wrap-narrow">
        <div className="r-section-head-row">
          <h2 className="r-section-title">Honest fit assessment — <span className="accent">including when I'm not.</span></h2>
          <span className="r-section-n">§ 05 · Fit</span>
        </div>
        <div className="r-fit-wrap">
          <div className="r-fit-card">
            <p className="r-eyebrow" style={{ margin: 0, marginBottom: 20 }}>Paste a Job Description</p>
            <div className="r-fit-examples">
              <button className="r-fit-example" onClick={() => { setText(JD_EXAMPLES.strong); setResult(null); setStatus("idle"); }}>Strong Fit Example</button>
              <button className="r-fit-example" onClick={() => { setText(JD_EXAMPLES.weak); setResult(null); setStatus("idle"); }}>Weak Fit Example</button>
              <button className="r-fit-example" onClick={() => { setText(""); setResult(null); setStatus("idle"); }}>Clear</button>
            </div>
            <textarea className="r-fit-textarea"
              placeholder="Paste the job description here. The Oracle will tell you honestly — even if the honest answer is 'not your person.'"
              value={text}
              onChange={e => setText(e.target.value)}/>
            <div className="r-fit-actions">
              <button className="r-btn r-btn-primary" onClick={analyze} disabled={!text.trim() || status === "loading"}>
                {status === "loading" ? <>Consulting<span className="r-loading-dots"><span/><span/><span/></span></> : <>◊ Consult the Oracle</>}
              </button>
              <span className="r-fit-hint">Powered by Claude. Honest, not flattering.</span>
            </div>
            {result && status === "done" && (
              <div className="r-verdict">
                <span className={`r-verdict-pill ${result.verdict}`}>
                  <span className="r-spec-dot" style={{ background: "currentColor", boxShadow: "0 0 6px currentColor" }}/>
                  {result.verdictLabel}
                </span>
                <p className="r-verdict-opening">"{result.opening}"</p>
                <div className="r-verdict-cols">
                  <div className="r-verdict-col transfers">
                    <h4>What Transfers</h4>
                    <ul>{(result.transfers || []).map((t, i) => <li key={i}>{t}</li>)}</ul>
                  </div>
                  <div className="r-verdict-col gaps">
                    <h4>Where I Don't Fit</h4>
                    <ul>{(result.gaps || []).map((g, i) => <li key={i}>{g}</li>)}</ul>
                  </div>
                </div>
                <div className="r-verdict-rec">{result.recommendation}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   BEYOND
   ════════════════════════════════════════════════════════════ */

function Beyond() {
  return (
    <section className="r-section" id="beyond">
      <div className="r-wrap-narrow">
        <div className="r-section-head-row">
          <h2 className="r-section-title">Beyond the backlog — <span className="accent">when I'm not shipping.</span></h2>
          <span className="r-section-n">§ 06 · Off-Duty</span>
        </div>
        <div className="r-interests">
          {INTERESTS.map(i => (
            <span key={i} className="r-interest-chip"><span className="r-interest-dot"/>{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   ASK DRAWER (Oracle)
   ════════════════════════════════════════════════════════════ */

interface DrawerMessage { role: "user" | "oracle"; text: string; }

function AskDrawer({ open, onClose, seed }: { open: boolean; onClose: () => void; seed: string }) {
  const [messages, setMessages] = useState<DrawerMessage[]>([
    { role: "oracle", text: "I am the Oracle. I've been consulted on Mikaela's work, her method, and her honest calibration. Ask what you'd like to know — and I'll answer plainly, not flatteringly." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && seed && seed !== "__manual__") {
      setInput(seed);
    }
  }, [open, seed]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, busy]);

  const send = useCallback(async (override?: string) => {
    const q = (override || input).trim();
    if (!q || busy) return;
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setInput(""); setBusy(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [{ role: "user", content: q }] }),
        }
      );
      if (!resp.ok || !resp.body) throw new Error("Stream failed");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";
      setMessages(prev => [...prev, { role: "oracle", text: "" }]);
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === "message_stop") { done = true; break; }
            if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta" && parsed.delta.text) {
              assistantContent += parsed.delta.text;
              const final = assistantContent;
              setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, text: final } : m));
            }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "oracle", text: "The connection to the Oracle is resting. Try again in a moment — or reach Mikaela directly at hello@mikaelabertucci.com." }]);
    } finally {
      setBusy(false);
    }
  }, [input, busy]);

  const suggestions = ["How does she use AI in her workflow?", "What's her biggest impact?", "Where doesn't she fit?", "What's she learning right now?"];

  return (
    <>
      <div className={`r-drawer-backdrop ${open ? "on" : ""}`} onClick={onClose}/>
      <aside className={`r-drawer ${open ? "on" : ""}`}>
        <div className="r-drawer-head">
          <div className="r-drawer-head-left">
            <LogoMark size={30}/>
            <div>
              <p className="r-drawer-head-sub">◊ Consultation</p>
              <h3 className="r-drawer-head-title">Ask the Oracle</h3>
            </div>
          </div>
          <button className="r-drawer-close" onClick={onClose}>×</button>
        </div>
        <div className="r-drawer-body" ref={bodyRef}>
          {messages.map((m, i) => (
            m.role === "user" ? (
              <div key={i} className="r-msg r-msg-user">{m.text}</div>
            ) : (
              <div key={i} className="r-msg r-msg-oracle">
                <div className="r-msg-oracle-label">◊ The Oracle</div>
                {m.text}
              </div>
            )
          ))}
          {busy && (
            <div className="r-msg r-msg-oracle">
              <div className="r-msg-oracle-label">◊ Consulting…</div>
              <span className="r-loading-dots" style={{ color: "#38bdf8" }}><span/><span/><span/></span>
            </div>
          )}
        </div>
        {messages.length <= 1 && (
          <div className="r-drawer-suggest">
            {suggestions.map(s => (
              <button key={s} className="r-suggest-chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}
        <div className="r-drawer-input">
          <textarea value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask something plain…"
            rows={1}/>
          <button className="r-drawer-send" onClick={() => send()} disabled={!input.trim() || busy}>→</button>
        </div>
      </aside>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="r-footer">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <LogoMark size={28}/>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#f1f5f9", fontWeight: 600, fontSize: 15 }}>Mikaela Bertucci</div>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2, color: "#94a3b8" }}>Agentic Product Owner · Victoria, BC</div>
        </div>
      </div>
      <div className="r-footer-links">
        <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <span>© {new Date().getFullYear()} Mikaela Bertucci</span>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE ROOT
   ════════════════════════════════════════════════════════════ */

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [seed, setSeed] = useState("__manual__");

  const ask = useCallback((s?: string) => {
    setSeed(s || "__manual__");
    setDrawerOpen(true);
  }, []);

  return (
    <div className="r-page">
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1"/>
        <div className="aurora-orb aurora-orb-2"/>
        <div className="aurora-orb aurora-orb-3"/>
        <div className="aurora-orb aurora-orb-4"/>
      </div>
      <Nav onAsk={() => ask()}/>
      <main>
        <Hero onAsk={() => ask()}/>
        <Ventures/>
        <Method/>
        <Ledger/>
        <QuoteBanner/>
        <Experience onAsk={ask}/>
        <Skills/>
        <FitCheck/>
        <Beyond/>
      </main>
      <Footer/>
      <AskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} seed={seed}/>
    </div>
  );
};

export default Index;
