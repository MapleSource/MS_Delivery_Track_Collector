import { allPackageHeaders } from "@/data/headers";
import Table from "@/stories/DataDisplay/Table/Table";
import Module from "@/stories/Layout/Module/Module";
import Label from "@/stories/Typography/Label/Label";
import Title from "@/stories/Typography/Title/Title";
import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

interface PackageData {
  package_id: string;
  sender_name: string;
  recipient_name: string;
  recipient_address: string;
  recipient_zip: number;
  recipient_city: string;
  recipient_state: string;
  recipient_country: string;
  recipient_phone: string;
  recipient_email: string;
  recipient_postal_code: string;
  package_weight: number;
  package_dimensions: string;
  package_status: string;
  package_distance: number;
  package_lat: number;
  package_long: number;
}

const RouteOptimizer = () => {
  const [routeURL, setRouteURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/mongodb/get-ready-packages-2");
      const data = await response.json();
      setPackages(data.packages);
      setHasFetched(true);
    } catch (error) {
      console.error("Error al obtener los paquetes:", error);
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/mongodb/get-ready-packages-2");
        const data = await response.json();
        setPackages(data.packages);
        setHasFetched(true);
      } catch (error) {
        console.error("Error al obtener los paquetes:", error);
      }
    };
    fetchPackages();
  }, []);

  const fetchOptimizedRoute = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/mongodb/optimized-route");
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Error en la solicitud");

      setRouteURL(data.optimizedRouteURL);
      if (typeof window !== "undefined") {
        message.success("Paquetes asignados");
      }
      fetchPackages();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Module>
      <Title title="Optimizar paquetes listos para envio" />
      <br />
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "var(--primary)",
          color: "var(--text)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={fetchOptimizedRoute}
        disabled={loading}
      >
        {loading ? "Generando ruta..." : "Optimizar Ruta"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      <br />
      <Table headers={allPackageHeaders} data={packages} />
    </Module>
  );
};

export default RouteOptimizer;
