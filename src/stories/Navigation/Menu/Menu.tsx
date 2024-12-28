import React from "react";
import Link from "next/link";
import Styles from "./Menu.module.css";
import Image from "next/image";
import { navigation } from "@/data/navigation";
import ThemeToggle from "@/stories/Inputs/Toggle/ThemeToggle/ThemeToggle";
import { INavigation } from "@/types/INavigation";
import Divider from "@/stories/Utilities/Divider/Divider";
import Logout from "@/stories/Buttons/Logout/Logout";

const Menu: React.FC = () => {
  const { content, nav, icon, bottom, movil_data } = Styles;

  return (
    <section className={content}>
      <div className={movil_data}>
        <Image src="/logo-2.png" alt="logo" width={196} height={130} />
        <Divider />
      </div>
      {navigation.map((item: INavigation, index: number) => (
        <Link href={item.path} key={index}>
          <nav className={nav}>
            <Image
              className={icon}
              src={item.icon}
              alt={item.name}
              width={30}
              height={30}
            />
            <p>{item.name}</p>
          </nav>
        </Link>
      ))}
      <div className={bottom}>
        <Logout />
        <div className={movil_data}>
          <Divider />
          <ThemeToggle />
        </div>
      </div>
    </section>
  );
};

export default Menu;
