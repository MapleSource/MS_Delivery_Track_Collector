import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Conexión a MongoDB
      const client = await clientPromise;
      const db = client.db("runner");

      // Obtener parámetro order_id desde req.query
      const { order_id } = req.query;

      // Validar el parámetro
      if (typeof order_id !== "string" || order_id === "") {
        return res.status(400).json({
          message: "El parámetro 'order_id' es inválido o está vacío",
        });
      }

      // Buscar paquetes que coincidan con el order_id
      const packages = await db
        .collection("packages")
        .find({ order_id: order_id })
        .toArray();

      // Si no se encuentran paquetes
      if (packages.length === 0) {
        return res.status(404).json({
          message: `No se encontraron paquetes para la orden con ID: '${order_id}'`,
        });
      }

      // Respuesta con los paquetes encontrados
      res.status(200).json({
        message: "Paquetes encontrados",
        packages,
      });
    } catch (error) {
      console.error("Error al obtener paquetes por order_id:", error);
      res.status(500).json({
        message: "Error en el servidor",
        error: (error as Error).message,
      });
    }
  } else {
    // Manejar método no permitido
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
