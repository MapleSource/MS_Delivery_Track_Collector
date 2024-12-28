import Header from "@/components/Layout/Header";
import Logout from "@/stories/Buttons/Logout/Logout";

export default function UnautorizedPage() {
  return (
    <>
      <Header title="Usuario no autorizado" />
      <Logout />
    </>
  );
}
