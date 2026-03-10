import { useState } from "react";
import { Search, Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const strongFitJD = `Senior Product Owner — Digital Government Services

We're looking for a Senior Product Owner to lead our digital transformation initiatives within a provincial government ministry. You'll own the product vision for citizen-facing registry systems and drive AI integration to modernize service delivery.

Requirements:
- 8+ years in product ownership or management
- Deep experience with government/public sector delivery
- Track record of modernizing legacy systems
- Experience with agile methodologies (CSM/CSPO preferred)
- Stakeholder management across multiple departments
- Familiarity with AI tools for productivity and requirements`;

const weakFitJD = `Senior Full-Stack Engineer — Platform Team

We're looking for a Senior Full-Stack Engineer to build and maintain our core platform. You'll write production code daily in TypeScript/React, design APIs, and own the full development lifecycle.

Requirements:
- 5+ years of professional software engineering
- Expert-level TypeScript, React, and Node.js
- Experience building and deploying microservices
- Strong understanding of CI/CD pipelines
- Database design and optimization (PostgreSQL)
- Code review and mentorship of junior developers`;

interface AnalysisResult {
  verdict: "strong-fit" | "worth-conversation" | "not-your-person";
  verdictLabel: string;
  opening: string;
  gaps: string[];
  transfers: string[];
  recommendation: string;
}

const JDAnalyzer = () => {
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("jd-analyzer", {
        body: { jobDescription: jdText },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data as AnalysisResult);
    } catch (e: any) {
      console.error("JD analysis error:", e);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const verdictStyles = {
    "strong-fit": "bg-primary/10 text-primary border-primary/30",
    "worth-conversation": "bg-blue-500/10 text-blue-400 border-blue-500/30",
    "not-your-person": "bg-accent/10 text-accent border-accent/30",
  };

  return (
    <section id="fit-check" className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Honest Fit Assessment</h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl">
            Paste a job description. Get an honest assessment of whether I'm the right person—including when I'm not.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => { setJdText(strongFitJD); setResult(null); }}
            className="px-4 py-2 text-sm font-body rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            Strong Fit Example
          </button>
          <button
            onClick={() => { setJdText(weakFitJD); setResult(null); }}
            className="px-4 py-2 text-sm font-body rounded-lg bg-accent text-accent-foreground border border-accent/30 hover:bg-accent/80 transition-colors"
          >
            Weak Fit Example
          </button>
        </div>

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
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {isAnalyzing ? "Analyzing…" : "Analyze Fit"}
        </button>

        {result && (
          <div className="mt-10 space-y-8 animate-fade-in">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-body font-semibold border ${verdictStyles[result.verdict]}`}>
              {result.verdictLabel}
            </div>

            <p className="text-foreground font-body leading-relaxed">{result.opening}</p>

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

            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-foreground/70 font-body mb-3">My Recommendation</h4>
              <p className="text-sm text-foreground font-body leading-relaxed">{result.recommendation}</p>
            </div>

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
