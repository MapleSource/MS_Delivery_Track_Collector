import React, { ReactNode } from "react";
import Styles from "./Dashboard.module.css";

interface DashboardProps {
  children: ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const { grid } = Styles;

  return <section className={grid}>{children}</section>;
};

export default Dashboard;
