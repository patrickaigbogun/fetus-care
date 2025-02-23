import { Chat, ChatWithRelations } from "@/db/schema";
import { liveSupabase } from "@/supabase/client";

export const getChatInfo = async (chatId: string) => {
  const { data, error } = await liveSupabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single();

  if (error) {
    console.error("Error fetching chat info:", error);
    return null;
  }

  return data as ChatWithRelations;
};
