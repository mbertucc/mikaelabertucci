
-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profile table (single row for portfolio owner)
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT 'Mikaela Bertucci',
  title TEXT NOT NULL DEFAULT 'Senior Product Owner',
  status_badge TEXT NOT NULL DEFAULT '🟢 Open to Senior PO roles',
  positioning TEXT NOT NULL DEFAULT 'I use AI to save my teams 20+ hours a week in requirement gathering.',
  company_badges TEXT[] NOT NULL DEFAULT ARRAY['BC Government']::TEXT[],
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profile is publicly readable" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update profile" ON public.profile FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert profile" ON public.profile FOR INSERT TO authenticated WITH CHECK (true);

CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public.profile
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  date_range TEXT NOT NULL,
  title_progression TEXT NOT NULL,
  achievements TEXT[] NOT NULL DEFAULT '{}',
  ai_situation TEXT DEFAULT '',
  ai_approach TEXT DEFAULT '',
  ai_technical_work TEXT DEFAULT '',
  ai_lessons_learned TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Experiences are publicly readable" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('strong', 'moderate', 'gap')),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are publicly readable" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FAQ table
CREATE TABLE public.faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQ is publicly readable" ON public.faq FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage faq" ON public.faq FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON public.faq
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AI Instructions table
CREATE TABLE public.ai_instructions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_instructions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI instructions are publicly readable" ON public.ai_instructions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage ai_instructions" ON public.ai_instructions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_ai_instructions_updated_at BEFORE UPDATE ON public.ai_instructions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
