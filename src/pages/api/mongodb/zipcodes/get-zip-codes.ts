/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("runner");
  const collection = db.collection("zipCodes");

  switch (req.method) {
    case "GET":
      try {
        const zipCodes = await collection.find({}).toArray();
        return res.status(200).json(zipCodes);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const { zip_code, lat, long, municipality, colony } = req.body;
        if (!zip_code || !lat || !long) {
          return res.status(400).json({ error: "Datos incompletos" });
        }

        const result = await collection.insertOne({
          zip_code,
          lat,
          long,
          municipality,
          colony,
          created_at: new Date(),
          updated_at: new Date(),
        });

        return res
          .status(201)
          .json({ message: "codigo postal añadido", _id: result.insertedId });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      return res.status(405).json({ error: "Método no permitido" });
  }
}
