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
    const { packages } = req.body;

    if (!packages || !Array.isArray(packages)) {
      return res.status(400).json({ message: "Datos de paquetes no válidos" });
    }

    const client = await clientPromise;
    const db = client.db("runner");

    // Preparar las operaciones bulk
    const bulkOps = packages.map((pkg: any) => ({
      updateOne: {
        filter: { _id: new ObjectId(pkg._id) },
        update: {
          $set: {
            package_distance: pkg.package_distance,
            package_status: "Por Asignar",
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await db.collection("packages").bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Paquetes actualizados correctamente" });
  } catch (error: any) {
    console.error("Error al actualizar paquetes:", error);
    res.status(500).json({ message: "Error al actualizar los paquetes" });
  }
}
