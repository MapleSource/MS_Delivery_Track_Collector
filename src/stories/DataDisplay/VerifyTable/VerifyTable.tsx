import React from "react";
import Styles from "./VerifyTable.module.css";
import Spinner from "@/stories/Feedback/Spinner/Spinner";

type HeaderDefinition = {
  header: string;
  key: string;
};

type VerifyTableProps = {
  headers: HeaderDefinition[];
  data?: Record<string, any>[];
  gridTemplateColumns?: string;
  loading?: boolean;
  invalid_status: string;
  valid_status: string;
  onStatusChange: (id: string, newStatus: string) => void;
};

const VerifyTable: React.FC<VerifyTableProps> = ({
  headers,
  data,
  gridTemplateColumns,
  loading,
  invalid_status,
  valid_status,
  onStatusChange,
}) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const length = headers.length + 1;
  const {
    table,
    tableContainer,
    head,
    cell,
    invalid,
    valid,
    select,
    selectDisabled,
  } = Styles;
  const tableStyle = {
    gridTemplateColumns: gridTemplateColumns || `repeat(${length}, 1fr)`,
  };

  return (
    <div className={tableContainer}>
      <div className={table} style={tableStyle}>
        {headers.map((column, index) => (
          <div key={index} className={head}>
            {column.header}
          </div>
        ))}
        <div className={head}>Acciones</div>

        {loading ? (
          <div
            style={{
              gridColumn: `span ${headers.length + 1}`,
              textAlign: "center",
              padding: "16px",
              color: "#999",
            }}
          >
            <Spinner />
          </div>
        ) : hasData ? (
          data!.map((row, rowIndex) => {
            const status = row["package_status"];
            const isValid = status === valid_status;
            const rowStyle = isValid ? valid : invalid;

            return (
              <React.Fragment key={rowIndex}>
                {headers.map((column, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${cell} ${
                      column.key === "package_status" ? rowStyle : ""
                    }`}
                  >
                    {row[column.key] ?? "-"}
                  </div>
                ))}
                <div className={cell}>
                  <select
                    disabled={isValid}
                    className={isValid ? selectDisabled : select}
                    value={status}
                    onChange={(e) =>
                      onStatusChange(row["package_id"], e.target.value)
                    }
                  >
                    <option value={invalid_status}>{invalid_status}</option>
                    <option value={valid_status}>{valid_status}</option>
                    <option value="No se recibio">No se recibió</option>
                  </select>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: `span ${headers.length + 1}`,
              textAlign: "center",
              padding: "16px",
              color: "#999",
            }}
          >
            No se encontraron resultados.
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyTable;
