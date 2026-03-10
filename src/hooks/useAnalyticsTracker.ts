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
        // Upsert visitor (only on new session)
        if (isNew) {
          await supabase.rpc("upsert_analytics_visitor" as any, {
            p_visitor_hash: visitorId,
          });
        }

        // Upsert session (creates on new, updates last_activity on existing)
        await supabase.rpc("upsert_analytics_session" as any, {
          p_session_id: sessionId,
          p_visitor_hash: visitorId,
        });

        // Increment page views for existing sessions
        if (!isNew) {
          await supabase.rpc("increment_session_page_views" as any, { p_session_id: sessionId });
        }

        // Record page view
        await supabase.rpc("record_analytics_page_view" as any, {
          p_visitor_hash: visitorId,
          p_session_id: sessionId,
          p_page_path: location.pathname,
          p_referrer: document.referrer || null,
          p_user_agent: navigator.userAgent,
        });
      } catch (err) {
        // Silently fail — analytics should never break the app
        console.debug("[analytics]", err);
      }
    };

    track();
  }, [location.pathname]);
}
