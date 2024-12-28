import Header from "@/components/Layout/Header";
import Orders from "@/components/Modules/Orders/Orders";
import withAuth from "@/utils/withAuth";

const OrdersPage: React.FC = () => {
  return (
    <>
      <Header title="Ordenes" />
      <Orders />
    </>
  );
};

export default withAuth(OrdersPage);
