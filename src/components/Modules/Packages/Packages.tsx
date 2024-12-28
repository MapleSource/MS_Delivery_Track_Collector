import { packageMenu } from "@/data/menuCards";
import MenuCard from "@/stories/Cards/MenuCard/MenuCard";
import Grid from "@/stories/Layout/Grid/Grid";
import Module from "@/stories/Layout/Module/Module";
import Title from "@/stories/Typography/Title/Title";
import React from "react";

const Packages: React.FC = () => {
  return (
    <Module>
      <Title title="Paquetes" />
      <Grid customClass="menu_grid" rowGap="20px">
        {packageMenu?.map((item, index) => {
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

export default Packages;
