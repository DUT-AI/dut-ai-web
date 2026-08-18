import { relations } from "drizzle-orm/relations";
import { projects, projectMembers, users, blogs, blogAuthors, blogKeywords, keywords } from "./schema";

export const projectMembersRelations = relations(projectMembers, ({one}) => ({
	project: one(projects, {
		fields: [projectMembers.projectId],
		references: [projects.id]
	}),
	user: one(users, {
		fields: [projectMembers.userId],
		references: [users.id]
	}),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	projectMembers: many(projectMembers),
}));

export const usersRelations = relations(users, ({many}) => ({
	projectMembers: many(projectMembers),
	blogAuthors: many(blogAuthors),
}));

export const blogAuthorsRelations = relations(blogAuthors, ({one}) => ({
	blog: one(blogs, {
		fields: [blogAuthors.blogId],
		references: [blogs.id]
	}),
	user: one(users, {
		fields: [blogAuthors.userId],
		references: [users.id]
	}),
}));

export const blogsRelations = relations(blogs, ({many}) => ({
	blogAuthors: many(blogAuthors),
	blogKeywords: many(blogKeywords),
}));

export const blogKeywordsRelations = relations(blogKeywords, ({one}) => ({
	blog: one(blogs, {
		fields: [blogKeywords.blogId],
		references: [blogs.id]
	}),
	keyword: one(keywords, {
		fields: [blogKeywords.keywordId],
		references: [keywords.id]
	}),
}));

export const keywordsRelations = relations(keywords, ({many}) => ({
	blogKeywords: many(blogKeywords),
}));