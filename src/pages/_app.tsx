import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const noLayoutRoutes = ["/iniciar-sesion"];
  const isNoLayoutRoute = noLayoutRoutes.includes(router.pathname);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      {isNoLayoutRoute ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  );
}
