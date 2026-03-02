import { FileText, Bot, Clock, RefreshCw } from "lucide-react";
import StatRing from "@/components/StatRing";

const ImpactDashboardSection = () => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body mb-6 text-left">
            AI-Augmented Impact Dashboard
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatRing value={20} max={40} label="Hours Saved Weekly" unit="h" size={90} icon={Clock} hideRing />
            <StatRing value={90} max={100} label="Fewer Clarification Loops" unit="%" size={90} icon={RefreshCw} hideRing />
            <StatRing value={2000} max={2500} label="Pages Analyzed" unit="+" size={90} icon={FileText} hideRing />
            <StatRing value={16} max={20} label="AI Agents Built" unit="" size={90} icon={Bot} hideRing />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactDashboardSection;
