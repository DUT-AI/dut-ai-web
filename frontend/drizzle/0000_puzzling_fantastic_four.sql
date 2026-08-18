-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "introductions" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"image_url" varchar,
	"features" text,
	"technologies" text,
	"demo_url" varchar,
	"video_url" varchar
);
--> statement-breakpoint
CREATE TABLE "keywords" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword_name" varchar(255) NOT NULL,
	"number_blog_contain" integer
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"img_urls" varchar[],
	"hashtag" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"summary" text,
	"events_date" timestamp,
	"facebook_url" varchar
);
--> statement-breakpoint
CREATE TABLE "public_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"img_url" varchar,
	"events_date" timestamp,
	"location" varchar,
	"register_link" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"summary" text,
	"facebook_url" varchar,
	"tags" varchar[]
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"views" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"image_url" varchar(1000),
	"search_vector" "tsvector",
	"summary" text,
	"slug" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "project_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alembic_version" (
	"version_num" varchar(32) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar,
	"phone_number" varchar,
	"status" varchar,
	"role_id" integer,
	"role_name" varchar,
	"avatar_url" varchar,
	"discord_id" varchar
);
--> statement-breakpoint
CREATE TABLE "blog_authors" (
	"blog_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "blog_authors_pkey" PRIMARY KEY("blog_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "blog_keywords" (
	"blog_id" integer NOT NULL,
	"keyword_id" integer NOT NULL,
	CONSTRAINT "blog_keywords_pkey" PRIMARY KEY("blog_id","keyword_id")
);
--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_keywords" ADD CONSTRAINT "blog_keywords_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_keywords" ADD CONSTRAINT "blog_keywords_keyword_id_fkey" FOREIGN KEY ("keyword_id") REFERENCES "public"."keywords"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_keywords_id" ON "keywords" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_keywords_keyword_name" ON "keywords" USING btree ("keyword_name" text_ops);--> statement-breakpoint
CREATE INDEX "ix_posts_id" ON "posts" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_public_events_id" ON "public_events" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_blogs_id" ON "blogs" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_blogs_search_vector" ON "blogs" USING gin ("search_vector" tsvector_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_blogs_slug" ON "blogs" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_users_email" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "ix_users_id" ON "users" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE INDEX "ix_users_name" ON "users" USING btree ("name" text_ops);
*/