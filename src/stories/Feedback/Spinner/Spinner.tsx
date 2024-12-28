import React from "react";
import Styles from "./Spinner.module.css";

const Spinner: React.FC = () => {
  const { loader } = Styles;

  return <span className={loader} />;
};

export default Spinner;
