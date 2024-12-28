import React, { ReactNode } from "react";
import Styles from "./Module.module.css";

interface ModuleProps {
  children: ReactNode;
}

const Module: React.FC<ModuleProps> = ({ children }) => {
  const { module } = Styles;

  return <section className={module}>{children}</section>;
};

export default Module;
