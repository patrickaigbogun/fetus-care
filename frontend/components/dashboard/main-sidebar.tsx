"use client";
import React, { useState } from "react";
import {
  IconHomeFilled,
  IconInbox,
  IconPhoneCall,
  IconBrandItch,
  IconCalendar,
  IconCalendarFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    </div>
  );
};

export default MainSidebar;
