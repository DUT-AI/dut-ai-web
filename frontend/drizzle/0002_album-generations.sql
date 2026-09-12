CREATE TABLE "generation_departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"generation_id" integer NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"accent_color" varchar(20) DEFAULT '#2563eb' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_members" (
	"generation_id" integer NOT NULL,
	"department_id" integer NOT NULL,
	"external_user_id" integer NOT NULL,
	"title" varchar(150) DEFAULT 'Thành viên' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	CONSTRAINT "generation_members_department_id_external_user_id_pk" PRIMARY KEY("department_id","external_user_id")
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"period" varchar(100),
	"description" text,
	"cover_image_url" varchar(1000),
	"accent_color" varchar(20) DEFAULT '#2563eb' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "ix_project_members_user_id";--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_blog_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "project_members" RENAME COLUMN "user_id" TO "external_user_id";--> statement-breakpoint
ALTER TABLE "blog_authors" RENAME COLUMN "user_id" TO "external_user_id";--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_blog_id_external_user_id_pk" PRIMARY KEY("blog_id","external_user_id");--> statement-breakpoint
ALTER TABLE "generation_departments" ADD CONSTRAINT "generation_departments_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_members" ADD CONSTRAINT "generation_members_generation_id_generations_id_fk" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_members" ADD CONSTRAINT "generation_members_department_id_generation_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."generation_departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_generation_departments_generation_id" ON "generation_departments" USING btree ("generation_id");--> statement-breakpoint
CREATE INDEX "ix_generation_members_generation_id" ON "generation_members" USING btree ("generation_id");--> statement-breakpoint
CREATE INDEX "ix_generation_members_external_user_id" ON "generation_members" USING btree ("external_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ix_generations_slug" ON "generations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "ix_generations_display_order" ON "generations" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "ix_project_members_external_user_id" ON "project_members" USING btree ("external_user_id");
