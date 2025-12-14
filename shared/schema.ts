import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Recipes table for Mom's Kitchen Archive (The Hearth)
export const recipes = pgTable("recipes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  ingredients: jsonb("ingredients").$type<string[]>().notNull().default([]),
  instructions: jsonb("instructions").$type<string[]>().notNull().default([]),
  category: text("category").notNull().default("veg"), // 'veg' or 'non-veg'
  cookTime: text("cook_time"),
  servings: text("servings"),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Legacy Audio table for Dad's Life Lessons (The Study)
export const legacyAudio = pgTable("legacy_audio", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  audioUrl: text("audio_url"),
  duration: text("duration"),
  category: text("category").notNull().default("stories"), // 'finance', 'gardening', 'stories'
  description: text("description"),
});

export const insertLegacyAudioSchema = createInsertSchema(legacyAudio).omit({
  id: true,
});

export type InsertLegacyAudio = z.infer<typeof insertLegacyAudioSchema>;
export type LegacyAudio = typeof legacyAudio.$inferSelect;

// Timeline Notes table for Dad's life milestones
export const timelineNotes = pgTable("timeline_notes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  year: integer("year").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
});

export const insertTimelineNoteSchema = createInsertSchema(timelineNotes).omit({
  id: true,
});

export type InsertTimelineNote = z.infer<typeof insertTimelineNoteSchema>;
export type TimelineNote = typeof timelineNotes.$inferSelect;
