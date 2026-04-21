import { pgTable, uuid, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";

// Bu jadvalni Drizzle-kit ko'rmaydi, lekin biz koddai import qilib ishlatamiz
export const partitionTest = pgTable(
  "test_partition",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: text("name"),
    year: integer("year").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    // Partitioning uchun Composite Primary Key shart
    primaryKey({ columns: [table.id, table.year] }),
  ],
);
