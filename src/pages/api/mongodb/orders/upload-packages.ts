import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

type ZipCodeData = {
  lat: number;
  long: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("runner");

      const { packages, order_id } = req.body;

      if (!packages || packages.length === 0) {
        return res
          .status(400)
          .json({ message: "No hay datos para insertar en MongoDB" });
      }

      if (!order_id) {
        return res
          .status(400)
          .json({ message: "El campo `order_id` es requerido" });
      }

      // Obtener datos de zipCodes
      const zipCodesCollection = db.collection("zipCodes");
      const zipCodes = await zipCodesCollection
        .find({}, { projection: { zip_code: 1, lat: 1, long: 1 } })
        .toArray();
      const zipCodeMap = new Map<string, ZipCodeData>(
        zipCodes.map((zip) => [zip.zip_code, { lat: zip.lat, long: zip.long }])
      );

      const now = new Date();
      const year = String(now.getFullYear()).slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hour = String(now.getHours()).padStart(2, "0");

      const datePrefix = `${year}${month}${day}${hour}`;
      let sequence = 1;

      const packagesWithOrderId = packages.map((pkg: any) => {
        const packageId = `${datePrefix}${String(sequence).padStart(6, "0")}`;
        sequence++;

        const zipData: ZipCodeData | any =
          zipCodeMap.get(pkg.recipient_postal_code) || {};

        return {
          ...pkg,
          recipient_country: "Mexico",
          order_id: order_id,
          package_id: packageId,
          package_created_at: new Date(),
          package_updated_at: new Date(),
          package_status: "Orden Creada",
          package_notes: "",
          package_lat: zipData?.lat || null,
          package_long: zipData?.long || null,
          package_distance: 0,
        };
      });

      const result = await db
        .collection("packages")
        .insertMany(packagesWithOrderId);

      res
        .status(200)
        .json({ message: "Paquetes insertados exitosamente", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
