ALTER TABLE "alembic_version" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "alembic_version" CASCADE;--> statement-breakpoint
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_project_id_fkey";
--> statement-breakpoint
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_blog_id_fkey";
--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "blog_keywords" DROP CONSTRAINT "blog_keywords_blog_id_fkey";
--> statement-breakpoint
ALTER TABLE "blog_keywords" DROP CONSTRAINT "blog_keywords_keyword_id_fkey";
--> statement-breakpoint
DROP INDEX "ix_blogs_id";--> statement-breakpoint
DROP INDEX "ix_keywords_id";--> statement-breakpoint
DROP INDEX "ix_keywords_keyword_name";--> statement-breakpoint
DROP INDEX "ix_posts_id";--> statement-breakpoint
DROP INDEX "ix_public_events_id";--> statement-breakpoint
DROP INDEX "ix_blogs_search_vector";--> statement-breakpoint
DROP INDEX "ix_blogs_slug";--> statement-breakpoint
DROP INDEX "ix_users_email";--> statement-breakpoint
DROP INDEX "ix_users_id";--> statement-breakpoint
DROP INDEX "ix_users_name";--> statement-breakpoint
ALTER TABLE "blog_authors" DROP CONSTRAINT "blog_authors_pkey";--> statement-breakpoint
ALTER TABLE "blog_keywords" DROP CONSTRAINT "blog_keywords_pkey";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "image_url" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "demo_url" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "video_url" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "keywords" ALTER COLUMN "number_blog_contain" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "hashtag" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "facebook_url" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "public_events" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "public_events" ALTER COLUMN "img_url" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "public_events" ALTER COLUMN "location" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "public_events" ALTER COLUMN "register_link" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "public_events" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_events" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public_events" ALTER COLUMN "facebook_url" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "views" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "role" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone_number" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role_name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "avatar_url" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "discord_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_blog_id_user_id_pk" PRIMARY KEY("blog_id","user_id");--> statement-breakpoint
ALTER TABLE "blog_keywords" ADD CONSTRAINT "blog_keywords_blog_id_keyword_id_pk" PRIMARY KEY("blog_id","keyword_id");--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_authors" ADD CONSTRAINT "blog_authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_keywords" ADD CONSTRAINT "blog_keywords_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_keywords" ADD CONSTRAINT "blog_keywords_keyword_id_keywords_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keywords"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_project_members_project_id" ON "project_members" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "ix_project_members_user_id" ON "project_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ix_keywords_id" ON "keywords" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "ix_keywords_keyword_name" ON "keywords" USING btree ("keyword_name");--> statement-breakpoint
CREATE INDEX "ix_posts_id" ON "posts" USING btree ("id");--> statement-breakpoint
CREATE INDEX "ix_public_events_id" ON "public_events" USING btree ("id");--> statement-breakpoint
CREATE INDEX "ix_blogs_search_vector" ON "blogs" USING gin ("search_vector");--> statement-breakpoint
CREATE UNIQUE INDEX "ix_blogs_slug" ON "blogs" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "ix_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "ix_users_id" ON "users" USING btree ("id");--> statement-breakpoint
CREATE INDEX "ix_users_name" ON "users" USING btree ("name");--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN IF EXISTS "content";
