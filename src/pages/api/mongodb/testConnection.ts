import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("runner");
    const collections = await db.listCollections().toArray();

    res.status(200).json({ success: true, collections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Database error" });
  }
}
