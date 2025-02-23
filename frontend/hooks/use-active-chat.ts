import { useState, useEffect } from "react";
import { liveSupabase } from "@/supabase/client";
import { Message, Chat } from "@/db/schema";
import { useUser } from "./use-user";

export const useActiveChat = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch chat information
        const { data: chatData, error: chatError } = await liveSupabase
          .from("chats")
          .select("*")
          .eq("id", chatId)
          .single();

        if (chatError) throw chatError;
        setChatInfo(chatData);

        // Fetch initial messages
        const { data: messagesData, error: messagesError } = await liveSupabase
          .from("messages")
          .select("*")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) fetchInitialData();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const messagesChannel = liveSupabase
      .channel(`messages:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setMessages((prev) => [...prev, payload.new as Message]);
              break;
            case "UPDATE":
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === payload.new.id ? (payload.new as Message) : msg
                )
              );
              break;
            case "DELETE":
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
    };
  }, [chatId]);

  const sendMessage = async (content: string) => {
    if (!user || !chatInfo) {
      setError("User or chat information not available");
      return;
    }

    try {
      // Determine sender type
      const isProfessional =
        String(user.id) === String(chatInfo.professional_id);
      const recipientId = isProfessional
        ? chatInfo.creator_id
        : chatInfo.professional_id;

      const newMessage = {
        sent_by: user.id,
        sender_account_type: isProfessional ? "professional" : "patient",
        reciepient: recipientId,
        chat_id: chatId,
        text: content,
      };

      const { error } = await liveSupabase.from("messages").insert(newMessage);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    }
  };

  return { messages, chatInfo, loading, error, sendMessage };
};
