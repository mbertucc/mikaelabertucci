
-- Add unique constraint on session_id if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'analytics_sessions_session_id_key') THEN
    ALTER TABLE public.analytics_sessions ADD CONSTRAINT analytics_sessions_session_id_key UNIQUE (session_id);
  END IF;
END $$;

-- Create a SECURITY DEFINER function to record a page view
CREATE OR REPLACE FUNCTION public.record_analytics_page_view(
  p_visitor_hash text,
  p_session_id text,
  p_page_path text,
  p_referrer text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.analytics_page_views (visitor_hash, session_id, page_path, referrer, user_agent)
  VALUES (p_visitor_hash, p_session_id, p_page_path, p_referrer, p_user_agent);
END;
$$;

-- Drop all anonymous INSERT policies on analytics tables
DROP POLICY IF EXISTS "Allow anonymous inserts on analytics_page_views" ON public.analytics_page_views;
DROP POLICY IF EXISTS "Allow anonymous inserts on analytics_sessions" ON public.analytics_sessions;
DROP POLICY IF EXISTS "Allow anonymous inserts on analytics_visitors" ON public.analytics_visitors;
