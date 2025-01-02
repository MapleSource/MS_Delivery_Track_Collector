import React from "react";
import Styles from "./Button.module.css";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  background?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  background,
}) => {
  const { button } = Styles;
  const buttonStyles = {
    background: disabled ? "var(--background)" : background ? background : "",
    border: disabled ? "1px solid #ccc" : "",
    cursor: disabled ? "not-allowed" : "pointer",
  };

  return (
    <button
      disabled={disabled}
      className={button}
      style={buttonStyles}
      onClick={() => onClick()}
    >
      {label}
    </button>
  );
};

export default Button;
