import React, { InputHTMLAttributes, LegacyRef, forwardRef } from "react";
import Styles from "./Input.module.css";
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef(function Input(
  {
    placeholder = "Input",
    type = "text",
    label = "",
    width = "",
    disabled,
    ...props
  }: InputProps,
  ref: LegacyRef<HTMLInputElement>
) {
  const { input_box, input, text } = Styles;
  return (
    <div className={input_box} style={{ width: width }}>
      {label && (
        <label className={text} htmlFor={label}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={input}
        ref={ref}
        {...props}
      />
    </div>
  );
});
