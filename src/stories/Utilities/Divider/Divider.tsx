import React from "react";
import Styles from "./Divider.module.css";

interface DividerProps {
  margin?: string;
}

const Divider: React.FC<DividerProps> = ({ margin }) => {
  const { line } = Styles;
  const DividerStyle = {
    marginTop: margin || "20px",
    marginBottom: margin || "20px",
  };

  return <div style={DividerStyle} className={line} />;
};

export default Divider;
