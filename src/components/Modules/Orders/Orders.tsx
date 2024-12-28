import { orderMenu } from "@/data/menuCards";
import MenuCard from "@/stories/Cards/MenuCard/MenuCard";
import Grid from "@/stories/Layout/Grid/Grid";
import Module from "@/stories/Layout/Module/Module";
import Title from "@/stories/Typography/Title/Title";
import React from "react";

// interface OrdersProps {
// }

const Orders: React.FC = () => {
  return (
    <Module>
      <Title title="Ordenes" />
      <Grid customClass="menu_grid" rowGap="20px">
        {orderMenu.map((item, index) => {
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

export default Orders;
