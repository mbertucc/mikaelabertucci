import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, Eye, Clock, FileText, RefreshCw, Bug } from "lucide-react";
import { getDebugInfo } from "@/hooks/useAnalyticsTracker";

type TimeRange = "day" | "week" | "month";

interface AnalyticsData {
  uniqueVisitors: number;
  totalPageViews: number;
  totalSessions: number;
  returningVisitors: number;
  avgSessionDuration: number;
  topPages: { path: string; count: number }[];
  dailyVisitors: { date: string; visitors: number; pageViews: number }[];
}

const SiteAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [range, setRange] = useState<TimeRange>("week");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin/login"); return; }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleData) { navigate("/"); return; }
      setIsAdmin(true);
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin, range]);

  const getRangeDate = (): string => {
    const now = new Date();
    if (range === "day") now.setDate(now.getDate() - 1);
    else if (range === "week") now.setDate(now.getDate() - 7);
    else now.setMonth(now.getMonth() - 1);
    return now.toISOString();
  };

  const fetchData = async () => {
    setLoading(true);
    const since = getRangeDate();

    try {
      // Unique visitors in range
      const { data: visitors } = await supabase
        .from("analytics_visitors")
        .select("visitor_hash, first_seen, last_seen, visit_count")
        .gte("last_seen", since);

      // Sessions in range (exclude bots)
      const { data: sessions } = await supabase
        .from("analytics_sessions")
        .select("session_id, visitor_hash, started_at, last_activity, page_views_count, is_bot")
        .gte("started_at", since)
        .eq("is_bot", false);

      // Page views in range
      const { data: pageViews } = await supabase
        .from("analytics_page_views")
        .select("page_path, visitor_hash, session_id, created_at")
        .gte("created_at", since);

      const uniqueVisitors = new Set(pageViews?.map((p) => p.visitor_hash)).size;
      const totalPageViews = pageViews?.length ?? 0;
      const totalSessions = sessions?.length ?? 0;
      const returningVisitors = visitors?.filter((v) => v.visit_count > 1).length ?? 0;

      // Avg session duration
      const durations = (sessions ?? []).map((s) => {
        const start = new Date(s.started_at).getTime();
        const end = new Date(s.last_activity).getTime();
        return (end - start) / 1000; // seconds
      });
      const avgSessionDuration = durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;

      // Top pages
      const pageCounts: Record<string, number> = {};
      (pageViews ?? []).forEach((p) => {
        pageCounts[p.page_path] = (pageCounts[p.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Daily breakdown
      const dailyMap: Record<string, { visitors: Set<string>; pageViews: number }> = {};
      (pageViews ?? []).forEach((p) => {
        const day = p.created_at.split("T")[0];
        if (!dailyMap[day]) dailyMap[day] = { visitors: new Set(), pageViews: 0 };
        dailyMap[day].visitors.add(p.visitor_hash);
        dailyMap[day].pageViews++;
      });
      const dailyVisitors = Object.entries(dailyMap)
        .map(([date, d]) => ({ date, visitors: d.visitors.size, pageViews: d.pageViews }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setData({
        uniqueVisitors,
        totalPageViews,
        totalSessions,
        returningVisitors,
        avgSessionDuration,
        topPages,
        dailyVisitors,
      });
    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
    setLoading(false);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin")} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-display font-bold">Site Analytics</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowDebug(!showDebug); setDebugInfo(getDebugInfo()); }}
              className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
              title="Debug view"
            >
              <Bug className="w-4 h-4" />
            </button>
            <button onClick={fetchData} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebug && debugInfo && (
          <div className="mb-6 p-4 rounded-xl bg-card border border-border font-mono text-xs space-y-1">
            <p className="text-muted-foreground font-body text-sm font-medium mb-2">Debug — Your Tracking IDs</p>
            <p><span className="text-muted-foreground">Visitor ID:</span> <span className="text-foreground">{debugInfo.visitorId}</span></p>
            <p><span className="text-muted-foreground">Session ID:</span> <span className="text-foreground">{debugInfo.sessionId}</span></p>
            <p><span className="text-muted-foreground">Last Activity:</span> <span className="text-foreground">{debugInfo.lastActivity}</span></p>
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8">
          {(["day", "week", "month"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 text-sm font-body rounded-lg transition-colors ${
                range === r ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-card/80"
              }`}
            >
              {r === "day" ? "24h" : r === "week" ? "7 days" : "30 days"}
            </button>
          ))}
        </div>

        {data && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<Users className="w-5 h-5" />} label="Unique Visitors" value={data.uniqueVisitors} />
              <StatCard icon={<Eye className="w-5 h-5" />} label="Page Views" value={data.totalPageViews} />
              <StatCard icon={<Clock className="w-5 h-5" />} label="Avg. Duration" value={formatDuration(data.avgSessionDuration)} />
              <StatCard icon={<Users className="w-5 h-5" />} label="Returning Visitors" value={data.returningVisitors} />
            </div>

            {/* Sessions summary */}
            <div className="mb-8 p-1 rounded-xl bg-card border border-border">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-display font-semibold text-foreground">Total Sessions</h2>
              </div>
              <div className="px-4 py-3">
                <p className="text-3xl font-display font-bold text-foreground">{data.totalSessions}</p>
                <p className="text-xs text-muted-foreground mt-1">Sessions expire after 30 min of inactivity</p>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="mb-8 rounded-xl bg-card border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-display font-semibold text-foreground">Daily Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2 text-muted-foreground font-body font-medium">Date</th>
                      <th className="text-right px-4 py-2 text-muted-foreground font-body font-medium">Unique Visitors</th>
                      <th className="text-right px-4 py-2 text-muted-foreground font-body font-medium">Page Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dailyVisitors.map((d) => (
                      <tr key={d.date} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-2 font-mono text-foreground">{d.date}</td>
                        <td className="text-right px-4 py-2 text-foreground">{d.visitors}</td>
                        <td className="text-right px-4 py-2 text-foreground">{d.pageViews}</td>
                      </tr>
                    ))}
                    {data.dailyVisitors.length === 0 && (
                      <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No data for this period</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Pages */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Top Pages
                </h2>
              </div>
              <div className="divide-y divide-border/50">
                {data.topPages.map((p) => (
                  <div key={p.path} className="flex items-center justify-between px-4 py-3">
                    <span className="font-mono text-sm text-foreground">{p.path}</span>
                    <span className="text-sm text-muted-foreground">{p.count} views</span>
                  </div>
                ))}
                {data.topPages.length === 0 && (
                  <div className="px-4 py-6 text-center text-muted-foreground text-sm">No data</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="p-4 rounded-xl bg-card border border-border">
    <div className="flex items-center gap-2 text-muted-foreground mb-2">{icon}<span className="text-xs font-body">{label}</span></div>
    <p className="text-2xl font-display font-bold text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</p>
  </div>
);

export default SiteAnalytics;
