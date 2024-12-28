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

      const activeOrders = await db
        .collection("orders")
        .find({ status: "Orden Creada" })
        .toArray();

      res.status(200).json({ orders: activeOrders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al consultar órdenes activas" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
