import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_ID_KEY = "mb_visitor_id";
const SESSION_ID_KEY = "mb_session_id";
const SESSION_LAST_ACTIVITY_KEY = "mb_session_last_activity";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /googlebot/i, /bingbot/i, /yandex/i, /baidu/i, /duckduck/i,
  /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
  /whatsapp/i, /telegrambot/i, /discordbot/i,
  /pingdom/i, /uptimerobot/i, /monitor/i, /check/i,
  /headless/i, /phantom/i, /selenium/i, /puppeteer/i,
  /lighthouse/i, /pagespeed/i, /gtmetrix/i,
  /curl/i, /wget/i, /httpie/i, /python-requests/i, /node-fetch/i,
];

function isBot(): boolean {
  const ua = navigator.userAgent;
  if (!ua || ua.length < 10) return true;
  return BOT_PATTERNS.some((p) => p.test(ua));
}

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function getSessionId(visitorId: string): { sessionId: string; isNew: boolean } {
  const lastActivity = localStorage.getItem(SESSION_LAST_ACTIVITY_KEY);
  const existingSessionId = localStorage.getItem(SESSION_ID_KEY);

  const now = Date.now();
  const expired = !lastActivity || now - parseInt(lastActivity, 10) > SESSION_TIMEOUT_MS;

  if (existingSessionId && !expired) {
    localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, now.toString());
    return { sessionId: existingSessionId, isNew: false };
  }

  // New session
  const sessionId = generateId();
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, now.toString());
  return { sessionId, isNew: true };
}

export function getDebugInfo() {
  return {
    visitorId: localStorage.getItem(VISITOR_ID_KEY) ?? "not set",
    sessionId: localStorage.getItem(SESSION_ID_KEY) ?? "not set",
    lastActivity: localStorage.getItem(SESSION_LAST_ACTIVITY_KEY)
      ? new Date(parseInt(localStorage.getItem(SESSION_LAST_ACTIVITY_KEY)!, 10)).toISOString()
      : "not set",
  };
}

export function useAnalyticsTracker() {
  const location = useLocation();
  const tracked = useRef(new Set<string>());

  useEffect(() => {
    if (isBot()) return;

    const visitorId = getVisitorId();
    const { sessionId, isNew } = getSessionId(visitorId);

    // Dedupe: don't track same page in same session twice in a row
    const pageKey = `${sessionId}:${location.pathname}`;
    if (tracked.current.has(pageKey)) return;
    tracked.current.add(pageKey);

    const track = async () => {
      try {
        // Upsert visitor
        if (isNew) {
          const { data: existing } = await supabase
            .from("analytics_visitors")
            .select("visitor_hash")
            .eq("visitor_hash", visitorId)
            .maybeSingle();

          if (existing) {
            await supabase
              .from("analytics_visitors")
              .update({
                last_seen: new Date().toISOString(),
                visit_count: (existing as any).visit_count ? (existing as any).visit_count + 1 : 1,
              })
              .eq("visitor_hash", visitorId);
          } else {
            await supabase.from("analytics_visitors").insert({
              visitor_hash: visitorId,
              first_seen: new Date().toISOString(),
              last_seen: new Date().toISOString(),
              visit_count: 1,
            });
          }

          // Create session
          await supabase.from("analytics_sessions").insert({
            session_id: sessionId,
            visitor_hash: visitorId,
            started_at: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            page_views_count: 1,
            is_bot: false,
          });
        } else {
          // Update session activity
          await supabase
            .from("analytics_sessions")
            .update({ last_activity: new Date().toISOString() })
            .eq("session_id", sessionId);

          // Increment page views count via raw update
          await supabase.rpc("increment_session_page_views" as any, { p_session_id: sessionId });
        }

        // Record page view
        await supabase.from("analytics_page_views").insert({
          visitor_hash: visitorId,
          session_id: sessionId,
          page_path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (err) {
        // Silently fail — analytics should never break the app
        console.debug("[analytics]", err);
      }
    };

    track();
  }, [location.pathname]);
}
