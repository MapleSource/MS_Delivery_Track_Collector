import { allPostalCodesHeaders } from "@/data/headers";
import Table from "@/stories/DataDisplay/Table/Table";
import Module from "@/stories/Layout/Module/Module";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ZipCode {
  _id: string;
  zip_code: string;
  lat?: number;
  long?: number;
  municipality?: string;
  colony?: string;
}

const ZipCodeList: React.FC = () => {
  const [zipCodes, setZipCodes] = useState<ZipCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZipCodes = async () => {
      try {
        const res = await fetch("/api/mongodb/zipcodes/get-zip-codes");
        if (!res.ok) {
          throw new Error("Error al obtener datos de códigos postales");
        }
        const data = await res.json();
        setZipCodes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZipCodes();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <Module>
      <h2>Listado de Códigos Postales</h2>
      <br />
      <Link
        style={{
          padding: "10px 20px",
          backgroundColor: "var(--primary)",
          color: "var(--text)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        href="/cobertura/nuevo-codigo-postal"
      >
        Nuevo
      </Link>
      <br />
      <br />
      <br />
      <Table
        headers={allPostalCodesHeaders}
        data={zipCodes}
        loading={loading}
      />
    </Module>
  );
};

export default ZipCodeList;
