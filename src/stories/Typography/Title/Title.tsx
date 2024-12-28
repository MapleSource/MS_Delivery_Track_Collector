import React from "react";
import Styles from "./Title.module.css";

interface TitleProps {
  title: string;
  size?: string;
  color?: string;
}

const Title: React.FC<TitleProps> = ({ title, size, color }) => {
  const { text } = Styles;
  const TitleStyles = {
    fontSize: size || "32px",
    color: color || "var(--text)",
  };

  return (
    <h1 className={text} style={TitleStyles}>
      {title}
    </h1>
  );
};

export default Title;
