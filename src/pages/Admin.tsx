import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Save, Plus, Trash2, Users, BarChart3 } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "experiences" | "skills" | "faq" | "ai">("profile");
  const [isAdmin, setIsAdmin] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<any>(null);
  // Experiences state
  const [experiences, setExperiences] = useState<any[]>([]);
  // Skills state
  const [skills, setSkills] = useState<any[]>([]);
  // FAQ state
  const [faq, setFaq] = useState<any[]>([]);
  // AI Instructions state
  const [aiInstructions, setAiInstructions] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      await loadAll();
      // Check admin role
      const { data: adminCheck } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      setIsAdmin(!!adminCheck);
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadAll = async () => {
    const [p, e, s, f, a] = await Promise.all([
      supabase.from("profile").select("*").limit(1).single(),
      supabase.from("experiences").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("faq").select("*").order("sort_order"),
      supabase.from("ai_instructions").select("*"),
    ]);
    if (p.data) setProfile(p.data);
    if (e.data) setExperiences(e.data);
    if (s.data) setSkills(s.data);
    if (f.data) setFaq(f.data);
    if (a.data) setAiInstructions(a.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const saveProfile = async () => {
    if (!profile) return;
    const { error } = await supabase.from("profile").update(profile).eq("id", profile.id);
    error ? toast.error("Failed to save profile") : toast.success("Profile saved!");
  };

  const saveExperience = async (exp: any) => {
    const { error } = await supabase.from("experiences").update(exp).eq("id", exp.id);
    error ? toast.error("Failed to save") : toast.success("Experience saved!");
  };

  const deleteExperience = async (id: string) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (!error) {
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      toast.success("Deleted!");
    }
  };

  const addExperience = async () => {
    const { data, error } = await supabase.from("experiences").insert({
      company: "New Company",
      date_range: "202X – Present",
      title_progression: "Role Title",
      achievements: [],
      sort_order: experiences.length,
    }).select().single();
    if (data) setExperiences((prev) => [...prev, data]);
    if (error) toast.error("Failed to add");
  };

  const saveSkill = async (skill: any) => {
    const { error } = await supabase.from("skills").update(skill).eq("id", skill.id);
    error ? toast.error("Failed") : toast.success("Saved!");
  };

  const deleteSkill = async (id: string) => {
    await supabase.from("skills").delete().eq("id", id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const addSkill = async () => {
    const { data } = await supabase.from("skills").insert({ name: "New Skill", category: "moderate", sort_order: skills.length }).select().single();
    if (data) setSkills((prev) => [...prev, data]);
  };

  const saveFaq = async (item: any) => {
    const { error } = await supabase.from("faq").update(item).eq("id", item.id);
    error ? toast.error("Failed") : toast.success("Saved!");
  };

  const deleteFaq = async (id: string) => {
    await supabase.from("faq").delete().eq("id", id);
    setFaq((prev) => prev.filter((f) => f.id !== id));
  };

  const addFaq = async () => {
    const { data } = await supabase.from("faq").insert({ question: "New Question?", answer: "Answer here.", sort_order: faq.length }).select().single();
    if (data) setFaq((prev) => [...prev, data]);
  };

  const saveAiInstruction = async (item: any) => {
    const { error } = await supabase.from("ai_instructions").update(item).eq("id", item.id);
    error ? toast.error("Failed") : toast.success("Saved!");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "experiences", label: "Experience" },
    { key: "skills", label: "Skills" },
    { key: "faq", label: "FAQ" },
    { key: "ai", label: "AI Instructions" },
  ] as const;

  const inputCls = "w-full px-3 py-2 bg-secondary rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50";
  const textareaCls = `${inputCls} min-h-[80px] resize-y`;
  const btnSave = "flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-body font-medium rounded-md hover:brightness-110 transition-all";
  const btnDanger = "flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive text-xs font-body rounded-md hover:bg-destructive/20 transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl text-primary">Admin Panel</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <>
              <button onClick={() => navigate("/admin/analytics")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
                <BarChart3 className="w-4 h-4" /> Analytics
              </button>
              <button onClick={() => navigate("/admin/users")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
                <Users className="w-4 h-4" /> Users
              </button>
            </>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 text-sm font-body rounded-lg transition-colors ${activeTab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && profile && (
          <div className="space-y-4">
            <label className="block"><span className="text-xs text-muted-foreground font-body">Full Name</span>
              <input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className={inputCls} />
            </label>
            <label className="block"><span className="text-xs text-muted-foreground font-body">Title</span>
              <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className={inputCls} />
            </label>
            <label className="block"><span className="text-xs text-muted-foreground font-body">Status Badge</span>
              <input value={profile.status_badge} onChange={(e) => setProfile({ ...profile, status_badge: e.target.value })} className={inputCls} />
            </label>
            <label className="block"><span className="text-xs text-muted-foreground font-body">Positioning Statement</span>
              <textarea value={profile.positioning} onChange={(e) => setProfile({ ...profile, positioning: e.target.value })} className={textareaCls} />
            </label>
            <label className="block"><span className="text-xs text-muted-foreground font-body">Company Badges (comma-separated)</span>
              <input value={(profile.company_badges || []).join(", ")} onChange={(e) => setProfile({ ...profile, company_badges: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} className={inputCls} />
            </label>
            <label className="block"><span className="text-xs text-muted-foreground font-body">LinkedIn URL</span>
              <input value={profile.linkedin_url || ""} onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })} className={inputCls} />
            </label>
            <label className="block"><span className="text-xs text-muted-foreground font-body">GitHub URL</span>
              <input value={profile.github_url || ""} onChange={(e) => setProfile({ ...profile, github_url: e.target.value })} className={inputCls} />
            </label>
            <label className="block"><span className="text-xs text-muted-foreground font-body">Email</span>
              <input value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputCls} />
            </label>
            <button onClick={saveProfile} className={btnSave}><Save className="w-3 h-3" /> Save Profile</button>
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === "experiences" && (
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="glass-card p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground font-body">#{idx + 1}</span>
                  <button onClick={() => deleteExperience(exp.id)} className={btnDanger}><Trash2 className="w-3 h-3" /> Delete</button>
                </div>
                <input value={exp.company} onChange={(e) => { const u = [...experiences]; u[idx] = { ...exp, company: e.target.value }; setExperiences(u); }} placeholder="Company" className={inputCls} />
                <input value={exp.date_range} onChange={(e) => { const u = [...experiences]; u[idx] = { ...exp, date_range: e.target.value }; setExperiences(u); }} placeholder="Date Range" className={inputCls} />
                <input value={exp.title_progression} onChange={(e) => { const u = [...experiences]; u[idx] = { ...exp, title_progression: e.target.value }; setExperiences(u); }} placeholder="Title Progression" className={inputCls} />
                <label className="block"><span className="text-xs text-muted-foreground font-body">Achievements (one per line)</span>
                  <textarea value={(exp.achievements || []).join("\n")} onChange={(e) => { const u = [...experiences]; u[idx] = { ...exp, achievements: e.target.value.split("\n").filter(Boolean) }; setExperiences(u); }} className={textareaCls} />
                </label>
                <label className="block"><span className="text-xs text-muted-foreground font-body">AI Situation</span>
                  <textarea value={exp.ai_situation || ""} onChange={(e) => { const u = [...experiences]; u[idx] = { ...exp, ai_situation: e.target.value }; setExperiences(u); }} className={textareaCls} />
                </label>
                <label className="block"><span className="text-xs text-muted-foreground font-body">AI Approach</span>
                  <textarea value={exp.ai_approach || ""} onChange={(e) => { const u = [...experiences]; u[idx] = { ...exp, ai_approach: e.target.value }; setExperiences(u); }} className={textareaCls} />
                </label>
                <label className="block"><span className="text-xs text-muted-foreground font-body">AI Technical Work</span>
                  <textarea value={exp.ai_technical_work || ""} onChange={(e) => { const u = [...experiences]; u[idx] = { ...exp, ai_technical_work: e.target.value }; setExperiences(u); }} className={textareaCls} />
                </label>
                <label className="block"><span className="text-xs text-muted-foreground font-body">AI Lessons Learned</span>
                  <textarea value={exp.ai_lessons_learned || ""} onChange={(e) => { const u = [...experiences]; u[idx] = { ...exp, ai_lessons_learned: e.target.value }; setExperiences(u); }} className={textareaCls} />
                </label>
                <button onClick={() => saveExperience(experiences[idx])} className={btnSave}><Save className="w-3 h-3" /> Save</button>
              </div>
            ))}
            <button onClick={addExperience} className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-lg hover:bg-secondary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="space-y-3">
            {skills.map((skill, idx) => (
              <div key={skill.id} className="flex gap-3 items-center">
                <input value={skill.name} onChange={(e) => { const u = [...skills]; u[idx] = { ...skill, name: e.target.value }; setSkills(u); }} className={`${inputCls} flex-1`} />
                <select value={skill.category} onChange={(e) => { const u = [...skills]; u[idx] = { ...skill, category: e.target.value }; setSkills(u); }} className="px-3 py-2 bg-secondary rounded-lg text-sm font-body text-foreground focus:outline-none">
                  <option value="strong">Strong</option>
                  <option value="moderate">Moderate</option>
                  <option value="gap">Gap</option>
                </select>
                <button onClick={() => saveSkill(skills[idx])} className={btnSave}><Save className="w-3 h-3" /></button>
                <button onClick={() => deleteSkill(skill.id)} className={btnDanger}><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={addSkill} className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-lg hover:bg-secondary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Skill
            </button>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            {faq.map((item, idx) => (
              <div key={item.id} className="glass-card p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground font-body">Q{idx + 1}</span>
                  <button onClick={() => deleteFaq(item.id)} className={btnDanger}><Trash2 className="w-3 h-3" /> Delete</button>
                </div>
                <input value={item.question} onChange={(e) => { const u = [...faq]; u[idx] = { ...item, question: e.target.value }; setFaq(u); }} placeholder="Question" className={inputCls} />
                <textarea value={item.answer} onChange={(e) => { const u = [...faq]; u[idx] = { ...item, answer: e.target.value }; setFaq(u); }} placeholder="Answer" className={textareaCls} />
                <button onClick={() => saveFaq(faq[idx])} className={btnSave}><Save className="w-3 h-3" /> Save</button>
              </div>
            ))}
            <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-lg hover:bg-secondary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
        )}

        {/* AI Instructions Tab */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            {aiInstructions.map((item, idx) => (
              <div key={item.id} className="glass-card p-6 space-y-3">
                <span className="text-xs text-primary font-body font-medium uppercase tracking-wider">{item.key}</span>
                <textarea value={item.value} onChange={(e) => { const u = [...aiInstructions]; u[idx] = { ...item, value: e.target.value }; setAiInstructions(u); }} className={`${textareaCls} min-h-[200px]`} />
                <button onClick={() => saveAiInstruction(aiInstructions[idx])} className={btnSave}><Save className="w-3 h-3" /> Save</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
