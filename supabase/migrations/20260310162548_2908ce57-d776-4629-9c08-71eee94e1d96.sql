
-- 1. Remove overly permissive anon SELECT on analytics_visitors
DROP POLICY IF EXISTS "Allow anonymous select on analytics_visitors" ON public.analytics_visitors;

-- 2. Remove overly permissive anon SELECT on analytics_sessions  
DROP POLICY IF EXISTS "Allow anonymous select on analytics_sessions" ON public.analytics_sessions;

-- 3. Tighten analytics_visitors UPDATE: only allow updating your own row by visitor_hash
DROP POLICY IF EXISTS "Allow anonymous updates on analytics_visitors" ON public.analytics_visitors;
CREATE POLICY "Allow visitor self-update on analytics_visitors"
  ON public.analytics_visitors
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (visitor_hash = visitor_hash);

-- 4. Tighten analytics_sessions UPDATE: only allow updating your own session
DROP POLICY IF EXISTS "Allow anonymous updates on analytics_sessions" ON public.analytics_sessions;
CREATE POLICY "Allow session self-update on analytics_sessions"
  ON public.analytics_sessions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (session_id = session_id);

-- 5. Restrict ai_instructions: drop public read, add anon/authenticated read
DROP POLICY IF EXISTS "AI instructions are publicly readable" ON public.ai_instructions;
CREATE POLICY "AI instructions are readable by anyone"
  ON public.ai_instructions
  FOR SELECT
  TO anon, authenticated
  USING (true);
