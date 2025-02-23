import { useState, useEffect } from "react";
import { liveSupabase } from "@/supabase/client";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useUser } from "./use-user";
import { Chat, ChatWithRelations, NewChat } from "@/db/schema";

export const useChats = () => {
  const [chats, setChats] = useState<ChatWithRelations[]>([]);
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
            lastMessage:messages!last_message_id(*)
          `
          )
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!data) {
          setChats([]);
          setError("No chats found");
          return;
        }
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

  const createChat = async (professional: {
    id: string;
    name: string;
    image: string;
    phone_number: string;
  }) => {
    if (!user) return;

    try {
      const newChat: NewChat = {
        professional_id: professional.id,
        professional_name: professional.name,
        professional_phone_number: professional.phone_number,
        professional_image:
          professional.image ??
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
        creator_id: `${user.id}`,
        id: v4(),
      };

      console.log("NEW", newChat);

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
