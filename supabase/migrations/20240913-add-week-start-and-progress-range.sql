CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "timezone" text NOT NULL DEFAULT 'UTC',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "onboarding_completed" boolean NOT NULL DEFAULT false,
  "week_starts_on" text NOT NULL DEFAULT 'monday',
  "default_progress_range" integer NOT NULL DEFAULT 30
)