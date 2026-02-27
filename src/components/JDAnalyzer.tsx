import { useState } from "react";
import { Search, Lightbulb } from "lucide-react";

const strongFitJD = `Staff Software Engineer — Platform Infrastructure

We're a Series C developer tools company looking for a Staff Engineer to lead our platform infrastructure team. You'll design and build distributed systems that power our core product, mentor senior engineers, and drive technical strategy.

Requirements:
- 8+ years of software engineering experience
- Deep expertise in TypeScript, Node.js, and React
- Experience building and operating distributed systems at scale
- Strong system design skills and experience with microservices
- Track record of mentoring and leading engineers
- Experience with PostgreSQL, Redis, and event-driven architectures
- Familiarity with CI/CD, observability, and DevOps practices`;

const weakFitJD = `Senior iOS Engineer — Mobile Platform

We're looking for a Senior iOS Engineer to own our mobile platform. You'll architect Swift/SwiftUI applications, contribute to our design system, and work closely with our ML team to ship on-device intelligence features.

Requirements:
- 5+ years of native iOS development with Swift
- Deep knowledge of SwiftUI, UIKit, and Core Data
- Experience with on-device ML (Core ML, Create ML)
- Published apps on the App Store
- Experience with Xcode performance profiling
- Understanding of Apple Human Interface Guidelines`;

interface AnalysisResult {
  verdict: "strong-fit" | "worth-conversation" | "not-your-person";
  verdictLabel: string;
  opening: string;
  gaps: string[];
  transfers: string[];
  recommendation: string;
}

const mockAnalyze = (jd: string): AnalysisResult => {
  const isStrong = jd.toLowerCase().includes("typescript") || jd.toLowerCase().includes("distributed systems");

  if (isStrong) {
    return {
      verdict: "strong-fit",
      verdictLabel: "Strong Fit",
      opening: "This is squarely in my wheelhouse. I've spent the last 5+ years building exactly these kinds of systems — distributed infrastructure, platform teams, TypeScript at scale. I'd be excited about this role.",
      gaps: [
        "I haven't led a platform team larger than 8 people — if this role manages 15+, there's a ramp-up period.",
        "My experience with your specific stack may differ in details (e.g., I've used Kafka more than RabbitMQ).",
      ],
      transfers: [
        "Led monolith-to-microservices migration processing 2M+ events/day",
        "Promoted 3 engineers through hands-on mentorship in the last 18 months",
        "Built and operated systems at 99.97% uptime handling $50M+ ARR",
      ],
      recommendation: "I'd recommend a conversation. My experience maps directly to what you're building, and I can bring hard-won lessons from doing this exact work at two previous companies.",
    };
  }

  return {
    verdict: "not-your-person",
    verdictLabel: "Probably Not Your Person",
    opening: "I want to be honest — native iOS isn't my strength. I've built mobile experiences with React Native, but I haven't shipped production Swift code or worked extensively with Core ML. You deserve someone who lives and breathes this platform.",
    gaps: [
      "No production Swift/SwiftUI experience",
      "Haven't published apps on the App Store",
      "No experience with Core ML or on-device ML pipelines",
      "Limited knowledge of Apple's HIG at the depth you'd need",
    ],
    transfers: [
      "Strong engineering fundamentals and system design thinking would transfer",
      "Experience with cross-platform mobile (React Native) provides some context",
      "Track record of learning new stacks quickly — but this role needs day-one expertise",
    ],
    recommendation: "I'd pass on this one, and I'd encourage you to find someone with deep iOS roots. My time would be better spent where my existing expertise creates immediate value. No hard feelings — this is how honest matching should work.",
  };
};

const JDAnalyzer = () => {
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(mockAnalyze(jdText));
      setIsAnalyzing(false);
    }, 1500);
  };

  const verdictStyles = {
    "strong-fit": "bg-primary/10 text-primary border-primary/30",
    "worth-conversation": "bg-blue-500/10 text-blue-400 border-blue-500/30",
    "not-your-person": "bg-accent/10 text-accent border-accent/30",
  };

  return (
    <section id="fit-check" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Honest Fit Assessment</h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl">
            Paste a job description. Get an honest assessment of whether I'm the right person—including when I'm not.
          </p>
        </div>

        {/* Toggle examples */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => { setJdText(strongFitJD); setResult(null); }}
            className="px-4 py-2 text-sm font-body rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            Strong Fit Example
          </button>
          <button
            onClick={() => { setJdText(weakFitJD); setResult(null); }}
            className="px-4 py-2 text-sm font-body rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
          >
            Weak Fit Example
          </button>
        </div>

        {/* Textarea */}
        <div className="glass-card p-1 mb-6">
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full h-48 bg-transparent p-5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!jdText.trim() || isAnalyzing}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg glow-primary hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Search className="w-4 h-4" />
          {isAnalyzing ? "Analyzing…" : "Analyze Fit"}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-8 animate-fade-in">
            {/* Verdict */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-body font-semibold border ${verdictStyles[result.verdict]}`}>
              {result.verdictLabel}
            </div>

            <p className="text-foreground font-body leading-relaxed">{result.opening}</p>

            {/* Gaps */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-accent font-body mb-3">Where I Don't Fit</h4>
              <ul className="space-y-2">
                {result.gaps.map((g, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-body flex items-start gap-2">
                    <span className="text-accent mt-0.5 shrink-0">✗</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Transfers */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-primary font-body mb-3">What Transfers</h4>
              <ul className="space-y-2">
                {result.transfers.map((t, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-body flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0">▸</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendation */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-foreground/70 font-body mb-3">My Recommendation</h4>
              <p className="text-sm text-foreground font-body leading-relaxed">{result.recommendation}</p>
            </div>

            {/* Philosophy callout */}
            <div className="glass-card p-6 border-l-2 border-primary/50">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground font-body italic leading-relaxed">
                  This signals something completely different than "please consider my resume." You're qualifying them.
                  Your time is valuable too.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JDAnalyzer;
