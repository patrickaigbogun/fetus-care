import {
  pgTable,
  unique,
  uuid,
  varchar,
  foreignKey,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    userId: uuid("user_id").defaultRandom().primaryKey().notNull(),
    email: varchar({ length: 250 }).notNull(),
    password: varchar({ length: 250 }).notNull(),
  },
  (table) => [unique("users_email_unique").on(table.email)]
);

export const profiles = pgTable(
  "profiles",
  {
    profileId: uuid("profile_id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    displayName: varchar("display_name", { length: 150 }).notNull(),
    profileImageUrl: varchar("profile_image_url", { length: 500 }),
    country: varchar({ length: 100 }).notNull(),
    state: varchar({ length: 100 }).notNull(),
    profileRole: varchar("profile_role", { length: 50 }).notNull(),
    age: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.userId],
      name: "profiles_user_id_users_user_id_fk",
    }).onDelete("cascade"),
  ]
);

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.userId],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
}));
