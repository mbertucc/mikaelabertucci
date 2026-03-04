
-- Analytics visitors table (anonymous tracking)
CREATE TABLE public.analytics_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_hash text NOT NULL UNIQUE,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  visit_count integer NOT NULL DEFAULT 1
);

-- Analytics sessions table
CREATE TABLE public.analytics_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  visitor_hash text NOT NULL REFERENCES public.analytics_visitors(visitor_hash) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_activity timestamptz NOT NULL DEFAULT now(),
  page_views_count integer NOT NULL DEFAULT 0,
  is_bot boolean NOT NULL DEFAULT false
);

-- Analytics page views table
CREATE TABLE public.analytics_page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_hash text NOT NULL,
  session_id text NOT NULL,
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking
CREATE POLICY "Allow anonymous inserts on analytics_visitors"
  ON public.analytics_visitors FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous updates on analytics_visitors"
  ON public.analytics_visitors FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin reads on analytics_visitors"
  ON public.analytics_visitors FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow anon select for upsert operations
CREATE POLICY "Allow anonymous select on analytics_visitors"
  ON public.analytics_visitors FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow anonymous inserts on analytics_sessions"
  ON public.analytics_sessions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous updates on analytics_sessions"
  ON public.analytics_sessions FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin reads on analytics_sessions"
  ON public.analytics_sessions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow anonymous select on analytics_sessions"
  ON public.analytics_sessions FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow anonymous inserts on analytics_page_views"
  ON public.analytics_page_views FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin reads on analytics_page_views"
  ON public.analytics_page_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_analytics_page_views_created_at ON public.analytics_page_views(created_at);
CREATE INDEX idx_analytics_page_views_visitor_hash ON public.analytics_page_views(visitor_hash);
CREATE INDEX idx_analytics_sessions_visitor_hash ON public.analytics_sessions(visitor_hash);
CREATE INDEX idx_analytics_sessions_started_at ON public.analytics_sessions(started_at);
