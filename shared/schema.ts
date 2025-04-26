import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const imageComparisons = pgTable("image_comparisons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  image1Url: text("image1_url").notNull(),
  image2Url: text("image2_url").notNull(),
  similarity: integer("similarity").notNull(),
  analysis: text("analysis").notNull(),
  recommendation: text("recommendation").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const brandComparisons = pgTable("brand_comparisons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  brand1: jsonb("brand1").notNull(),
  brand2: jsonb("brand2").notNull(),
  similarity: integer("similarity").notNull(),
  wordAnalysis: text("word_analysis").notNull(),
  phoneticAnalysis: text("phonetic_analysis").notNull(),
  industryContext: text("industry_context").notNull(),
  regulatoryCompliance: text("regulatory_compliance").notNull(),
  recommendation: text("recommendation").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertImageComparisonSchema = createInsertSchema(imageComparisons).omit({
  id: true,
  createdAt: true,
});

export const insertBrandComparisonSchema = createInsertSchema(brandComparisons).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertImageComparison = z.infer<typeof insertImageComparisonSchema>;
export type ImageComparison = typeof imageComparisons.$inferSelect;

export type InsertBrandComparison = z.infer<typeof insertBrandComparisonSchema>;
export type BrandComparison = typeof brandComparisons.$inferSelect;

// Brand Interfaces
export interface Brand {
  name: string;
  description: string;
  type: string;
}

export interface BrandComparisonResult {
  similarity: number;
  wordAnalysis: string;
  phoneticAnalysis: string;
  industryContext: string;
  regulatoryCompliance: string;
  recommendation: string;
  brand1: Brand;
  brand2: Brand;
}

// Image Comparison Interfaces
export interface ImageComparisonResult {
  similarity: number;
  analysis: string;
  recommendation: string;
  image1Url: string;
  image2Url: string;
}
