import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { package_id, package_status, package_sign, package_evidence } =
      req.body;

    if (!package_id || !package_status) {
      return res
        .status(400)
        .json({ message: "Se requiere package_id y package_status" });
    }

    const client = await clientPromise;
    const db = client.db("runner");

    const result = await db.collection("packages").updateOne(
      { package_id },
      {
        $set: {
          package_status,
          ...(package_sign && { package_sign }),
          ...(package_evidence && { package_evidence }),
          updated_at: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el paquete para actualizar" });
    }

    res.status(200).json({ message: "Paquete actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el paquete:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
