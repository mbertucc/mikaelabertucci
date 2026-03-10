
-- Create a SECURITY DEFINER function to handle visitor upsert
CREATE OR REPLACE FUNCTION public.upsert_analytics_visitor(p_visitor_hash text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.analytics_visitors (visitor_hash, first_seen, last_seen, visit_count)
  VALUES (p_visitor_hash, now(), now(), 1)
  ON CONFLICT (visitor_hash) DO UPDATE
  SET last_seen = now(), visit_count = analytics_visitors.visit_count + 1;
END;
$$;

-- Create a SECURITY DEFINER function to handle session upsert
CREATE OR REPLACE FUNCTION public.upsert_analytics_session(p_session_id text, p_visitor_hash text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.analytics_sessions (session_id, visitor_hash, started_at, last_activity, page_views_count, is_bot)
  VALUES (p_session_id, p_visitor_hash, now(), now(), 1, false)
  ON CONFLICT (session_id) DO UPDATE
  SET last_activity = now();
END;
$$;

-- Drop the UPDATE policies entirely
DROP POLICY IF EXISTS "Allow visitor self-update on analytics_visitors" ON public.analytics_visitors;
DROP POLICY IF EXISTS "Allow session self-update on analytics_sessions" ON public.analytics_sessions;
