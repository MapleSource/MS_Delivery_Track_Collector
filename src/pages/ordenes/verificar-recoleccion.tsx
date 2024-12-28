import Header from "@/components/Layout/Header";
import VerifyOrder from "@/components/Modules/Orders/VerifyOrder/VerifyOrder";
import withAuth from "@/utils/withAuth";

const VerifyOrderPage: React.FC = () => {
  return (
    <>
      <Header title="Verificar orden a recolectar" />
      <VerifyOrder />
    </>
  );
};

export default withAuth(VerifyOrderPage);
