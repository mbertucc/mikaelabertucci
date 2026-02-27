
-- Update existing record to be Corporate Information Records Management (top 3 bullets)
UPDATE public.experiences 
SET 
  company = 'Corporate Information & Records Management',
  title_progression = 'Product Owner → Senior FOI Analyst',
  achievements = ARRAY[
    'Led transformation of operational teams to cross-functional Scrum teams',
    'Managed 18 products across 3 branches',
    'Applied Agile to reduce records gathering from 1 hour to 15 minutes'
  ],
  ai_situation = 'Worked within BC Government ministries driving Agile transformation and records management optimization.',
  ai_approach = 'Brought Agile coaching and product ownership to traditional government records environments.',
  ai_technical_work = 'Agile transformation, cross-functional team building, FOI process optimization.',
  ai_lessons_learned = 'Government transformation requires patience and proof. Reducing FOI from 1 hour to 15 minutes was the proof.',
  updated_at = now()
WHERE id = '0e9e020f-6403-41e2-82df-3af87e346cc9';

-- Insert new record for Property Information Management System
INSERT INTO public.experiences (company, title_progression, date_range, sort_order, achievements, ai_situation, ai_approach, ai_technical_work, ai_lessons_learned)
VALUES (
  'Property Information Management System',
  'Product Owner',
  '2018 – 2022',
  3,
  ARRAY[
    'Created a GIS Property Inventory Management System by integrating municipal GIS data with the BC Data Warehouse',
    'Consolidated property data from multiple municipal sources into a single searchable registry',
    'Designed data ingestion pipelines to standardize inconsistent GIS formats across 180+ municipalities',
    'Reduced property lookup time from days to seconds for internal government users'
  ],
  'BC Government needed a unified property inventory system but data was fragmented across hundreds of municipal GIS sources with no common format.',
  'Built a centralized integration layer that normalized municipal GIS data into the BC Data Warehouse, giving teams one source of truth.',
  'GIS data integration, ETL pipeline design, BC Data Warehouse architecture, municipal data standardization.',
  'The hardest part of data integration is not the technology—it is getting 180 municipalities to agree on what a property boundary actually means.'
);

-- Bump Foundations Coaching to sort_order 4
UPDATE public.experiences SET sort_order = 4, updated_at = now() WHERE id = '13d490f8-23d3-4091-9f0a-9774ccbfb350';
