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

      const { order_client } = req.query;

      if (typeof order_client !== "string" || order_client === "") {
        return res.status(400).json({
          message: "El parámetro 'order_client' es inválido o está vacío",
        });
      }

      const orders = await db
        .collection("orders")
        .find({ client_name: order_client })
        .toArray();

      if (orders.length === 0) {
        return res.status(404).json({
          message: `No se encontraron órdenes para el cliente: '${order_client}'`,
        });
      }

      res.status(200).json({ message: "Órdenes encontradas", orders });
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      res.status(500).json({
        message: "Error en el servidor",
        error: (error as Error).message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
