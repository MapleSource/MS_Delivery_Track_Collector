import React from "react";
import Styles from "./Subtitle.module.css";

interface SubtitleProps {
  subtitle: string;
  size?: number;
  color?: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ subtitle, size, color }) => {
  const { text } = Styles;
  const lineHeight = size ? size + 4 : "28px";
  const SubtitleStyles = {
    fontSize: size || "24px",
    color: color || "var(--text)",
    lineHeight: lineHeight || "28px",
  };

  return (
    <h1 className={text} style={SubtitleStyles}>
      {subtitle}
    </h1>
  );
};

export default Subtitle;
