import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("runner");
      const ordersCollection = db.collection("orders");

      const lastOrder = await ordersCollection
        .find()
        .sort({ order_id: -1 })
        .limit(1)
        .toArray();
      const nextOrderId =
        lastOrder.length > 0
          ? `ORD${(parseInt(lastOrder[0].order_id.slice(3)) + 1)
              .toString()
              .padStart(6, "0")}`
          : "ORD000001";

      const newOrder = {
        order_id: nextOrderId,
        client_name: req.body.client_name,
        created_at: new Date(),
        updated_at: new Date(),
        status: req.body.status,
        collection_date: req.body.collection_date,
        user_sub: req.body.user_sub,
      };

      const result = await ordersCollection.insertOne(newOrder);

      res
        .status(200)
        .json({ order_id: nextOrderId, insertedId: result.insertedId });
    } catch (error) {
      console.error("Error al crear la orden:", error);
      res.status(500).json({ message: "Error al crear la orden" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
