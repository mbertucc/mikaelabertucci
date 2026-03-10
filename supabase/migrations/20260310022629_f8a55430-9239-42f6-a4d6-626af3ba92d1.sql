
-- Experience 5: PIMS (sort_order 5)
UPDATE experiences SET 
  ai_situation = 'No centralized property inventory existed across BC government. Data scattered across 180+ municipalities. No integration layer. The mandate: build the single source of truth.',
  ai_approach = 'Built stakeholder understanding of user-centered design from the ground up. Translated its value into terms that resonated with non-technical audiences. Ran bi-weekly user research sessions with a UX/UI designer and team of 7 developers.',
  ai_technical_work = 'GIS Property Inventory system integrating data from 180+ municipalities with BC Assessment, BC Data Warehouse, and Land Title Survey Authority APIs. Open-source, Apache 2.0 licensed.',
  ai_lessons_learned = 'This system earned the quote: "In 20 years of doing this job, this is the first time I have seen the private contractor and the clients happy." Sprint With Us + genuine user-centered design creates alignment that traditional procurement cannot.',
  achievements = ARRAY[
    'Initiated and delivered PIMS — an enterprise open-source GIS-integrated real estate inventory system. **8 Ministries** and **5 Broader Public Sector clients** use it daily.',
    'MVP shipped on time, on budget, in scope. **1 year**. **2-week Scrum sprints**.',
    'Cut Ministry response times by **50%** through system design that prioritized user workflows over bureaucratic process.',
    'Secured **$1 million** in funding and Exchange Lab residency through Sprint With Us procurement.',
    'Integrated with BC Assessment, BC Data Warehouse, and LTSA APIs — connecting **180+ municipalities** into a single platform.'
  ]
WHERE id = '64a6c882-9026-4cf9-b638-f5b5b3f0d063';

-- Experience 6: FOI Analyst (sort_order 7)
UPDATE experiences SET 
  ai_situation = 'High-volume, compliance-heavy FOI processing. Massive backlogs. Manual workflows everywhere. The environment demanded efficiency — or burnout.',
  ai_approach = 'Applied lean thinking to a traditional government process. Found automation opportunities others had missed because they stopped questioning inherited assumptions.',
  ai_technical_work = 'Redesigned document management workflows using lean principles. Dramatically reduced processing times.',
  ai_lessons_learned = 'Every bureaucratic process contains optimization opportunities hidden behind "how things have always been done." Questioning inherited assumptions became central to my product practice.',
  achievements = ARRAY[
    'Processed high-volume FOI requests under strict compliance timelines — built the analytical rigor that later informed my product thinking.',
    'Found and implemented process optimizations in a system where inherited workflows had gone unquestioned for years.',
    'Developed pattern recognition for legislative language and regulatory requirements — a skill that became foundational to my AI context engineering practice.'
  ]
WHERE id = '0e35c5c9-0b29-42d1-b05a-02bb7a4c9d81';

-- Experience 7: First Nations Analyst (sort_order 8)
UPDATE experiences SET 
  ai_situation = 'Crown Land transactions requiring First Nations consultation. Process compliance without genuine relationship-building guarantees failure in this domain.',
  ai_approach = 'Combined First Nations consultation work with business analysis. Laid the groundwork for PIMS.',
  ai_technical_work = 'Built naming conventions, data dictionaries, and technical specs. Translated messy business processes into clear requirements.',
  ai_lessons_learned = 'First Nations consultation taught me more about genuine stakeholder engagement than any Agile certification. Relationship-first, always.',
  achievements = ARRAY[
    'Conducted Crown Land transaction analysis requiring First Nations consultation — a process demanding cultural sensitivity and relationship-first engagement.',
    'Built stakeholder relationships with Indigenous communities that prioritized trust over timeline.'
  ]
WHERE id = '5e28076d-af58-4549-98a5-fce93112ee56';

-- Experience 8: Coaching (sort_order 9)
UPDATE experiences SET 
  ai_situation = 'Organizations going through major change needed leaders who could coach through uncertainty. Most leadership programs were theoretical. The gap: practical tools for leaders in active transformation.',
  ai_approach = 'Used ICF coaching principles and change management to support leaders through major organizational shifts. No theory — real tools for real problems.',
  ai_technical_work = 'Built curriculum for ICF coach training. Created practical tools for leadership communication, conflict resolution, and goal setting.',
  ai_lessons_learned = 'ICF coaching fundamentals — active listening, powerful questions, holding space — are the exact skills that make a great Product Owner. The transition to Agile was natural. The core competency is identical: helping people achieve outcomes they can''t see yet.',
  achievements = ARRAY[
    'Designed and delivered leadership development programs — executive coaching, conflict resolution, and change management.',
    'Coached leaders and teams through organizational transitions. Built the interpersonal foundation that later defined my Agile practice.',
    'Built and facilitated corporate training programs for government and private sector clients.',
    'Trained and mentored aspiring coaches through ICF certification programs.'
  ]
