import Header from "@/components/Layout/Header";
import Delivery from "@/components/Modules/Delivery/Delivery";
import withAuth from "@/utils/withAuth";

const DeliveryPage: React.FC = () => {
  return (
    <>
      <Header title="Portal Repartidor" />
      <Delivery />
    </>
  );
};

export default withAuth(DeliveryPage);
