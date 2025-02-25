import { IconSend } from "@tabler/icons-react";
import React, { type ReactNode } from "react";
import ChatSidebar from "./_components/sidebar";

type Props = {
  children: ReactNode;
};

const ChatLayout = ({ children }: Props) => {
  return (
    <div className="w-full flex">
      <ChatSidebar />
      {children}
    </div>
  );
};

export default ChatLayout;
