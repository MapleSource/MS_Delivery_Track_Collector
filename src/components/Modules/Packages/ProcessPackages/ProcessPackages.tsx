import { useState, useEffect } from "react";
import { assignDistances } from "@/utils/assignDistances";
import Module from "@/stories/Layout/Module/Module";
import Title from "@/stories/Typography/Title/Title";
import Table from "@/stories/DataDisplay/Table/Table";
import { allPackageHeaders } from "@/data/headers";
import { message } from "antd";

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

const ProcessPackages: React.FC = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/mongodb/get-ready-packages");
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
        const response = await fetch("/api/mongodb/get-ready-packages");
        const data = await response.json();
        setPackages(data.packages);
        setHasFetched(true);
      } catch (error) {
        console.error("Error al obtener los paquetes:", error);
      }
    };
    fetchPackages();
  }, []);

  const handleSortPackages = async () => {
    const sortedPackages: any = assignDistances(packages);
    setPackages(sortedPackages);

    try {
      const response = await fetch("/api/mongodb/update-package-distances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packages: sortedPackages }),
      });

      if (!response.ok) {
        console.error("Error al actualizar los paquetes en la base de datos");
      } else {
        console.log("Paquetes actualizados correctamente en la base de datos");
        if (typeof window !== "undefined") {
          message.success("Paquetes listos para ser optimizados");
        }
        fetchPackages();
      }
    } catch (error) {
      console.error("Error al actualizar los paquetes:", error);
    }
  };

  return (
    <Module>
      <Title title="Paquetes Listos para Procesar" />
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
        onClick={handleSortPackages}
      >
        Procesar Paquetes
      </button>
      <br />
      <br />
      {hasFetched ? (
        <>
          <Table headers={allPackageHeaders} data={packages} />
        </>
      ) : (
        <>Error al obtener los paquetes</>
      )}
    </Module>
  );
};

export default ProcessPackages;
