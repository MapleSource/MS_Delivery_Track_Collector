import Header from "@/components/Layout/Header";
import SearchPackages from "@/components/Orders/SearchPackages/SearchPackages";

export default function AllPackagesPage() {
  return (
    <>
      <Header title="Paquetes" />
      <SearchPackages />
    </>
  );
}
