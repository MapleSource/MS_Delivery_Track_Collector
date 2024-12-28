import React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Grid from "@/stories/Layout/Grid/Grid";
import Image from "next/image";
import Styles from "./LastUpdated.module.css";

interface LastUpdatedProps {
  datetime?: string;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({
  datetime = "2024-12-17T09:28:51.686+00:00",
}) => {
  const lastUpdated = parseISO(datetime);
  const timeAgo = formatDistanceToNow(lastUpdated, {
    addSuffix: true,
    locale: es,
  });
  const { text } = Styles;

  return (
    <Grid gridTemplateColumns="24px auto 1fr" columnGap="15px">
      <Image src="/order/updated.png" alt="" width={24} height={24} />
      <p className={text}>
        Última actualización: <strong>{timeAgo}</strong>
      </p>
    </Grid>
  );
};

export default LastUpdated;
