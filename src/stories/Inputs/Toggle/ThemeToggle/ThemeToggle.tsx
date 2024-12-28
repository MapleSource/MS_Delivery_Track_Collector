import { useEffect, useState } from "react";
import Styles from "./ThemeToggle.module.css";
import { themes } from "@/data/themes";
import { ITheme } from "@/types/ITheme";
import Image from "next/image";
import Grid from "@/stories/Layout/Grid/Grid";
import Label from "@/stories/Typography/Label/Label";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const {
    toggle,
    toggle_switch,
    toggle_switch_dark,
    icon_grid,
    icon,
    icon_dark,
  } = Styles;

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle(
        "dark-theme",
        storedTheme === "dark"
      );
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark-theme", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle(
      "dark-theme",
      newTheme === "dark"
    );
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button onClick={toggleTheme} className={toggle}>
      <div className={theme === "light" ? toggle_switch : toggle_switch_dark} />
      <Grid columnGap="10px">
        {themes.map((item: ITheme, index: number) => (
          <div className={icon_grid} key={index}>
            <Image
              src={item.icon}
              alt={item.theme}
              width={20}
              height={20}
              className={theme === "light" ? icon : icon_dark}
            />
            <Label label={item.theme} />
          </div>
        ))}
      </Grid>
    </button>
  );
};

export default ThemeToggle;
