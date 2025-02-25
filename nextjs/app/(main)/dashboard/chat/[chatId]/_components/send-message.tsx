"use client";

import { useActiveChat } from "@/hooks/use-active-chat";
import {
  IconMicrophoneFilled,
  IconSend,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import React, { useState } from "react";

const SendMessage = ({
  onSendMessage,
}: {
  onSendMessage: (text: string) => Promise<void>;
}) => {
  const [text, setText] = useState<string>("");

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto relative justify-between place-items-center align-middle flex gap-2">
        <button className="p-4 aspect-square bg-black/10 rounded-full transition-colors">
          <IconSquareRoundedPlusFilled className="w-5 h-5" />
        </button>
        <textarea
          value={text}
          rows={2}
          placeholder="Type your message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSendMessage(text);
              setText("");
            }
          }}
          className="w-full p-3 border-2 rounded-3xl outline-none resize-none text-sm text-neutral-700 placeholder:text-neutral-400"
        />
        <button
          className={`p-7 aspect-square ${
            text ? "bg-purple-500" : "bg-black/10"
          } rounded-full transition-colors relative`}
          onClick={() => {
            if (text.trim()) {
              onSendMessage(text);
              setText("");
            }
          }}
        >
          <IconSend
            color={"#fff"}
            className={`w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out duration-300 ${
              text
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 scale-0 -rotate-90"
            }`}
          />
          <IconMicrophoneFilled
            className={`w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out duration-300 ${
              !text
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 scale-0 rotate-90"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default SendMessage;
