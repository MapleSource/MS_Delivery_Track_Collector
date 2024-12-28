/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("runner");

      const packages = await db
        .collection("packages")
        .find({ package_status: "Por Asignar" })
        .toArray();

      if (packages.length === 0) {
        return res.status(404).json({
          message:
            "No se encontraron paquetes con `package_status` igual a 'En Almacén'.",
        });
      }

      res.status(200).json({ message: "Paquetes encontrados", packages });
    } catch (error) {
      console.error("Error al obtener paquetes:", error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
