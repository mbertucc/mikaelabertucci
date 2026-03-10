import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteMetrics {
  about_velocity_time_to_draft: number;
  about_velocity_time_to_draft_max: number;
  about_velocity_planning: number;
  about_precision_requirement: number;
  about_precision_accuracy: number;
  about_culture_satisfaction: number;
  about_culture_strategy: number;
  dark_factory_pages: number;
  dark_factory_hours_saved_weekly: number;
  dark_factory_clarification_reduction: number;
  dark_factory_total_hours_saved: number;
  dark_factory_quality_lift: number;
  dark_factory_stories_drafted: number;
  dark_factory_cognitive_load: number;
  impact_hours_weekly: number;
  impact_hours_quarterly: number;
  impact_quality_lift: number;
  impact_cognitive_shift: number;
  impact_legislative_before: number;
  impact_legislative_after: number;
  impact_velocity: number;
  impact_precision: number;
  impact_strategic_days: number;
}

const defaults: SiteMetrics = {
  about_velocity_time_to_draft: 2,
  about_velocity_time_to_draft_max: 5,
  about_velocity_planning: 50,
  about_precision_requirement: 95,
  about_precision_accuracy: 75,
  about_culture_satisfaction: 80,
  about_culture_strategy: 40,
  dark_factory_pages: 200,
  dark_factory_hours_saved_weekly: 20,
  dark_factory_clarification_reduction: 90,
  dark_factory_total_hours_saved: 116.5,
  dark_factory_quality_lift: 35,
  dark_factory_stories_drafted: 60,
  dark_factory_cognitive_load: 50,
  impact_hours_weekly: 19.4,
  impact_hours_quarterly: 233,
  impact_quality_lift: 35,
  impact_cognitive_shift: 50,
  impact_legislative_before: 40,
  impact_legislative_after: 2.5,
  impact_velocity: 50,
  impact_precision: 35,
  impact_strategic_days: 2,
};

export const useSiteMetrics = () =>
  useQuery({
    queryKey: ["site_metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("site-metrics");
      if (error) throw error;
      try {
        const raw = typeof data.metrics === "string" ? JSON.parse(data.metrics) : data.metrics;
        return { ...defaults, ...raw } as SiteMetrics;
      } catch {
        return defaults;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
