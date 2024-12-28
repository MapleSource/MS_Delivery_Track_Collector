import React from "react";
import Styles from "./Label.module.css";

interface LabelProps {
  label: string;
  size?: string;
  weight?: string;
  color?: string;
}

const Label: React.FC<LabelProps> = ({ label, size, weight, color }) => {
  const { text } = Styles;
  const LabelStyles = {
    fontSize: size || "14px",
    color: color || "var(--blured-text)",
    fontWeight: weight || "400",
  };

  return (
    <p className={text} style={LabelStyles}>
      {label}
    </p>
  );
};

export default Label;
