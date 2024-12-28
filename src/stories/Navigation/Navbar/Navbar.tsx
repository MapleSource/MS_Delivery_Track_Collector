import React from "react";
import Styles from "./Navbar.module.css";
import { useSession } from "next-auth/react";
import UserCard from "@/stories/Cards/UserCard/UserCard";
import Grid from "@/stories/Layout/Grid/Grid";
import Label from "@/stories/Typography/Label/Label";

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const { movil_data, content, username } = Styles;

  return (
    <div className={content}>
      <Grid gridTemplateColumns="auto  1fr auto" columnGap="0px">
        <div className={movil_data}>
          <Label label="Bienvenido:" />
          <p className={username}>
            {session ? <b>{session.user?.nickname}</b> : <b>-</b>}
          </p>
        </div>
        <div />
        <UserCard name={session?.user?.name || "Indefinido"} />
      </Grid>
    </div>
  );
};

export default Navbar;
