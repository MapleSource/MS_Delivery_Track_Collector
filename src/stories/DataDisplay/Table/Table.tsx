import React from "react";
import Styles from "./Table.module.css";
import Spinner from "@/stories/Feedback/Spinner/Spinner";

type HeaderDefinition = {
  header: string;
  key: string;
};

type TableProps = {
  headers: HeaderDefinition[];
  data?: Record<string, any>[];
  gridTemplateColumns?: string;
  loading?: boolean;
};

const Table: React.FC<TableProps> = ({
  headers,
  data,
  gridTemplateColumns,
  loading,
}) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const length = headers.length;
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

      {loading ? (
        <div
          style={{
            gridColumn: `span ${headers.length}`,
            textAlign: "center",
            padding: "16px",
            color: "#999",
          }}
        >
          <Spinner />
        </div>
      ) : hasData ? (
        data!.map((row, rowIndex) =>
          headers.map((column, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={cell}>
              {row[column.key] ?? "-"}
            </div>
          ))
        )
      ) : (
        <div
          style={{
            gridColumn: `span ${headers.length}`,
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

export default Table;
