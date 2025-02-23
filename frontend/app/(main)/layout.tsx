import React, { type ReactNode } from "react";
import MainSidebar from "@/components/dashboard/main-sidebar";

type Props = {
  children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="relative flex">
      <MainSidebar />
      {children}
    </div>
  );
};

export default MainLayout;
