import React, { ReactNode } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✖
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
