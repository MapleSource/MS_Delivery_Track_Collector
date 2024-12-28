import React, { ReactNode } from "react";
import Menu from "@/stories/Navigation/Menu/Menu";
import Portal from "@/stories/Layout/Portal/Portal";
import Navbar from "@/stories/Navigation/Navbar/Navbar";
import Dashboard from "@/stories/Layout/Dashboard/Dashboard";
import Breadcrumb from "../../stories/Navigation/Breadcrum/Breadcrum";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Portal>
      <Menu />
      <Dashboard>
        <Navbar />
        <Breadcrumb />
        <main>{children}</main>
      </Dashboard>
    </Portal>
  );
};

export default Layout;
