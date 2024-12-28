import Header from "@/components/Layout/Header";
import VerifyWarehouse from "@/components/Modules/Orders/VerifyWarehouse/VerifyWarehouse";
import withAuth from "@/utils/withAuth";

const WarehousePage: React.FC = () => {
  return (
    <>
      <Header title="Ingresar order al almacen" />
      <VerifyWarehouse />
    </>
  );
};

export default withAuth(WarehousePage);
