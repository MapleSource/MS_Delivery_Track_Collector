import React, { useState, useEffect } from "react";
import Styles from "./SearchPackages.module.css";
import Module from "@/stories/Layout/Module/Module";
import Table from "@/stories/DataDisplay/Table/Table";
import { allPackageHeaders } from "@/data/headers";
import Title from "@/stories/Typography/Title/Title";

interface PackageData {
  package_id: string;
  sender_name: string;
  recipient_name: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_country: string;
  recipient_phone: string;
  recipient_email: string;
  package_weight: number;
  package_dimensions: string;
  package_status: string;
}

const SearchPackages: React.FC = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageData[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { input } = Styles;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/mongodb/get-all-packages");
        const data = await response.json();
        setPackages(data.packages);
        setFilteredPackages(data.packages);
        setHasFetched(true);
      } catch (error) {
        console.error("Error al obtener los paquetes:", error);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = packages.filter((pkg) => {
      return (
        (pkg.package_id?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (pkg.sender_name?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (pkg.recipient_name?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (pkg.recipient_address?.toLowerCase() || "").includes(
          lowerSearchTerm
        ) ||
        (pkg.recipient_city?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (pkg.recipient_state?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (pkg.recipient_country?.toLowerCase() || "").includes(
          lowerSearchTerm
        ) ||
        (pkg.recipient_phone || "").includes(searchTerm) ||
        (pkg.recipient_email?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (pkg.package_status?.toLowerCase() || "").includes(lowerSearchTerm)
      );
    });
    setFilteredPackages(filtered);
  }, [searchTerm, packages]);

  return (
    <Module>
      <Title title="Paquetes" />

      {hasFetched ? (
        <>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={input}
          />
          <Table headers={allPackageHeaders} data={filteredPackages} />
        </>
      ) : (
        <>Error al obtener los paquetes</>
      )}
    </Module>
  );
};

export default SearchPackages;
