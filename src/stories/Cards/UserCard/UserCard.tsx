import React from "react";
import Styles from "./UserCard.module.css";
import Grid from "@/stories/Layout/Grid/Grid";
import Image from "next/image";
import Label from "@/stories/Typography/Label/Label";

interface UserCardProps {
  name?: string;
}

const UserCard: React.FC<UserCardProps> = ({ name }) => {
  const { card, image, mail } = Styles;

  return (
    <div className={card}>
      <Grid gridTemplateColumns="30px auto">
        <Image
          src="/icon.png"
          alt=""
          width={30}
          height={30}
          className={image}
        />
        <div>
          <p className={mail}>{name}</p>
          <Label label="Administrador" size="12px" />
        </div>
      </Grid>
    </div>
  );
};

export default UserCard;
