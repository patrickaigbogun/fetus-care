import React, { type ReactNode } from "react";
import MainSidebar from "@/components/dashboard/main-sidebar";
import Header from "@/components/dashboard/header";

type Props = {
  children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div>
      <Header />
      <div className="relative flex">
        <MainSidebar />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
