import React from "react";
import Styles from "./StatusTag.module.css";
import Image from "next/image";
import Grid from "@/stories/Layout/Grid/Grid";
import { IStatus } from "@/types/IStatus";

interface StatusTagProps {
  status: IStatus;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const { tag } = Styles;

  return (
    <div
      className={tag}
      style={{
        backgroundColor: status.color,
        borderColor: status.color,
      }}
    >
      <Grid gridTemplateColumns="20px auto" columnGap="8px">
        <Image src={status.icon} alt={status.name} width={20} height={20} />
        <p>{status.name}</p>
      </Grid>
    </div>
  );
};

export default StatusTag;
