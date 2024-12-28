import { IHeader } from "@/types/IHeader";

export const allPackageHeaders: IHeader[] = [
  { header: "ID", key: "package_id" },
  { header: "Orden", key: "order_id" },
  { header: "Cliente", key: "sender_name" },
  { header: "Destinatario", key: "recipient_name" },
  { header: "Codigo Postal", key: "recipient_zip" },
  { header: "Ciudad", key: "recipient_city" },
  { header: "Estatus", key: "package_status" },
  { header: "Orden entrega", key: "package_distance" },
];

export const uploadPackageHeaders: IHeader[] = [
  { header: "Cliente", key: "sender_name" },
  { header: "Destinatario", key: "recipient_name" },
  { header: "Direccion", key: "recipient_address" },
  { header: "Colonia", key: "recipient_colony" },
  { header: "Codigo Postal", key: "recipient_zip" },
  { header: "Ciudad", key: "recipient_city" },
  { header: "Peso", key: "package_weight" },
  { header: "Dimensiones", key: "package_dimensions" },
];

export const allPostalCodesHeaders: IHeader[] = [
  { header: "Código Postal", key: "zip_code" },
  { header: "Municipio", key: "municipality" },
  { header: "Colonia", key: "colony" },
  { header: "Latitud", key: "lat" },
  { header: "Longitud", key: "long" },
];

export const validatePackageHeaders: IHeader[] = [
  { header: "ID", key: "package_id" },
];

export const deliveryPackageHeaders: IHeader[] = [
  { header: "ID", key: "package_id" },
  { header: "Proximo", key: "package_distance" },
  { header: "Estatus", key: "package_status" },
];
