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

      const { status, user_sub } = req.query;

      const filter: Record<string, unknown> = {};
      if (typeof status === "string") filter.status = status;
      if (typeof user_sub === "string")
        filter.assigned_delivery_person = user_sub;

      const orders = await db.collection("orders").find(filter).toArray();

      if (orders.length === 0) {
        return res.status(404).json({
          message:
            "No se encontraron órdenes que coincidan con los criterios proporcionados.",
        });
      }

      res.status(200).json({
        message:
          filter && Object.keys(filter).length > 0
            ? "Órdenes encontradas con los filtros proporcionados"
            : "Todas las órdenes recuperadas",
        orders,
      });
    } catch (error) {
      console.error("Error al consultar órdenes:", error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
