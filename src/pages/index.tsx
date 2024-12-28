import Header from "@/components/Layout/Header";
import Main from "@/components/Main/Main";
import withAuth from "@/utils/withAuth";

const HomePage: React.FC = () => {
  return (
    <>
      <Header title="Portal Empleados" />
      <Main />
    </>
  );
};

export default withAuth(HomePage);
