import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

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
  professional_id: varchar("professional_id").notNull(),
  professional_name: varchar("professional_name").notNull(),
  professional_phone_number: varchar("professional_phone_number").notNull(),
  professional_image: varchar("professional_image").notNull(),
  last_message_id: uuid("last_message_id").references(() => messages.id),
});

export const chatsRelations = relations(chats, ({ many, one }) => ({
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

export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;
export type MessageWithRelations = Message & { chat: Chat };

export type Chat = InferSelectModel<typeof chats>;
export type NewChat = InferInsertModel<typeof chats>;
export type ChatWithRelations = Chat & {
  messages: Message[];
  lastMessage: Message;
};
