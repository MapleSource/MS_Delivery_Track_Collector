import React from "react";
import Styles from "./Button.module.css";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  const { button } = Styles;

  return (
    <button disabled={disabled} className={button} onClick={() => onClick()}>
      {label}
    </button>
  );
};

export default Button;
