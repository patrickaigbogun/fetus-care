CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"creator_id" varchar NOT NULL,
	"professional_id" varchar NOT NULL,
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
CREATE TABLE "professionals" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"avatar" text,
	"field" text NOT NULL,
	"phone_number" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "professionals_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_last_message_id_messages_id_fk" FOREIGN KEY ("last_message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;