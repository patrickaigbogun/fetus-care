import React from "react";
import PatientChatBubble from "./patient-bubble";
import ProfessionalBubble from "./professional-bubble";
import { Message, Professional } from "@/db/schema";

type Props = {
  messages: Message[];
  professional: Professional;
};

const ChatMessages = ({ messages, professional }: Props) => {
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
        message.sent_by === "user_2tQCR1zmMyeCvizlZJCrCAM0PgU" ? (
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
