import { pgTable, serial, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    role: integer("role").default(1),
    login: text("login").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("login_idx").on(table.login)],
);

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  given: text("given").notNull(),
  lastName: text("last_name").notNull(),
  firstName: text("first_name").notNull(),
  patronymic: text("patronymic").notNull(),
  specialty: text("specialty").notNull(),
  qualification: text("qualification").notNull(),
  birthDate: text("birth_date").notNull(),
  passportNumber: text("passport_number").notNull(),
  certificateNumber: integer("certificate_number").notNull(),
  protocolNumber: text("protocol_number").notNull(),
  protocolRegistrationDate: text("protocol_registration_date").notNull(),
  commissionChairman: text("commission_chairman").notNull(),
  photo: text("photo"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
