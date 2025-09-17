// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { desc, sql } from "drizzle-orm";
import { boolean, primaryKey, unique } from "drizzle-orm/mysql-core";
import {
  index,
  mysqlTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  int,
} from "drizzle-orm/mysql-core";
import { title } from "process";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `bakonykuti-t3_${name}`);


export const images = createTable("image", {
  id: serial("id").primaryKey(),
  url: varchar("url", {length: 1024}).notNull(),
  title: varchar("title", {length: 256}).default("").notNull(),
  carousel: boolean("carousel").default(false).notNull(),
  gallery: boolean("gallery").default(true).notNull(),
  visible: boolean("visible").default(true).notNull(), // Admin can control visibility in public gallery
  localPath: varchar("local_path", {length: 1024}), // Track local file path for cleanup
  image_size: int("image_size").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
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
  thumbnail: varchar("thumbnail", { length: 2056 }).notNull(),
  content: text("content"),
  creatorName: varchar("creator_name", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export type EventType = 'community' | 'cultural' | 'sports' | 'education' | 'gun_range';

export const events = createTable("event", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 2056 }).notNull(),
  content: text("content"),
  date: timestamp("date").notNull().default(sql`CURRENT_TIMESTAMP`),
  type: varchar("type", { length: 256 }).notNull().default("community"),
  createdBy: varchar("created_by", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const documents = createTable("document", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  category: varchar("category", { length: 256 }).notNull(),
  date: timestamp("date").notNull(),
  fileUrl: varchar("file_url", { length: 1024 }).notNull(),
  fileSize: varchar("file_size", { length: 256 }).notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// File Management Schema
export const files = createTable("file", {
  id: serial("id").primaryKey(),
  originalName: varchar("original_name", { length: 512 }).notNull(),
  filename: varchar("filename", { length: 512 }).notNull(), // Generated unique filename
  filePath: varchar("file_path", { length: 1024 }).notNull(), // Full path from project root
  publicUrl: varchar("public_url", { length: 1024 }).notNull(), // URL for web access
  mimeType: varchar("mime_type", { length: 128 }).notNull(),
  fileSize: int("file_size").notNull(), // Size in bytes
  uploadType: varchar("upload_type", { length: 64 }).notNull(), // gallery, news, events, documents
  uploadedBy: varchar("uploaded_by", { length: 255 }), // User ID who uploaded
  associatedEntity: varchar("associated_entity", { length: 64 }), // Type of entity (image, document, etc.)
  associatedEntityId: int("associated_entity_id"), // ID of the associated entity
  isOrphaned: boolean("is_orphaned").default(false).notNull(), // Track orphaned files
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
}, (file) => ({
  filePathIdx: index("file_path_idx").on(file.filePath),
  uploadTypeIdx: index("upload_type_idx").on(file.uploadType),
  uploadedByIdx: index("uploaded_by_idx").on(file.uploadedBy),
  associatedEntityIdx: index("associated_entity_idx").on(file.associatedEntity, file.associatedEntityId),
  orphanedIdx: index("orphaned_idx").on(file.isOrphaned),
}));

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

// NextAuth.js Schema

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  password: varchar("password", { length: 255 }),
  role: varchar("role", { length: 255 }).default("user").notNull(),
});

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;