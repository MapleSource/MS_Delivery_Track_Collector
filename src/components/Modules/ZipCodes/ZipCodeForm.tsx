import Module from "@/stories/Layout/Module/Module";
import Label from "@/stories/Typography/Label/Label";
import Title from "@/stories/Typography/Title/Title";
import Divider from "@/stories/Utilities/Divider/Divider";
import React, { useState } from "react";
import * as XLSX from "xlsx";

interface FormData {
  zip_code: string;
}

const ZipCodeForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({ zip_code: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fileData, setFileData] = useState<string[] | null>(null); // Para guardar codigos del archivo

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processSingleZipCode(form.zip_code);
  };

  const processSingleZipCode = async (zipCode: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const validateRes = await fetch("/api/mongodb/zipcodes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip_code: zipCode }),
      });
      const validateData = await validateRes.json();

      if (!validateRes.ok) {
        setMessage(`Error al validar: ${validateData.error}`);
        setLoading(false);
        return;
      }

      const insertRes = await fetch("/api/mongodb/zipcodes/get-zip-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip_code: zipCode,
          lat: validateData.lat,
          long: validateData.long,
          municipality: validateData.municipality,
          colony: validateData.colony,
        }),
      });
      const insertData = await insertRes.json();

      if (!insertRes.ok) {
        setMessage(`Error al insertar: ${insertData.error}`);
      } else {
        setMessage("Código postal insertado correctamente");
        setForm({ zip_code: "" });
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

      // Asumiendo que la primera fila es encabezado con "zipCode"
      // y las siguientes contienen los códigos en la primera columna
      const zipCodesFromFile = data
        .slice(1) // Omitir la fila de encabezado
        .map((row) => row[0]) // Tomar la primera celda de cada fila
        .filter(
          (val) => (val && typeof val === "number") || typeof val === "string"
        ) // Filtrar valores vacíos
        .map((val) => val.toString());

      setFileData(zipCodesFromFile);
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkSubmit = async () => {
    if (!fileData) {
      setMessage("No se han cargado datos de archivo.");
      return;
    }

    setLoading(true);
    setMessage("Procesando registros...");
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileData.length; i++) {
      const zipCode = fileData[i];
      try {
        const validateRes = await fetch("/api/mongodb/zipcodes/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zip_code: zipCode }),
        });
        const validateData = await validateRes.json();

        if (!validateRes.ok) {
          // Si falla la validación, simplemente pasamos al siguiente
          failCount++;
          continue;
        }

        const insertRes = await fetch("/api/mongodb/zipcodes/get-zip-codes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zip_code: zipCode,
            lat: validateData.lat,
            long: validateData.long,
            municipality: validateData.municipality,
            colony: validateData.colony,
          }),
        });

        if (!insertRes.ok) {
          // Si falla la inserción, lo consideramos fallo y seguimos
          failCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    setMessage(
      `Proceso terminado. Éxitos: ${successCount}, Fallos: ${failCount}`
    );
    setLoading(false);
    setFileData(null);
  };

  return (
    <Module>
      <Title title="Agregar códigos Postales" />
      <form onSubmit={handleSingleSubmit}>
        <input
          type="text"
          name="zip_code"
          value={form.zip_code}
          onChange={handleChange}
          placeholder="Ingrese código postal"
          required
        />
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--primary)",
            color: "var(--text)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          type="submit"
          disabled={loading}
        >
          Guardar
        </button>
      </form>
      <Divider />
      <Title title="Agregar Múltiples Códigos Postales desde un Excel" />
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
      {fileData && fileData.length > 0 && (
        <div>
          <p>{fileData.length} códigos cargados desde el archivo</p>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "var(--primary)",
              color: "var(--text)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={handleBulkSubmit}
            disabled={loading}
          >
            Procesar en lote
          </button>
        </div>
      )}

      {message && <Label label={message} />}
    </Module>
  );
};

export default ZipCodeForm;
