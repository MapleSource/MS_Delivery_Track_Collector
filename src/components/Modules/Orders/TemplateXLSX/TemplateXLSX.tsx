import Button from "@/stories/Buttons/Button/Button";
import React from "react";
import { writeFileXLSX, utils } from "xlsx";

const TemplateXLSX = () => {
  const handleDownload = () => {
    const columns = [
      "Nombre_remitente*",
      "Nombre_destinatario*",
      "Calle_y_numero_destinatario*",
      "Codigo_postal_destinatario*",
      "Colonia_destinatario*",
      "Municipio_delegacion_destinatario*",
      "Estado_destinatario*",
      "Referencia_destinatario",
      "Correo_electronico_destinatario",
      "Telefono_destinatario*",
      "Peso_paquete",
      "Dimensiones",
      "Identificador_adicional",
    ];

    const worksheet = utils.json_to_sheet([], { header: columns });

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Template");

    writeFileXLSX(workbook, "template_carga_paquetes_runner.xlsx");
  };

  return <Button label="Descargar Template" onClick={handleDownload} />;
};

export default TemplateXLSX;
