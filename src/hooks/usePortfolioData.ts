import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

export const useExperiences = () =>
  useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experiences").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useSkills = () =>
  useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useFaq = () =>
  useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faq").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useAiInstructions = () =>
  useQuery({
    queryKey: ["ai_instructions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ai_instructions").select("*");
      if (error) throw error;
      return data;
    },
  });
