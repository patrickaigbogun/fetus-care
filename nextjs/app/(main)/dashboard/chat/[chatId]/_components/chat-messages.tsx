import React from "react";
import PatientChatBubble from "./patient-bubble";
import ProfessionalBubble from "./professional-bubble";
import { Message } from "@/db/schema";
import { useUser } from "@/hooks/use-user";

type Props = {
  messages: Message[];
  professional: {
    id: string;
    name: string;
    image: string;
    phone_number: string;
  };
};

const ChatMessages = ({ messages, professional }: Props) => {
  const { user } = useUser();
  if (!messages || messages.length === 0) {
    return (
      <div className="text-2xl font-semibold h-full w-full flex align-middle place-items-center justify-center text-neutral-700">
        Send a message to {professional.name}
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-auto p-4 px-44">
      {messages.map((message) =>
        message.sent_by === `${user?.id}` ? (
          <PatientChatBubble key={message.id} message={message} />
        ) : (
          <ProfessionalBubble
            key={message.id}
            message={message}
            professional={professional}
          />
        )
      )}
    </div>
  );
};

export default ChatMessages;
