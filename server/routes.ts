import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecipeSchema, insertLegacyAudioSchema, insertTimelineNoteSchema } from "@shared/schema";
import { z } from "zod";

const PIN_CODE = "Cheerla";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/recipes", async (_req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.get("/api/recipes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }
    const recipe = await storage.getRecipe(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  });

  app.post("/api/recipes", async (req, res) => {
    try {
      const parsed = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(parsed);
      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      throw error;
    }
  });

  app.patch("/api/recipes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }
    try {
      const parsed = insertRecipeSchema.partial().parse(req.body);
      const recipe = await storage.updateRecipe(id, parsed);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      throw error;
    }
  });

  app.delete("/api/recipes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const pin = req.headers["x-pin"] as string;
    
    if (pin !== PIN_CODE) {
      return res.status(403).json({ error: "Invalid PIN" });
    }
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }
    
    const deleted = await storage.deleteRecipe(id);
    if (!deleted) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(204).send();
  });

  app.get("/api/legacy-audio", async (_req, res) => {
    const audios = await storage.getLegacyAudios();
    res.json(audios);
  });

  app.get("/api/legacy-audio/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid audio ID" });
    }
    const audio = await storage.getLegacyAudio(id);
    if (!audio) {
      return res.status(404).json({ error: "Audio not found" });
    }
    res.json(audio);
  });

  app.post("/api/legacy-audio", async (req, res) => {
    try {
      const parsed = insertLegacyAudioSchema.parse(req.body);
      const audio = await storage.createLegacyAudio(parsed);
      res.status(201).json(audio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      throw error;
    }
  });

  app.patch("/api/legacy-audio/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid audio ID" });
    }
    try {
      const parsed = insertLegacyAudioSchema.partial().parse(req.body);
      const audio = await storage.updateLegacyAudio(id, parsed);
      if (!audio) {
        return res.status(404).json({ error: "Audio not found" });
      }
      res.json(audio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      throw error;
    }
  });

  app.delete("/api/legacy-audio/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const pin = req.headers["x-pin"] as string;
    
    if (pin !== PIN_CODE) {
      return res.status(403).json({ error: "Invalid PIN" });
    }
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid audio ID" });
    }
    
    const deleted = await storage.deleteLegacyAudio(id);
    if (!deleted) {
      return res.status(404).json({ error: "Audio not found" });
    }
    res.status(204).send();
  });

  app.get("/api/timeline-notes", async (_req, res) => {
    const notes = await storage.getTimelineNotes();
    res.json(notes);
  });

  app.get("/api/timeline-notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }
    const note = await storage.getTimelineNote(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  });

  app.post("/api/timeline-notes", async (req, res) => {
    try {
      const parsed = insertTimelineNoteSchema.parse(req.body);
      const note = await storage.createTimelineNote(parsed);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      throw error;
    }
  });

  app.patch("/api/timeline-notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }
    try {
      const parsed = insertTimelineNoteSchema.partial().parse(req.body);
      const note = await storage.updateTimelineNote(id, parsed);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      throw error;
    }
  });

  app.delete("/api/timeline-notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const pin = req.headers["x-pin"] as string;
    
    if (pin !== PIN_CODE) {
      return res.status(403).json({ error: "Invalid PIN" });
    }
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }
    
    const deleted = await storage.deleteTimelineNote(id);
    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).send();
  });

  return httpServer;
}
