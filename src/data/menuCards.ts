import { IMenuCard } from "@/types/IMenuCard";

export const menu: IMenuCard[] = [
  {
    title: "Ordenes",
    subtitle: "Gestionar ordenes",
    image: "/menu/ordenes.jpg",
    url: "/ordenes",
  },
  {
    title: "Repartidores",
    subtitle: "Consultar orden repartidores",
    image: "/menu/repartidor.jpg",
    url: "/repartidor",
  },
];

export const orderMenu: IMenuCard[] = [
  // {
  //   title: "Consultar Ordenes",
  //   subtitle: "Ver ordenes creadas",
  //   image: "/menu/consulta.jpg",
  //   url: "/ordenes/consulta",
  // },
  {
    title: "Verificar Recoleccion",
    subtitle: "Validar los paquetes a recibir",
    image: "/menu/verificar.jpg",
    url: "/ordenes/verificar-recoleccion",
  },
  {
    title: "Ingresar al Almacén",
    subtitle: "Ingreso y validación de paquetes",
    image: "/menu/almacen.jpg",
    url: "/ordenes/ingreso-almacen",
  },
];

export const packageMenu: IMenuCard[] = [
  {
    title: "Consultar Paquetes",
    subtitle: "Consulta todos los paquetes",
    image: "/menu/consulta.jpg",
    url: "/paquetes/consultar-paquetes",
  },
  // {
  //   title: "Procesar Paquetes",
  //   subtitle: "prepara los paquetes para la optimizacion de ruta",
  //   image: "/menu/ordena.jpg",
  //   url: "/paquetes/procesar-paquetes",
  // },
  // {
  //   title: "Optimizar ruta",
  //   subtitle: "Agrupa los paquetes para su asignacion a un repartidor",
  //   image: "/menu/optimizar.jpg",
  //   url: "/paquetes/ruta",
  // },
];
