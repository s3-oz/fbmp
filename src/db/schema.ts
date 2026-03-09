import { pgTable, uuid, text, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  category: text("category"),
  condition: text("condition").default("used_good"),
  location: text("location").default("Gippsland, VIC"),
  status: text("status").default("draft"),
  images: text("images").array(),
  aiEnhanced: jsonb("ai_enhanced"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
