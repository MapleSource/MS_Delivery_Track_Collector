import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    try {
      // Conexión a MongoDB
      const client = await clientPromise;
      const db = client.db("runner");

      // Obtener el ID del paquete desde la URL y los datos del cuerpo de la solicitud
      const { packageId } = req.query;
      const { package_sign, package_evidence, package_status } = req.body;

      // Validar parámetros
      if (!packageId || typeof packageId !== "string") {
        return res.status(400).json({
          message: "El parámetro 'packageId' es inválido o está vacío",
        });
      }

      if (!package_sign || !package_evidence || !package_status) {
        return res.status(400).json({
          message: "Los datos requeridos no están completos",
        });
      }

      // Actualizar el paquete en la colección
      const result = await db.collection("packages").updateOne(
        { package_id: packageId },
        {
          $set: {
            signature: package_sign,
            photo_proof: package_evidence,
            status: package_status,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: `No se encontró un paquete con el ID '${packageId}'`,
        });
      }

      res.status(200).json({
        message: "Paquete actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error al actualizar el paquete:", error);
      res.status(500).json({
        message: "Error en el servidor",
        error: (error as Error).message,
      });
    }
  } else {
    // Manejar método no permitido
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
