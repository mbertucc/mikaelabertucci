
-- ═══ ai_instructions: replace permissive write policy with admin-only ═══
DROP POLICY IF EXISTS "Authenticated users can manage ai_instructions" ON public.ai_instructions;

CREATE POLICY "Admins can manage ai_instructions"
  ON public.ai_instructions
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ═══ skills: replace permissive write policy with admin-only ═══
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON public.skills;

CREATE POLICY "Admins can manage skills"
  ON public.skills
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ═══ faq: replace permissive write policy with admin-only ═══
DROP POLICY IF EXISTS "Authenticated users can manage faq" ON public.faq;

CREATE POLICY "Admins can manage faq"
  ON public.faq
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ═══ experiences: replace permissive write policy with admin-only ═══
DROP POLICY IF EXISTS "Authenticated users can manage experiences" ON public.experiences;

CREATE POLICY "Admins can manage experiences"
  ON public.experiences
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ═══ profile: replace permissive write policies with admin-only ═══
DROP POLICY IF EXISTS "Authenticated users can insert profile" ON public.profile;
DROP POLICY IF EXISTS "Authenticated users can update profile" ON public.profile;

CREATE POLICY "Admins can manage profile"
  ON public.profile
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
