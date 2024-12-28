import React, { ReactNode } from "react";
import Styles from "./Grid.module.css";

interface GridProps {
  children: ReactNode;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  customClass?: string;
  columnGap?: string;
  rowGap?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  gridTemplateColumns,
  gridTemplateRows,
  customClass = "",
  columnGap,
  rowGap,
}) => {
  const gridStyle = {
    gridTemplateColumns: customClass
      ? ""
      : gridTemplateColumns || `repeat(2, 1fr)`,
    gridTemplateRows: gridTemplateRows || "auto",
    gridColumnGap: columnGap || "20px",
    gridRowGap: rowGap || columnGap,
  };

  return (
    <div style={gridStyle} className={`${Styles.grid} ${Styles[customClass]}`}>
      {children}
    </div>
  );
};

export default Grid;
