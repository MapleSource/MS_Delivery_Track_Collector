import { IStatus } from "@/types/IStatus";

export const orderStatus: IStatus[] = [
  {
    name: "Desconocido",
    icon: "/status/unknown.png",
    color: "#75757530",
  },
  {
    name: "Orden Creada",
    icon: "/status/edit.png",
    color: "var(--icon)",
  },
  {
    name: "En Recolección",
    icon: "/status/contrast.png",
    color: "#64B5F630",
  },
  {
    name: "En Transito",
    icon: "/status/truck.png",
    color: "#64B5F630",
  },
  {
    name: "En Almacén",
    icon: "/status/warehouse.png",
    color: "#42424230",
  },
  {
    name: "Orden Completada",
    icon: "/status/check.png",
    color: "#81C78430",
  },
  {
    name: "En Reparto",
    icon: "/status/contrast.png",
    color: "#64B5F630",
  },
  {
    name: "Orden Cancelada",
    icon: "/status/cancel.png",
    color: "#E5737330",
  },
];

export const packageStatus: IStatus[] = [
  {
    name: "Desconocido",
    icon: "/status/unknown.png",
    color: "#75757530",
  },
  {
    name: "Orden Creada",
    icon: "/status/edit.png",
    color: "var(--icon)",
  },
  {
    name: "En Recolección",
    icon: "/status/contrast.png",
    color: "#64B5F630",
  },
  {
    name: "En Transito",
    icon: "/status/map.png",
    color: "#FFC700",
  },
  {
    name: "En Almacén",
    icon: "/status/warehouse.png",
    color: "#42424230",
  },
  {
    name: "En Reparto",
    icon: "/status/progress.png",
    color: "#1565C030",
  },
  {
    name: "Entregado",
    icon: "/status/check.png",
    color: "#81C78430",
  },
  {
    name: "Reprogramado",
    icon: "/status/exception.png",
    color: "#FFB74D30",
  },
];
