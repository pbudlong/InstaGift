import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
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

// Gift schema for InstaGift
export const gifts = pgTable("gifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  brandColors: text("brand_colors").array(),
  emoji: text("emoji"),
  amount: integer("amount").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientEmail: text("recipient_email"),
  recipientPhone: text("recipient_phone"),
  message: text("message"),
  stripeCardholderId: text("stripe_cardholder_id"),
  stripeCardId: text("stripe_card_id"),
  cardNumber: text("card_number"),
  cardExpiry: text("card_expiry"),
  cardCvv: text("card_cvv"),
  createdAt: text("created_at").notNull(),
});

export const insertGiftSchema = createInsertSchema(gifts).omit({
  id: true,
  createdAt: true,
});

export type InsertGift = z.infer<typeof insertGiftSchema>;
export type Gift = typeof gifts.$inferSelect;

// Business analysis schema
export const businessAnalysisSchema = z.object({
  businessName: z.string(),
  businessType: z.string(),
  brandColors: z.array(z.string()),
  emoji: z.string(),
  vibe: z.string(),
  description: z.string(),
});

export type BusinessAnalysis = z.infer<typeof businessAnalysisSchema>;

// Access requests schema
export const accessRequests = pgTable("access_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"),
  approved: boolean("approved").notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const insertAccessRequestSchema = createInsertSchema(accessRequests).omit({
  id: true,
  createdAt: true,
  password: true,
  approved: true,
});

export type InsertAccessRequest = z.infer<typeof insertAccessRequestSchema>;
export type AccessRequest = typeof accessRequests.$inferSelect;
