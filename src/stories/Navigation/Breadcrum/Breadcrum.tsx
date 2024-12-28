import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface BreadcrumbProps {
  customLabels?: { [key: string]: string };
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ customLabels }) => {
  const router = useRouter();
  const pathSegments = router.pathname.split("/").filter((segment) => segment);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label =
      customLabels?.[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    return (
      <span key={href}>
        <Link href={href}>{label}</Link>
        {index < pathSegments.length - 1 && " > "}
      </span>
    );
  });

  return (
    <nav
      style={{
        width: "90%",
        height: "30px",
        margin: "auto",
        fontFamily: "Nunito",
        fontSize: "16px",
        fontWeight: "normal",
        color: "#000000",
      }}
      aria-label="breadcrumb"
    >
      <Link href="/">Inicio</Link>
      {pathSegments.length > 0 && " > "}
      {breadcrumbs}
    </nav>
  );
};

export default Breadcrumb;
