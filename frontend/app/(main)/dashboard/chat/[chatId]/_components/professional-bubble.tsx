import { Message } from "@/db/schema";
import Image from "next/image";
import React from "react";

const ProfessionalBubble: React.FC<{
  message: Message;
  professional: {
    id: string;
    name: string;
    image: string;
    phone_number: string;
  };
}> = ({ message, professional }) => (
  <div className="w-full flex justify-start place-items-center align-middle min-h-5 py-1">
    <div className="flex justify-start items-start gap-4 max-w-xl  w-full">
      <Image
        src={professional.image ?? "/logo.svg"}
        alt={professional.name}
        width={26}
        height={26}
        className="rounded-full bg-purple-300 border-2 aspect-square "
      />
      <div className="rounded-2xl bg-gray-100 max-w-[70%]">
        <p className="text-[15px] leading-relaxed">{message.text}</p>
      </div>
    </div>
  </div>
);
export default ProfessionalBubble;
