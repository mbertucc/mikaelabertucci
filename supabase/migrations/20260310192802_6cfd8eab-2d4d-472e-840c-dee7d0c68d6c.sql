
-- Remove the public SELECT policy on ai_instructions
DROP POLICY IF EXISTS "AI instructions are readable by anyone" ON public.ai_instructions;
