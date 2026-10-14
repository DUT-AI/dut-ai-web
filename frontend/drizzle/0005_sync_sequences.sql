-- Migration: Fix PostgreSQL Sequences Desync
-- Purpose: Resynchronize all serial primary key sequences with the actual MAX(id)
-- This occurs when data is restored from SQL dumps or imported with explicit primary keys.

SELECT setval('public.blogs_id_seq', COALESCE((SELECT MAX(id) FROM public.blogs), 0) + 1, false);
--> statement-breakpoint
SELECT setval('public.keywords_id_seq', COALESCE((SELECT MAX(id) FROM public.keywords), 0) + 1, false);
--> statement-breakpoint
SELECT setval('public.projects_id_seq', COALESCE((SELECT MAX(id) FROM public.projects), 0) + 1, false);
--> statement-breakpoint
SELECT setval('public.project_members_id_seq', COALESCE((SELECT MAX(id) FROM public.project_members), 0) + 1, false);
--> statement-breakpoint
SELECT setval('public.introductions_id_seq', COALESCE((SELECT MAX(id) FROM public.introductions), 0) + 1, false);
--> statement-breakpoint
SELECT setval('public.generations_id_seq', COALESCE((SELECT MAX(id) FROM public.generations), 0) + 1, false);
--> statement-breakpoint
SELECT setval('public.generation_departments_id_seq', COALESCE((SELECT MAX(id) FROM public.generation_departments), 0) + 1, false);
--> statement-breakpoint
SELECT setval('public.user_cv_id_seq', COALESCE((SELECT MAX(id) FROM public.user_cv), 0) + 1, false);
