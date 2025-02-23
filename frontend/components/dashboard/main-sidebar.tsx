"use client";
import React, { useState } from "react";
import {
  IconHomeFilled,
  IconInbox,
  IconPhoneCall,
  IconBrandItch,
  IconCalendar,
  IconCalendarFilled,
  IconLogout,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useUser } from "@/hooks/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const sidebarStuff = [
  {
    icon: IconHomeFilled,
    label: "Home",
    href: "/dashboard",
  },
  {
    icon: IconInbox,
    label: "Chat",
    href: "/dashboard/chat",
  },
  {
    icon: IconPhoneCall,
    label: "Calls",
    href: "/dashboard/video",
  },
  {
    icon: IconCalendarFilled,
    label: "Schedule",
    href: "/dashboard/schedule",
  },
  {
    icon: IconBrandItch,
    label: "Hub",
    href: "/dashboard/reception",
  },
];

const MainSidebar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useUser();

  return (
    <div
      className={`${
        isExpanded ? "w-64" : "w-[5dvw]"
      } transition-all duration-300 ease-in-out border-r h-screen sticky top-0 z-10 p-1 flex flex-col justify-start gap-6 bg-purple-200/60`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-900 p-1 aspect-square w-fit rounded-2xl"
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          width={44}
          className="max-w-[32px]"
          height={44}
        />
      </button>
      <div className="flex flex-col gap-2">
        {sidebarStuff.map((item) => (
          <Link key={item.label} href={item.href} className="w-full">
            <button
              className={`items-center  text-sm font-medium w-full flex align-middle place-items-center  rounded-2xl transition-all duration-300 ease-in-out ${
                !isExpanded
                  ? "aspect-square max-w-[50px] justify-center gap-2 p-2"
                  : " justify-start gap-4 p-2"
              } ${
                pathname === item.href
                  ? "bg-purple-200 text-purple-900"
                  : "text-neutral-900 hover:text-neutral-900 hover:bg-purple-200"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? "opacity-100  flex" : "hidden opacity-0"
                }`}
              >
                {item.label}
              </span>
            </button>
          </Link>
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full focus:outline-none">
            <Image
              src={
                "https://images.unsplash.com/photo-1570158268183-d296b2892211?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWZyaWNhbnxlbnwwfHwwfHx8MA%3D%3D"
              }
              alt="User Profile"
              width={44}
              height={44}
              className="rounded-full aspect-square object-cover"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user && (
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium">{user.username}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <button
              onClick={() => {
                Cookies.remove("token", { path: "/" });
                Cookies.remove("user", { path: "/" });
                window.location.href = "/";
              }}
            >
              <IconLogout className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MainSidebar;
