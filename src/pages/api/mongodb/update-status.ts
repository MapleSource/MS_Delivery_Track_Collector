/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("runner");

      const { package_id, package_status } = req.body;

      if (!package_id || !package_status) {
        return res.status(400).json({
          message: "Faltan parámetros requeridos: package_id o package_status",
        });
      }

      // Actualizar el estado del paquete
      const result = await db
        .collection("packages")
        .updateOne({ package_id }, { $set: { package_status } });

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: "Paquete no encontrado.",
        });
      }

      res.status(200).json({
        message: "Estado del paquete actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error al actualizar el estado del paquete:", error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
