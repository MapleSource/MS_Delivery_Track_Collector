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

      const { order_id, user_sub, package_status } = req.query;

      const filter: Record<string, unknown> = {};
      if (typeof order_id === "string" && order_id !== "")
        filter.order_id = order_id;
      if (typeof user_sub === "string" && user_sub !== "")
        filter.assigned_delivery_person = user_sub;
      if (typeof package_status === "string" && package_status !== "")
        filter.status = package_status;

      const packages = await db.collection("packages").find(filter).toArray();

      if (packages.length === 0) {
        return res.status(404).json({
          message:
            "No se encontraron paquetes que coincidan con los criterios proporcionados.",
        });
      }

      res.status(200).json({
        message:
          Object.keys(filter).length > 0
            ? "Paquetes encontrados con los filtros proporcionados"
            : "Todos los paquetes recuperados",
        packages,
      });
    } catch (error) {
      console.error("Error al obtener paquetes:", error);
      res.status(500).json({
        message: "Error en el servidor",
        error: (error as Error).message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
