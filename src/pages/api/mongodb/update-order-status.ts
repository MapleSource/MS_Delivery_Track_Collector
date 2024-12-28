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

      const { orderId, selectedDate } = req.body;

      if (!orderId) {
        return res
          .status(400)
          .json({ message: "El campo `orderId` es requerido" });
      }

      await db.collection("orders").updateOne(
        { order_id: orderId },
        {
          $set: {
            updated_at: new Date(),
            collection_date: new Date(),
            status: "En Recolección",
          },
        }
      );

      await db
        .collection("packages")
        .updateMany(
          { order_id: orderId },
          { $set: { package_status: "En Recolección", updated_at: new Date() } }
        );

      res.status(200).json({ message: "Estatus actualizado exitosamente" });
    } catch (error) {
      console.error("Orden Actualizada", error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
