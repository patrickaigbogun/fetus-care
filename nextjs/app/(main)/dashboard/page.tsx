import {
  IconInbox,
  IconPhoneCall,
  IconCalendarFilled,
  IconBrandItch,
} from "@tabler/icons-react";
import Link from "next/link";

const sidebarStuff = [
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

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sidebarStuff.map((item, index) => (
          <Link key={index} href={item.href} className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center space-y-4">
              <item.icon className="w-12 h-12 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {item.label}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
