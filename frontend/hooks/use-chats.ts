import { useState, useEffect } from "react";
import type { Chat } from "@/types/chats";
import { liveSupabase } from "@/supabase/client";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useUser } from "./use-user";

interface UseChatsReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  createChat: () => Promise<void>;
}

export const useChats = (): UseChatsReturn => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchChats = async () => {
      try {
        setLoading(true);
        const { data, error } = await liveSupabase
          .from("chats")
          .select(
            `
            *,
            professional:professionals(*),
            lastMessage:messages!last_message_id(*)
          `
          )
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setChats(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Subscribe to changes in chats
    const chatsSubscription = liveSupabase
      .channel(`chats-channel:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            if (payload.new.creator_id === user.id) {
              const { data: updatedChat } = await liveSupabase
                .from("chats")
                .select(
                  `
                  *,
                  professional:professionals(*),
                  lastMessage:messages!last_message_id(*)
                `
                )
                .eq("id", payload.new.id)
                .single();

              setChats((current) => [
                ...(updatedChat ? [updatedChat] : []),
                ...current,
              ]);
            }
          } else if (payload.eventType === "UPDATE") {
            const { data: updatedChat } = await liveSupabase
              .from("chats")
              .select(
                `
                *,
                professional:professionals(*),
                lastMessage:messages!last_message_id(*)
              `
              )
              .eq("id", payload.new.id)
              .single();

            setChats((current) =>
              current.map((chat) =>
                chat.id === payload.new.id && updatedChat ? updatedChat : chat
              )
            );
          } else if (payload.eventType === "DELETE") {
            setChats((current) =>
              current.filter((chat) => chat.id === payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Subscribe to changes in messages that might affect last_message
    const messagesSubscription = liveSupabase
      .channel(`messages-channel:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const { chat_id } = payload.new;

          // Fetch updated chat when a new message is added
          const { data: updatedChat } = await liveSupabase
            .from("chats")
            .select(
              `
            *,
            professional:professionals(*),
            lastMessage:messages!last_message_id(*)
          `
            )
            .eq("id", chat_id)
            .single();

          if (updatedChat) {
            setChats((current) =>
              current.map((chat) => (chat.id === chat_id ? updatedChat : chat))
            );
          }
        }
      )
      .subscribe();

    return () => {
      chatsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, [user]);

  const createChat = async () => {
    if (!user) return;

    try {
      const newChat = {
        professional_id: "2",
        creator_id: user.id,
        id: v4(),
      };
      
      

      const { error } = await liveSupabase
        .from("chats")
        .insert(newChat)
        .select()
        .single();

      if (error) throw error;

      router.push(`/dashboard/chat/${newChat.id}`);
    } catch (err) {
      console.error("Create Chat Error:", err);
      setError(err instanceof Error ? err.message : "Failed to create chat");
    }
  };

  return { chats, loading, error, createChat };
};
