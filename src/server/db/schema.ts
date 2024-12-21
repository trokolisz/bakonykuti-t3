// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { desc, sql } from "drizzle-orm";
import { boolean } from "drizzle-orm/pg-core";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { title } from "process";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `bakonykuti-t3_${name}`);


export const images = createTable("image", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  carousel: boolean("carousel").default(false).notNull()
});

export type Image = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;

export type Page = typeof pages.$inferSelect;
export type InsertPage = typeof pages.$inferInsert;

export const pages = createTable("page", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content").notNull(), // Ensure content is not null to store markdown data
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  lastModified: timestamp("last_modified")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

export const news = createTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 256 }).notNull(),
  content: text("content"),
  creatorName: varchar("creator_name", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const events = createTable("event", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull().notNull(),
  type: varchar("type", { length: 256 }),
  createdBy: varchar("created_by", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const documents = createTable("document", {
  id: varchar("id", { length: 256 }).primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  category: varchar("category", { length: 256 }).notNull(),
  type: varchar("type", { length: 256 }).notNull(),
  date: timestamp("date").notNull(),
  fileUrl: varchar("file_url", { length: 1024 }).notNull(),
  fileSize: varchar("file_size", { length: 256 }).notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;