import React from "react";
import Styles from "./DeliveryTable.module.css";
import Spinner from "@/stories/Feedback/Spinner/Spinner";
import { Button } from "antd";

type HeaderDefinition = {
  header: string;
  key: string;
};

type DeliveryTableProps = {
  headers: HeaderDefinition[];
  data?: Record<string, any>[];
  gridTemplateColumns?: string;
  loading?: boolean;
  renderAction?: (row: Record<string, any>) => React.ReactNode; // Nueva prop para renderizar acciones
};

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  headers,
  data,
  gridTemplateColumns,
  loading,
  renderAction,
}) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const length = headers.length + (renderAction ? 1 : 0); // Ajustar columnas si hay acción
  const { table, head, cell } = Styles;
  const tableStyle = {
    gridTemplateColumns: gridTemplateColumns || `repeat(${length}, 1fr)`,
  };

  return (
    <div className={table} style={tableStyle}>
      {headers.map((column, index) => (
        <div key={index} className={head}>
          {column.header}
        </div>
      ))}
      {renderAction && <div className={head}>Acciones</div>}

      {loading ? (
        <div
          style={{
            gridColumn: `span ${length}`,
            textAlign: "center",
            padding: "16px",
            color: "#999",
          }}
        >
          <Spinner />
        </div>
      ) : hasData ? (
        data!.map((row, rowIndex) => (
          <>
            {headers.map((column, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className={cell}>
                {row[column.key] ?? "-"}
              </div>
            ))}
            {renderAction && (
              <div key={`action-${rowIndex}`} className={cell}>
                {renderAction(row)}
              </div>
            )}
          </>
        ))
      ) : (
        <div
          style={{
            gridColumn: `span ${length}`,
            textAlign: "center",
            padding: "16px",
            color: "#999",
          }}
        >
          No se encontraron resultados.
        </div>
      )}
    </div>
  );
};

export default DeliveryTable;
