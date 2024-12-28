import React, { useState } from "react";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import Styles from "./GeneratePackagesPDF.module.css";
import axios from "axios";

interface PackageData {
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
  package_weight: number;
  package_dimensions: string;
  package_id: string;
  order_id: string;
}

interface GeneratePackagesPDFProps {
  order_id: string; // ID de la orden a consultar
  status?: string;
}

const GeneratePackagesPDF: React.FC<GeneratePackagesPDFProps> = ({
  order_id,
  status,
}) => {
  const { content } = Styles;
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackagesAndGeneratePDF = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/mongodb/get-packages`, {
        params: { order_id: order_id },
      });
      setPackages(response.data.packages);

      if (packages.length === 0) {
        setError("No se encontraron paquetes para esta orden.");
        return;
      }

      const doc = new jsPDF();
      packages.forEach((pkg, index) => {
        if (index !== 0) doc.addPage();

        // Encabezado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(`Detalle del Paquete`, 105, 10, { align: "center" });

        // Información del Remitente
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Remitente: ${pkg.sender_name}`, 10, 30);

        // Información del Destinatario
        doc.setDrawColor(0, 0, 0); // Color negro
        doc.setLineWidth(0.5);
        doc.rect(10, 40, 190, 60); // Marco para el destinatario
        doc.text(`Destinatario:`, 15, 50);
        doc.setFont("helvetica", "bold");
        doc.text(`${pkg.recipient_name}`, 50, 50);

        doc.setFont("helvetica", "normal");
        doc.text(`Dirección: ${pkg.recipient_address}`, 15, 60);
        doc.text(`Ciudad: ${pkg.recipient_city}`, 15, 70);
        doc.text(`Estado: ${pkg.recipient_state}`, 15, 80);
        doc.text(`País: ${pkg.recipient_country}`, 15, 90);
        doc.text(`Teléfono: ${pkg.recipient_phone}`, 15, 100);

        // Información del Paquete
        doc.rect(10, 110, 190, 40); // Marco para el paquete
        doc.text(`Peso: ${pkg.package_weight} kg`, 15, 120);
        doc.text(`Dimensiones: ${pkg.package_dimensions}`, 15, 130);

        // Código de Barras
        const barcodeCanvas = document.createElement("canvas");
        JsBarcode(barcodeCanvas, pkg.package_id, {
          format: "CODE128",
          width: 2,
          height: 40,
          displayValue: true,
        });
        const barcodeDataUrl = barcodeCanvas.toDataURL("image/png");
        doc.addImage(barcodeDataUrl, "PNG", 15, 150, 100, 20);

        // Separador entre páginas
        if (index < packages.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.line(10, 280, 200, 280); // Línea al final de la página
        }
      });

      // Guardar el archivo
      doc.save(`Paquetes_${order_id}.pdf`);
    } catch (err) {
      console.error("Error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={content}>
      <button
        onClick={fetchPackagesAndGeneratePDF}
        style={{
          padding: "10px 20px",
          backgroundColor: "var(--primary)",
          color: "var(--text)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generando PDF..." : "Generar etiquetas"}
      </button>
    </div>
  );
};

export default GeneratePackagesPDF;
