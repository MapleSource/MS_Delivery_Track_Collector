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

      const { order_id, status } = req.body;

      // Validar que se proporcionen los datos necesarios
      if (!order_id || typeof order_id !== "string") {
        return res
          .status(400)
          .json({ message: "El order_id es requerido y debe ser un string." });
      }
      if (!status || typeof status !== "string") {
        return res
          .status(400)
          .json({ message: "El status es requerido y debe ser un string." });
      }

      // Actualizar el estado de la orden
      const result = await db
        .collection("orders")
        .updateOne({ order_id }, { $set: { status } });

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: `No se encontró ninguna orden con el order_id: ${order_id}`,
        });
      }

      res.status(200).json({
        message: `El estado de la orden con order_id ${order_id} se actualizó a ${status}`,
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
