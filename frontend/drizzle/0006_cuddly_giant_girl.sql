CREATE TABLE "user_portfolio_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"image_url" varchar(1000),
	"demo_url" varchar(1000),
	"repo_url" varchar(1000),
	"technologies" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "username" varchar(50);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "headline" varchar(255);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "avatar_url" varchar(1000);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "github_url" varchar(500);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "linkedin_url" varchar(500);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "facebook_url" varchar(500);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "website_url" varchar(500);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "skills" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "cv_file_url" varchar(1000);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "cv_file_name" varchar(255);--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "cv_file_size" integer;--> statement-breakpoint
ALTER TABLE "user_cv" ADD COLUMN "is_public" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX "ix_user_portfolio_projects_user_id" ON "user_portfolio_projects" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ix_user_cv_username" ON "user_cv" USING btree ("username");