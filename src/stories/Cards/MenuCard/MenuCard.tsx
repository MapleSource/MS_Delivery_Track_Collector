import React from "react";
import Styles from "./MenuCard.module.css";
import Grid from "@/stories/Layout/Grid/Grid";
import Label from "@/stories/Typography/Label/Label";
import Subtitle from "@/stories/Typography/Subtitle/Subtitle";
import Link from "next/link";
import { IMenuCard } from "@/types/IMenuCard";
import Image from "next/image";

const MenuCard: React.FC<IMenuCard> = ({ title, subtitle, image, url }) => {
  const { card, img, content } = Styles;

  return (
    <Link href={url} className={card}>
      <Grid gridTemplateColumns="1fr" gridTemplateRows="3fr 2fr">
        <div className={img}>
          <Image src={image} alt={title} fill className={img} />
        </div>
        <div className={content}>
          <Subtitle subtitle={title} />
          <Label label={subtitle} />
        </div>
      </Grid>
    </Link>
  );
};

export default MenuCard;