WHERE id = '13d490f8-23d3-4091-9f0a-9774ccbfb350';

-- Experience 9: Hair Stylist (sort_order 10)
UPDATE experiences SET 
  ai_situation = 'Ran my own business in a client-facing industry. Success depended entirely on reading people and building trust. Those skills transferred directly to product leadership.',
  ai_approach = 'Treated every client interaction like user research. Listened. Adapted. Improved the service based on real feedback.',
  ai_technical_work = 'Full business operations — scheduling, client management, inventory, and mentoring junior stylists.',
  ai_lessons_learned = 'Running your own business teaches you that product-market fit is personal. You either solve a real problem for real people or you close. That bias toward tangible outcomes followed me into every product role.',
  achievements = ARRAY[
    'Operated an independent business — client relationships, financials, service delivery. Built the entrepreneurial instincts that inform my product ownership.',
    'Developed rapid client-reading skills in a high-volume, face-to-face environment. Every interaction was a real-time feedback loop.',
    'Mentored junior stylists through structured skill development — an early model for the coaching approach I brought to Agile teams.'
  ]
WHERE id = 'ba6ec219-4630-45b3-8aa9-c83a77368d2d';

-- Experience 10: Mortgage (sort_order 11)
UPDATE experiences SET 
  ai_situation = 'Mortgage finance from 2003–2012. Including the 2008 financial crisis. The challenge: maintain client trust when the market is actively working against you.',
  ai_approach = 'Built deep client relationships by providing honest, transparent advice — even when it meant recommending against a transaction.',
  ai_technical_work = 'Portfolio management across multiple financial institutions. Market analysis and risk assessment for residential mortgage products.',
  ai_lessons_learned = 'The 2008 crisis proved that credibility compounds. Clients who trusted my analysis during the downturn became my strongest advocates after recovery. I apply that lesson to every stakeholder relationship.',
  achievements = ARRAY[
    'Managed regional mortgage portfolios through the **2008 financial crisis** — navigated market volatility while maintaining client retention.',
    'Scaled client acquisition across multiple brokerage brands. Portfolio management skills that later applied to digital product portfolios.',
    'Provided transparent risk assessments even when they contradicted sales incentives. Built long-term client loyalty through the worst market in decades.'
  ]
WHERE id = 'c8b5b2b7-95cc-4987-bc38-62a1068238b6';

-- Experience 11: Real Estate PM (sort_order 12)
UPDATE experiences SET 
  ai_situation = 'Government property acquisitions. Fiscal constraints, community interests, and First Nations treaty obligations intersecting on every transaction. Miss any stakeholder and the project fails.',
  ai_approach = 'Applied project management discipline to property acquisitions while staying mindful of Treaty Negotiation implications.',
  ai_technical_work = 'Contract management, property valuation, cost-containment analysis. Supported land valuations for Treaty Negotiations.',
  ai_lessons_learned = 'Government real estate carries stakeholders that private sector deals don''t — communities, First Nations, public accountability. Managing those relationships is the real project management.',
  achievements = ARRAY[
    'Managed government real estate acquisitions balancing fiscal responsibility with community and Indigenous interests.',
    'Coordinated multi-stakeholder transactions involving communities, First Nations, and public accountability requirements.'
  ]
WHERE id = '1899a7fc-8ba4-4c53-8e3a-e4899d40159a';

-- Experience 12: Proptech (sort_order 13)
UPDATE experiences SET 
  ai_situation = 'Early-stage proptech and fintech. Building web applications for real estate and mortgage industries when the tools were primitive and the market was undefined.',
  ai_approach = 'Bridged finance domain expertise and software development. Brought user research practices to teams that had never done them.',
  ai_technical_work = 'Database design (SQL), front-end development (HTML, C++), wireframing, business process mapping. Built Realtylink.org and Canadamortgage.com.',
  ai_lessons_learned = 'My technical roots are in database design and early web development. Understanding how software is actually built makes me a fundamentally better Product Owner — I speak the team''s language.',
  achievements = ARRAY[
    'Built web applications for real estate and mortgage industries before modern frameworks existed — early-stage proptech and fintech.',
    'Developed database design and technical architecture skills. This is the foundation for understanding how software is actually built.',
    'Built **Realtylink.org** and **Canadamortgage.com**.'
  ]
WHERE id = 'afeea2c0-7ed9-4c0a-8fe4-35e1840c7e1f';
