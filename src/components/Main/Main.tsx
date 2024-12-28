import { menu } from "@/data/menuCards";
import MenuCard from "@/stories/Cards/MenuCard/MenuCard";
import Grid from "@/stories/Layout/Grid/Grid";
import Module from "@/stories/Layout/Module/Module";
import React from "react";

const Main: React.FC = () => {
  return (
    <Module>
      <Grid customClass="menu_grid" rowGap="20px">
        {menu.map((item, index) => {
          return (
            <MenuCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
              url={item.url}
            />
          );
        })}
      </Grid>
    </Module>
  );
};

export default Main;
