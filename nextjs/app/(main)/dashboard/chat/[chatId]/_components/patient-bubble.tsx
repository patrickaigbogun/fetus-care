import { Message } from "@/db/schema";

const PatientChatBubble: React.FC<{ message: Message }> = ({ message }) => (
  <div className="w-full flex justify-end place-items-center align-middle min-h-5 py-1">
    <div className="rounded-2xl px-4 py-2 ml-12 max-w-[70%] bg-purple-100">
      <p className="text-[15px] leading-relaxed ">{message.text}</p>
    </div>
  </div>
);

export default PatientChatBubble;
