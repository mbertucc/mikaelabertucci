
CREATE OR REPLACE FUNCTION public.increment_session_page_views(p_session_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.analytics_sessions
  SET page_views_count = page_views_count + 1,
      last_activity = now()
  WHERE session_id = p_session_id;
$$;
