"use client";
import { Chat } from "@/types/chats";
import { Button } from "@radix-ui/themes";
import {
  IconInbox,
  IconLoader,
  IconMenu,
  IconRobot,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useChats } from "@/hooks/use-chats";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { getAllProfessionals } from "@/server/get-all-professionals";
import { toast } from "sonner";

const ChatSidebar = () => {
  const { chats, loading, error, createChat } = useChats();
  const pathname = usePathname();
  const formatMessageTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const {
    isPending,
    data: professionals,
    error: fetchProfessionsError,
  } = useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      try {
        return await getAllProfessionals();
      } catch (error) {
        console.error("ERROR FETCHING PROFESSIONALS", error);
        toast.error("Can't get professionals list at the moment");
        return null;
      }
    },
  });

  console.log("PROFESSIONALS", professionals)
  return (
    <div className="w-[40%] border-r bg-purple-100/60 sticky top-0 z-10 dflex flex-col gap-2 h-screen overflow-y-scroll">
      <div className="flex flex-col gap-2 sticky top-0 bg-white p-4">
        <div className="flex items-center justify-between w-full pb-4">
          <h4 className="text-xl font-bold">Chat</h4>
          <div className="flex gap-2 align-middle place-items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2">
                  <IconSquareRoundedPlusFilled width={28} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" max-w-[300px] w-full bg-white rounded-3xl max-h-[40dvh]">
                <div className="w-full flex flex-col gap-6">
                  <h4 className="p-4 font-bold text-left ">Chat with</h4>
                  {isPending ? (
                    <div className="p-16 flex align-middle place-items-center w-full">
                      <IconLoader size={24} className="animate-spin" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {professionals ? (
                        professionals.professionals.map((professional: any) => {
                          return (
                            <button
                              key={professional.id}
                              className="p-2 px-4 rounded-2xl w-full hover:bg-purple-100"
                              onClick={async () => await createChat()}
                            >

                              {professional.name}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-red-500">
                          {fetchProfessionsError?.message ??
                            "No professionals found"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="p-2">
              <IconMenu width={28} />
            </button>
          </div>
        </div>
        <Link href={"/dashboard/chat/ai"} className="w-full">
          <Button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium p-1 w-full rounded-2xl transition-colors justify-start`}
            variant={"/dashboard/chat/ai" === pathname ? "solid" : "soft"}
          >
            <IconRobot className="h-5 w-5" />
            <h4>Fetus ai</h4>
          </Button>
        </Link>
        <Link href={"/dashboard/chat"} className="w-full">
          <Button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium p-1 w-full rounded-2xl transition-colors justify-start`}
            variant={"/dashboard/chat" === pathname ? "solid" : "soft"}
          >
            <IconInbox className="h-5 w-5" />
            <h4>Inbox</h4>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {loading ? (
          <div className="text-center p-4">Loading chats...</div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : (
          chats.map((chat) => (
            <Link
              href={`/dashboard/chat/${chat.id}`}
              key={chat.id}
              className="w-full p-3 text-sm hover:bg-purple-200/60 transition-colors rounded-2xl flex items-center gap-3"
            >
              <Image
                src={chat.professional.avatar || "/logo.svg"}
                alt={`${chat.professional.name}'s avatar`}
                width={30}
                height={30}
                className="rounded-full"
              />
              <div className="flex flex-col items-start gap-1 flex-1 overflow-hidden">
                <h4 className="font-semibold">{chat.professional.name}</h4>
                <p className="text-gray-600 text-xs truncate w-full">
                  {chat.content?.lastMessage?.text || "No messages yet"}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {chat.content?.lastMessage
                  ? formatMessageTime(chat.content?.lastMessage.createdAt)
                  : ""}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
