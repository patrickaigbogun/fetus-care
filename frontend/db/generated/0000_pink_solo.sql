CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"creator_id" varchar NOT NULL,
	"professional_id" varchar NOT NULL,
	"professional_name" varchar NOT NULL,
	"professional_phone_number" varchar NOT NULL,
	"last_message_id" uuid
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sent_by" varchar NOT NULL,
	"sender_account_type" text NOT NULL,
	"reciepient" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"text" text,
	"pdf" text,
	"image" text,
	"audio" text,
	"video" text,
	"file" text,
	"chat_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_last_message_id_messages_id_fk" FOREIGN KEY ("last_message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;