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

      const { status } = req.query;

      if (typeof status !== "string") {
        return res
          .status(400)
          .json({ message: "El parámetro Estatus es inválido" });
      }

      const orders = await db.collection("orders").find({ status }).toArray();

      if (orders.length === 0) {
        return res.status(404).json({
          message: `No se encontraron órdenes con Estatus: '${status}'`,
        });
      }

      res.status(200).json({ message: "Órdenes encontradas", orders });
    } catch (error) {
      console.error("Error al consultar órdenes:", error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
