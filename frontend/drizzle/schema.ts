import { pgTable, serial, text, varchar, index, uniqueIndex, integer, timestamp, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const introductions = pgTable("introductions", {
	id: serial().primaryKey().notNull(),
	content: text().notNull(),
});

export const projects = pgTable("projects", {
	id: serial().primaryKey().notNull(),
	title: varchar().notNull(),
	description: text(),
	imageUrl: varchar("image_url"),
	features: text(),
	technologies: text(),
	demoUrl: varchar("demo_url"),
	videoUrl: varchar("video_url"),
});

export const keywords = pgTable("keywords", {
	id: serial().primaryKey().notNull(),
	keywordName: varchar("keyword_name", { length: 255 }).notNull(),
	numberBlogContain: integer("number_blog_contain"),
}, (table) => [
	index("ix_keywords_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
	uniqueIndex("ix_keywords_keyword_name").using("btree", table.keywordName.asc().nullsLast().op("text_ops")),
]);

export const posts = pgTable("posts", {
	id: serial().primaryKey().notNull(),
	title: varchar().notNull(),
	description: text(),
	imgUrls: varchar("img_urls").array(),
	hashtag: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	summary: text(),
	eventsDate: timestamp("events_date", { mode: 'string' }),
	facebookUrl: varchar("facebook_url"),
}, (table) => [
	index("ix_posts_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
]);

export const publicEvents = pgTable("public_events", {
	id: serial().primaryKey().notNull(),
	title: varchar().notNull(),
	description: text(),
	imgUrl: varchar("img_url"),
	eventsDate: timestamp("events_date", { mode: 'string' }),
	location: varchar(),
	registerLink: varchar("register_link"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	summary: text(),
	facebookUrl: varchar("facebook_url"),
	tags: varchar().array(),
}, (table) => [
	index("ix_public_events_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
]);

export const blogs = pgTable("blogs", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	views: integer(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	imageUrl: varchar("image_url", { length: 1000 }),
	// TODO: failed to parse database type 'tsvector'
	searchVector: unknown("search_vector"),
	summary: text(),
	slug: varchar({ length: 500 }),
}, (table) => [
	index("ix_blogs_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
	index("ix_blogs_search_vector").using("gin", table.searchVector.asc().nullsLast().op("tsvector_ops")),
	uniqueIndex("ix_blogs_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const projectMembers = pgTable("project_members", {
	id: serial().primaryKey().notNull(),
	projectId: integer("project_id").notNull(),
	userId: integer("user_id").notNull(),
	role: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "project_members_project_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "project_members_user_id_fkey"
		}),
]);

export const alembicVersion = pgTable("alembic_version", {
	versionNum: varchar("version_num", { length: 32 }).primaryKey().notNull(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar(),
	email: varchar(),
	phoneNumber: varchar("phone_number"),
	status: varchar(),
	roleId: integer("role_id"),
	roleName: varchar("role_name"),
	avatarUrl: varchar("avatar_url"),
	discordId: varchar("discord_id"),
}, (table) => [
	uniqueIndex("ix_users_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("ix_users_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
	index("ix_users_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const blogAuthors = pgTable("blog_authors", {
	blogId: integer("blog_id").notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blogs.id],
			name: "blog_authors_blog_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "blog_authors_user_id_fkey"
		}),
	primaryKey({ columns: [table.blogId, table.userId], name: "blog_authors_pkey"}),
]);

export const blogKeywords = pgTable("blog_keywords", {
	blogId: integer("blog_id").notNull(),
	keywordId: integer("keyword_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blogs.id],
			name: "blog_keywords_blog_id_fkey"
		}),
	foreignKey({
			columns: [table.keywordId],
			foreignColumns: [keywords.id],
			name: "blog_keywords_keyword_id_fkey"
		}),
	primaryKey({ columns: [table.blogId, table.keywordId], name: "blog_keywords_pkey"}),
]);
