import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

interface PackageData {
  package_id: string;
  sender_name: string;
  recipient_name: string;
  recipient_address: string;
  recipient_zip: number;
  recipient_city: string;
  recipient_state: string;
  recipient_country: string;
  recipient_phone: string;
  recipient_email: string;
  recipient_postal_code: string;
  package_weight: number;
  package_dimensions: string;
  package_status: string;
  package_distance: number;
  package_lat: number;
  package_long: number;
  assigned_motorcycle: string;
}

const NEXT_PUBLIC_MONGO_URI = process.env.MONGODB_URI as string;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

const buildMapsURL = (addresses: string[]): string => {
  const waypoints = addresses.slice(1).map(encodeURIComponent).join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    addresses[0]
  )}&waypoints=${waypoints}&travelmode=motorcycle&avoid=tolls`;
};

const assignMotorcycles = (packages: any[]): any[] => {
  const groupedPackages: any[] = [];
  let currentGroup: any[] = [];
  let motorcycleCount = 1;

  packages.forEach((pkg, index) => {
    currentGroup.push(pkg);

    if (currentGroup.length === 56 || index === packages.length - 1) {
      currentGroup.forEach(
        (p) => (p.assigned_motorcycle = `repartidor_${motorcycleCount}`)
      );
      groupedPackages.push(...currentGroup);
      currentGroup = [];
      motorcycleCount++;
    }
  });

  return groupedPackages;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end("Method not allowed");

  try {
    const client = await MongoClient.connect(NEXT_PUBLIC_MONGO_URI);
    const db = client.db("runner");

    let packages = await db
      .collection("packages")
      .find({ package_status: "Por Asignar" })
      .sort({ package_distance: 1 })
      .toArray();

    if (packages.length === 0) {
      client.close();
      return res.status(404).json({ message: "No hay paquetes disponibles" });
    }

    packages = assignMotorcycles(packages);

    const groupedPackages = packages.reduce<Record<string, PackageData[]>>(
      (acc, pkg: any) => {
        if (!acc[pkg.assigned_motorcycle]) acc[pkg.assigned_motorcycle] = [];
        acc[pkg.assigned_motorcycle].push(pkg);
        return acc;
      },
      {}
    );

    const userLocation =
      "Bosque de Duraznos 65-Despacho 402 B-C, Bosque de las Lomas, Miguel Hidalgo, 11700 Ciudad de México, CDMX";

    const updates = [];
    for (const [motorcycle, group] of Object.entries(groupedPackages)) {
      const addresses = [
        userLocation,
        ...group.map(
          (pkg: any) =>
            `${pkg.recipient_address}, ${pkg.recipient_colony}, ${pkg.recipient_city}, ${pkg.recipient_zip}`
        ),
      ];

      if (addresses.length < 2) {
        continue;
      }

      const optimizedRouteURL = buildMapsURL(addresses);
      group.forEach((pkg: any) => {
        pkg.package_group_route = optimizedRouteURL;
        pkg.package_status = "En Reparto";
      });

      updates.push(
        ...group.map((pkg: any) =>
          db.collection("packages").updateOne(
            { _id: pkg._id },
            {
              $set: {
                package_group_route: optimizedRouteURL,
                assigned_motorcycle: pkg.assigned_motorcycle,
                package_status: "En Reparto",
              },
            }
          )
        )
      );
    }

    await Promise.all(updates);
    client.close();

    res.status(200).json({ message: "Rutas optimizadas generadas", packages });
  } catch (error) {
    console.error("Error al optimizar la ruta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
