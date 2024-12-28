import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (Component: React.FC) => {
  const AuthenticatedComponent = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;

      if (!session) {
        router.replace("/iniciar-sesion");
        return;
      }

      if (session.user?.name?.includes("recolector-runner")) {
        if (router.pathname === "/iniciar-sesion") {
          router.replace("/");
        }
      } else {
        signOut({ callbackUrl: "/iniciar-sesion" });
        alert("No tienes permisos para acceder a este portal");
      }
    }, [session, status, router]);

    if (status === "loading") {
      return <p>Validando sesión...</p>;
    }

    return session?.user?.name?.includes("recolector-runner") ? (
      <Component />
    ) : null;
  };

  return AuthenticatedComponent;
};

export default withAuth;
