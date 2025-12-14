import {
  type User,
  type InsertUser,
  type Recipe,
  type InsertRecipe,
  type LegacyAudio,
  type InsertLegacyAudio,
  type TimelineNote,
  type InsertTimelineNote,
  users,
  recipes,
  legacyAudio,
  timelineNotes,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;

  getLegacyAudios(): Promise<LegacyAudio[]>;
  getLegacyAudio(id: number): Promise<LegacyAudio | undefined>;
  createLegacyAudio(audio: InsertLegacyAudio): Promise<LegacyAudio>;
  updateLegacyAudio(id: number, audio: Partial<InsertLegacyAudio>): Promise<LegacyAudio | undefined>;
  deleteLegacyAudio(id: number): Promise<boolean>;

  getTimelineNotes(): Promise<TimelineNote[]>;
  getTimelineNote(id: number): Promise<TimelineNote | undefined>;
  createTimelineNote(note: InsertTimelineNote): Promise<TimelineNote>;
  updateTimelineNote(id: number, note: Partial<InsertTimelineNote>): Promise<TimelineNote | undefined>;
  deleteTimelineNote(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getRecipes(): Promise<Recipe[]> {
    return db.select().from(recipes);
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    const result = await db.select().from(recipes).where(eq(recipes.id, id));
    return result[0];
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const result = await db.insert(recipes).values(recipe).returning();
    return result[0];
  }

  async updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const result = await db.update(recipes).set(recipe).where(eq(recipes.id, id)).returning();
    return result[0];
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = await db.delete(recipes).where(eq(recipes.id, id)).returning();
    return result.length > 0;
  }

  async getLegacyAudios(): Promise<LegacyAudio[]> {
    return db.select().from(legacyAudio);
  }

  async getLegacyAudio(id: number): Promise<LegacyAudio | undefined> {
    const result = await db.select().from(legacyAudio).where(eq(legacyAudio.id, id));
    return result[0];
  }

  async createLegacyAudio(audio: InsertLegacyAudio): Promise<LegacyAudio> {
    const result = await db.insert(legacyAudio).values(audio).returning();
    return result[0];
  }

  async updateLegacyAudio(id: number, audio: Partial<InsertLegacyAudio>): Promise<LegacyAudio | undefined> {
    const result = await db.update(legacyAudio).set(audio).where(eq(legacyAudio.id, id)).returning();
    return result[0];
  }

  async deleteLegacyAudio(id: number): Promise<boolean> {
    const result = await db.delete(legacyAudio).where(eq(legacyAudio.id, id)).returning();
    return result.length > 0;
  }

  async getTimelineNotes(): Promise<TimelineNote[]> {
    return db.select().from(timelineNotes);
  }

  async getTimelineNote(id: number): Promise<TimelineNote | undefined> {
    const result = await db.select().from(timelineNotes).where(eq(timelineNotes.id, id));
    return result[0];
  }

  async createTimelineNote(note: InsertTimelineNote): Promise<TimelineNote> {
    const result = await db.insert(timelineNotes).values(note).returning();
    return result[0];
  }

  async updateTimelineNote(id: number, note: Partial<InsertTimelineNote>): Promise<TimelineNote | undefined> {
    const result = await db.update(timelineNotes).set(note).where(eq(timelineNotes.id, id)).returning();
    return result[0];
  }

  async deleteTimelineNote(id: number): Promise<boolean> {
    const result = await db.delete(timelineNotes).where(eq(timelineNotes.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
