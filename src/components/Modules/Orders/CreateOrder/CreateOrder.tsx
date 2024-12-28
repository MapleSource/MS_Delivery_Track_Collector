import Grid from "@/stories/Layout/Grid/Grid";
import Module from "@/stories/Layout/Module/Module";
import Title from "@/stories/Typography/Title/Title";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import Styles from "./CreateOrder.module.css";
import { PackageData } from "@/types/IPackageData";
import { useSession } from "next-auth/react";
import { uploadPackageHeaders } from "@/data/headers";
import Table from "@/stories/DataDisplay/Table/Table";
import Link from "next/link";
import TemplateXLSX from "../TemplateXLSX/TemplateXLSX";

const headerMap: { [key: string]: string } = {
  Nombre_remitente: "sender_name",
  Nombre_destinatario: "recipient_name",
  Calle_y_numero_destinatario: "recipient_address",
  Codigo_postal_destinatario: "recipient_zip",
  Colonia_destinatario: "recipient_colony",
  Municipio_delegacion_destinatario: "recipient_city",
  Estado_destinatario: "recipient_state",
  Referencia_destinatario: "recipient_reference",
  Correo_electronico_destinatario: "recipient_email",
  Telefono_destinatario: "recipient_phone",
  Descripcion_paquete: "package_description",
  Peso_paquete: "package_weight",
  Dimensiones_paquete: "package_dimensions",
  Identificador_adicional: "package_custom_id",
};

interface CustomUser {
  sub: string;
  nickname: string;
}

const CreateOrder: React.FC = () => {
  const { button, text } = Styles;
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

      await fetch("/api/mongodb/orders/upload-packages", {
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
    <Module>
      <Title title="Orden nueva" />
      <br />
      <div className={button}>
        <Grid gridTemplateColumns="auto auto auto 1fr">
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
          {jsonData.length > 0 && (
            <button onClick={uploadToDatabase} disabled={jsonData.length === 0}>
              Cargar orden
            </button>
          )}
          <TemplateXLSX />
        </Grid>
        <br />
      </div>

      {successMessage ? (
        <div className={button}>
          <p className={text}>{successMessage}</p>
          <p style={{ textAlign: "center" }}>
            Consulta el apartado "Ordenes" para poder generar las etiquetas de
            envio
          </p>
          <Link href="/ordenes/consulta">Ir a ordenes</Link>
        </div>
      ) : (
        <Table headers={uploadPackageHeaders} data={jsonData} />
      )}
    </Module>
  );
};

export default CreateOrder;
