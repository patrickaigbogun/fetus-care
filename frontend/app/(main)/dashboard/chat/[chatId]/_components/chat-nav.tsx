import { Professional } from "@/db/schema";
import {
  IconDotsVertical,
  IconPhoneCall,
  IconVideoFilled,
} from "@tabler/icons-react";
import React from "react";

type Props = {
  professional: Professional;
};

const ChatNavbar = ({ professional }: Props) => {
  return (
    <div className="p-3 flex align-middle place-items-center justify-between">
      <div className="w-full text-center">
        <h4 className="text-lg font-semibold">{professional.name}</h4>
      </div>

      <div className="flex align-middle place-items-center justify-start gap-2">
        <button className="p-3 rounded-full aspect-square bg-purple-400/20">
          <IconPhoneCall size={22} />
        </button>
        <button className="p-3 rounded-full aspect-square bg-purple-400/20">
          <IconVideoFilled size={22} />
        </button>
        <button className="p-3 rounded-full aspect-square bg-purple-400/20">
          <IconDotsVertical size={22} />
        </button>
      </div>
    </div>
  );
};

export default ChatNavbar;
