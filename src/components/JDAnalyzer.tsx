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
    "strong-fit": "bg-[hsl(var(--nav-text)/0.9)] text-[hsl(var(--teal))] border-[hsl(var(--nav-text)/0.3)]",
    "worth-conversation": "bg-[hsl(var(--nav-text)/0.6)] text-[hsl(var(--mustard-lt))] border-[hsl(var(--nav-text)/0.2)]",
    "not-your-person": "bg-[hsl(var(--nav-text)/0.9)] text-[hsl(var(--mustard))] border-[hsl(var(--nav-text)/0.3)]",
  };

  return (
    <div id="fit-check" className="py-20 px-8 md:px-16 relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <p className="font-body text-[10px] font-bold tracking-[4px] uppercase text-[hsl(var(--mustard-lt))] dark:text-[hsl(var(--mustard))] mb-3">
            Honest Assessment
          </p>
          <h3 className="font-display text-[32px] md:text-[40px] font-normal italic text-[hsl(var(--nav-text))] mb-4 tracking-[-0.5px]">Honest Fit Assessment</h3>
          <p className="text-[hsl(var(--nav-text)/0.6)] dark:text-[hsl(var(--nav-text)/0.45)] font-body text-[14px] font-light leading-[1.85] max-w-2xl">
            Paste a job description. Get an honest assessment of whether I'm the right person—including when I'm not.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => { setJdText(strongFitJD); setResult(null); }}
            className="px-5 py-2.5 text-[13px] font-body bg-[hsl(var(--nav-text)/0.15)] text-[hsl(var(--nav-text))] border border-[hsl(var(--nav-text)/0.2)] hover:bg-[hsl(var(--nav-text)/0.25)] transition-colors"
          >
            Strong Fit Example
          </button>
          <button
            onClick={() => { setJdText(weakFitJD); setResult(null); }}
            className="px-5 py-2.5 text-[13px] font-body bg-[hsl(var(--nav-text)/0.15)] text-[hsl(var(--nav-text))] border border-[hsl(var(--nav-text)/0.2)] hover:bg-[hsl(var(--nav-text)/0.25)] transition-colors"
          >
            Weak Fit Example
          </button>
        </div>

        <div className="border border-[hsl(var(--nav-text)/0.15)] mb-8 bg-[hsl(var(--nav-text)/0.05)]">
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full h-52 bg-transparent p-6 text-[14px] font-body text-[hsl(var(--nav-text))] placeholder:text-[hsl(var(--nav-text)/0.3)] resize-none focus:outline-none leading-relaxed"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!jdText.trim() || isAnalyzing}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-[hsl(var(--nav-text))] text-[hsl(var(--teal-dk))] font-body font-bold text-[11px] tracking-[2px] uppercase hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {isAnalyzing ? "Analyzing…" : "Analyze Fit"}
        </button>

        {result && (
          <div className="mt-12 space-y-10 animate-fade-in">
            <div className={`inline-flex items-center px-5 py-2.5 text-[14px] font-body font-semibold border ${verdictStyles[result.verdict]}`}>
              {result.verdictLabel}
            </div>

            <p className="text-[hsl(var(--nav-text))] font-body text-[15px] leading-relaxed">{result.opening}</p>

            <div>
              <h4 className="font-body text-[10px] font-bold tracking-[3px] uppercase text-[hsl(var(--mustard-lt))] mb-4">Where I Don't Fit</h4>
              <ul className="space-y-2.5">
                {result.gaps.map((g, i) => (
                  <li key={i} className="text-[14px] text-[hsl(var(--nav-text)/0.7)] font-body flex items-start gap-2.5 leading-relaxed">
                    <span className="text-[hsl(var(--mustard-lt))] mt-0.5 shrink-0">✗</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body text-[10px] font-bold tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.8)] mb-4">What Transfers</h4>
              <ul className="space-y-2.5">
                {result.transfers.map((t, i) => (
                  <li key={i} className="text-[14px] text-[hsl(var(--nav-text)/0.7)] font-body flex items-start gap-2.5 leading-relaxed">
                    <span className="text-[hsl(var(--nav-text))] mt-0.5 shrink-0">▸</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body text-[10px] font-bold tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.6)] mb-4">My Recommendation</h4>
              <p className="text-[14px] text-[hsl(var(--nav-text))] font-body leading-relaxed">{result.recommendation}</p>
            </div>

            <div className="border border-[hsl(var(--nav-text)/0.15)] p-8 border-l-[3px] border-l-[hsl(var(--mustard)/0.6)] bg-[hsl(var(--nav-text)/0.05)]">
              <div className="flex items-start gap-3.5">
                <Lightbulb className="w-5 h-5 text-[hsl(var(--mustard-lt))] shrink-0 mt-0.5" />
                <p className="text-[14px] text-[hsl(var(--nav-text)/0.7)] font-body italic leading-relaxed">
                  This signals something completely different than "please consider my resume." You're qualifying them.
                  Your time is valuable too.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JDAnalyzer;
