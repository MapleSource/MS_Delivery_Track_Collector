import React, { ReactNode } from "react";
import Styles from "./Portal.module.css";

interface PortalProps {
  children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const { grid } = Styles;

  return <section className={grid}>{children}</section>;
};

export default Portal;
