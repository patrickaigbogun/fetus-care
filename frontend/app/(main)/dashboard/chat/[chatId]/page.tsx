"use client";
import { getChatInfo } from "@/lib/chat/get-chat-info";
import ChatNavbar from "./_components/chat-nav";
import ChatMessages from "./_components/chat-messages";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconLoader } from "@tabler/icons-react";
import { useActiveChat } from "@/hooks/use-active-chat";
import { toast } from "sonner";
import SendMessage from "./_components/send-message";

const Chat = ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = use(params);

  const { messages, loading, sendMessage } = useActiveChat(chatId);

  // Example send usage
  const handleSend = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const {
    isPending,
    data: chatInfo,
    isError,
    error,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      return await getChatInfo(chatId);
    },
  });

  console.log("CHAT INFO", chatInfo);

  if (isPending)
    return (
      <div className="hfull w-full flex align-middle place-items-center justify-center text-neutral-700">
        <IconLoader size={24} className="animate-spin" />
      </div>
    );

  if (!chatInfo)
    return (
      <div className="text-2xl font-semibold w-full flex align-middle place-items-center justify-center text-neutral-700">
        Chat not found
      </div>
    );

  if (isError) {
    console.log("ERROR FETCHING CHAT", error);
    return <div>Something happened</div>;
  }

  const professional = {
    id: chatInfo.professional_id,
    name: chatInfo.professional_name,
    image: chatInfo.professional_image,
    phone_number: chatInfo.professional_phone_number,
  };

  return (
    <div className="flex flex-col h-screen border w-full">
      <ChatNavbar professional={professional} />
      <ChatMessages messages={messages} professional={professional} />
      <SendMessage onSendMessage={handleSend} />
    </div>
  );
};

export default Chat;
