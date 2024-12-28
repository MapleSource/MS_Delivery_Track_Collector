import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("runner");
  const { customerId } = req.query;

  const orders = await db
    .collection("orders")
    .find({ customer_id: customerId })
    .toArray();

  res.status(200).json({ orders });
}
