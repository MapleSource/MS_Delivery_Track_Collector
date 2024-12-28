import React from "react";
import Grid from "@/stories/Layout/Grid/Grid";
import Image from "next/image";
import Label from "@/stories/Typography/Label/Label";
import { signOut } from "next-auth/react";
import Styles from "./Logout.module.css";

const Logout: React.FC = () => {
  const { button, icon, movil_data } = Styles;

  return (
    <button className={button} onClick={() => signOut()}>
      <Grid gridTemplateColumns="auto 25px" columnGap="0px">
        <Label label="Cerrar Sesión" />
        <div className={movil_data}>
          <Image
            className={icon}
            src="/logout.png"
            alt=""
            width={25}
            height={25}
          />
        </div>
      </Grid>
    </button>
  );
};

export default Logout;
