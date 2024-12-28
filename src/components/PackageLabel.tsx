// components/PackageLabel.tsx
import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import JsBarcode from "jsbarcode";

interface PackageData {
  tracking_id: string;
  sender_name: string;
  sender_address: string;
  sender_phone: string;
  sender_email: string;
  recipient_name: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_country: string;
  recipient_reference: string;
  recipient_phone: string;
  recipient_email: string;
  package_weight: string;
  package_dimensions: string;
}

const PackageLabel: React.FC = () => {
  const [packageData, setPackageData] = useState<PackageData | null>(null);

  useEffect(() => {
    const fetchPackageData = async () => {
      // Realizar la consulta a la base de datos MongoDB
      const response = await fetch("/api/mongodb/get-package");
      const data = await response.json();
      setPackageData(data);
    };
    fetchPackageData();
  }, []);

  // Función para convertir el tracking_id a código de barras y generar el PDF
  const generatePDF = async () => {
    if (!packageData) return;

    // Crear el código de barras en base64
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, packageData.tracking_id, { format: "CODE128" });
    const barcodeImage = canvas.toDataURL("image/png");

    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 300]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Insertar el código de barras en el PDF
    const barcodeImageBytes = await fetch(barcodeImage).then((res) =>
      res.arrayBuffer()
    );
    const barcodeImageEmbed = await pdfDoc.embedPng(barcodeImageBytes);
    page.drawImage(barcodeImageEmbed, {
      x: 450,
      y: 200,
      width: 100,
      height: 50,
    });

    // Añadir detalles del paquete al PDF
    page.drawText(`Remitente: ${packageData.sender_name}`, {
      x: 50,
      y: 250,
      font,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Dirección Remitente: ${packageData.sender_address}`, {
      x: 50,
      y: 230,
      font,
      size: 12,
    });
    page.drawText(`Teléfono Remitente: ${packageData.sender_phone}`, {
      x: 50,
      y: 210,
      font,
      size: 12,
    });
    page.drawText(`Email Remitente: ${packageData.sender_email}`, {
      x: 50,
      y: 190,
      font,
      size: 12,
    });

    page.drawText(`Destinatario: ${packageData.recipient_name}`, {
      x: 50,
      y: 150,
      font,
      size: 12,
    });
    page.drawText(`Dirección Destinatario: ${packageData.recipient_address}`, {
      x: 50,
      y: 130,
      font,
      size: 12,
    });
    page.drawText(`Ciudad: ${packageData.recipient_city}`, {
      x: 50,
      y: 110,
      font,
      size: 12,
    });
    page.drawText(`Estado: ${packageData.recipient_state}`, {
      x: 50,
      y: 90,
      font,
      size: 12,
    });
    page.drawText(`País: ${packageData.recipient_country}`, {
      x: 50,
      y: 70,
      font,
      size: 12,
    });
    page.drawText(`Teléfono Destinatario: ${packageData.recipient_phone}`, {
      x: 50,
      y: 50,
      font,
      size: 12,
    });
    page.drawText(`Peso del Paquete: ${packageData.package_weight} kg`, {
      x: 50,
      y: 30,
      font,
      size: 12,
    });
    page.drawText(`Dimensiones: ${packageData.package_dimensions}`, {
      x: 50,
      y: 10,
      font,
      size: 12,
    });

    // Descargar el PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Etiqueta_${packageData.tracking_id}.pdf`;
    link.click();
  };

  return (
    <div>
      <button onClick={generatePDF} disabled={!packageData}>
        Descargar Etiqueta de Envío
      </button>
    </div>
  );
};

export default PackageLabel;
