import React, { useState } from "react";
import * as XLSX from "xlsx";
import Styles from "./UploadOrder.module.css";
import { PackageData } from "@/types/IPackageData";
import { useSession } from "next-auth/react";

const headerMap: { [key: string]: string } = {
  Nombre_remitente: "sender_name",
  Direccion_remitente: "sender_address",
  Telefono_remitente: "sender_phone",
  Correo_electronico_remitente: "sender_email",
  Nombre_destinatario: "recipient_name",
  Calle_y_numero_destinatario: "recipient_address",
  Codigo_postal_destinatario: "recipient_zip",
  Colonia_destinatario: "recipient_colony",
  Ciudad_destinatario: "recipient_city",
  Estado_destinatario: "recipient_state",
  Pais_destinatario: "recipient_country",
  Referencia_destinatario: "recipient_reference",
  Correo_electronico_destinatario: "recipient_email",
  Telefono_destinatario: "recipient_phone",
  Descripcion_paquete: "package_description",
  Peso_paquete: "package_weight",
  Dimensiones_paquete: "package_dimensions",
  Identificador_adicional: "package_custom_id",
  Nombre_identificador: "package_custom_id_name",
};

const UploadOrder: React.FC = () => {
  const { content, headers, body, card, text } = Styles;
  const [jsonData, setJsonData] = useState<PackageData[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);
    const processedData = rawData.map((row) => {
      const rowData: any = {};
      for (const key in row) {
        const cleanKey = key.replace(/\*/g, "");
        const mappedKey = headerMap[cleanKey] || cleanKey;
        rowData[mappedKey] = row[key];
      }

      rowData.package_weight = rowData.package_weight ?? 1;
      rowData.package_dimensions = rowData.package_dimensions ?? "dfxdfxdf";
      return rowData as PackageData;
    });

    setJsonData(processedData);
  };

  const uploadToDatabase = async () => {
    try {
      const { sub, nickname } = session?.user as {
        sub: string;
        nickname: string;
      };
      const orderResponse = await fetch("/api/mongodb/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: nickname,
          status: "Orden Creada",
          collection_date: "por definir",
          user_sub: sub,
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error("Error al crear la orden");
      }

      const packagesWithOrderId = jsonData.map((pkg) => ({
        ...pkg,
        order_id: orderData.order_id,
      }));

      await fetch("/api/mongodb/upload-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packages: packagesWithOrderId,
          order_id: orderData.order_id,
        }),
      });

      setSuccessMessage(`La orden ${orderData.order_id} fue creada con éxito`);
      setJsonData([]);
    } catch (error) {
      console.error("Error al cargar paquetes y orden:", error);
      setSuccessMessage("Hubo un error al cargar los paquetes y la orden");
    }
  };

  return (
    <section className={content}>
      <h1 style={{ fontSize: "40px" }}>Cargar orden</h1>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />

      {successMessage && <p className={text}>{successMessage}</p>}

      {jsonData.length > 0 && (
        <div>
          <div className={headers}>
            <p>ID</p>
            <p>Remitente</p>
            <p>Destinatario</p>
            <p>Dirección</p>
            <p>Ciudad</p>
            <p>Peso del Paquete</p>
            <p>Dimensiones del Paquete</p>
          </div>
          {jsonData.map((pkg, index) => (
            <div key={index} className={body}>
              <div className={card}>
                <p>{pkg.package_id || "Generado al cargar"}</p>
                <p>{pkg.sender_name}</p>
                <p>{pkg.recipient_name}</p>
                <p>{pkg.recipient_address}</p>
                <p>{pkg.recipient_city}</p>
                <p>{pkg.package_weight}</p>
                <p>{pkg.package_dimensions}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={uploadToDatabase} disabled={jsonData.length === 0}>
        Cargar orden
      </button>
    </section>
  );
};

export default UploadOrder;
