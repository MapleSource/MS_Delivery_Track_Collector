import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadTemplateButton: React.FC = () => {
  const downloadTemplate = () => {
    const worksheetData = [
      [
        "Nombre_remitente*",
        "Direccion_remitente*",
        "Telefono_remitente",
        "Correo_electronico_remitente",
        "Ciudad",
        "Estado",
        "Pais",
        "Referencia",
        "correo_electronico",
        "telefono",
        "Peso_del_paquete",
        "Dimensiones",
      ],
      [
        "Ejemplo: Juan Pérez",
        "Ejemplo: Av. Siempre Viva 123",
        "Ejemplo: 12345",
        "Ejemplo: Centro",
        "Ejemplo: Ciudad de México",
        "Ejemplo: CDMX",
        "Ejemplo: México",
        "Ejemplo: Cerca de la plaza",
        "Ejemplo: correo@ejemplo.com",
        "Ejemplo: 1234567890",
        "Ejemplo: 1",
        "Ejemplo: 10x10x10",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "cargar_orden_runner.xlsx");
  };

  return (
    <button onClick={downloadTemplate} className="download-button">
      Descargar Template de Paquetes
    </button>
  );
};

export default DownloadTemplateButton;
