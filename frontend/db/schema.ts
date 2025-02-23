import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const professionals = pgTable("professionals", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  field: text("field").notNull(),
  phone_number: text("phone_number").notNull(),
  email: text("email").notNull().unique(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sent_by: varchar("sent_by").notNull(),
  sender_account_type: text("sender_account_type", {
    enum: ["patient", "professional"],
  }).notNull(),
  reciepient: varchar("reciepient").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  deleted: boolean("deleted").default(false),
  deleted_at: timestamp("deleted_at"),
  text: text("text"),
  pdf: text("pdf"),
  image: text("image"),
  audio: text("audio"),
  video: text("video"),
  file: text("file"),
  chat_id: uuid("chat_id").notNull(),
});

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  creator_id: varchar("creator_id").notNull(),
  professional_id: varchar("professional_id")
    .notNull()
    .references(() => professionals.id),
  last_message_id: uuid("last_message_id").references(() => messages.id),
});

// Relationships
export const professionalsRelations = relations(professionals, ({ many }) => ({
  chats: many(chats),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  professional: one(professionals, {
    fields: [chats.professional_id],
    references: [professionals.id],
  }),
  messages: many(messages),
  lastMessage: one(messages, {
    fields: [chats.last_message_id],
    references: [messages.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chat_id],
    references: [chats.id],
  }),
}));

export type Professional = InferSelectModel<typeof professionals>;
export type NewProfessional = InferInsertModel<typeof professionals>;
export type ProfessionalWithRelations = Professional & { chats: Chat[] };

export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;
export type MessageWithRelations = Message & { chat: Chat };

export type Chat = InferSelectModel<typeof chats>;
export type NewChat = InferInsertModel<typeof chats>;
export type ChatWithRelations = Chat & {
  professional: Professional;
  messages: Message[];
  lastMessage: Message;
};
