import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { package_id, problem } = req.body;

    if (!package_id || !problem) {
      return res
        .status(400)
        .json({ message: "Se requiere package_id y un problema válido" });
    }

    const client = await clientPromise;
    const db = client.db("runner");

    const result = await db.collection("packages").updateOne(
      { _id: new ObjectId(package_id) },
      {
        $set: {
          package_status: problem,
          updated_at: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró el paquete para actualizar" });
    }

    res.status(200).json({ message: "Problema reportado exitosamente" });
  } catch (error) {
    console.error("Error al reportar el problema:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
