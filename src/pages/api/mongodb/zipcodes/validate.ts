/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";

export default async function validateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { zip_code } = req.body;
    if (!zip_code) {
      return res.status(400).json({ error: "Zip code no proporcionado" });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Falta GOOGLE_MAPS_API_KEY en el entorno" });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zip_code}|country:MX&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        return res.status(404).json({
          error: "No se encontró información para este código postal",
        });
      }

      const result = data.results[0];
      const { lat, lng } = result.geometry.location;

      const addressComponents = result.address_components;

      let municipality;
      const municipalityComponent = addressComponents.find((comp: any) =>
        comp.types.includes("locality")
      );
      if (municipalityComponent) {
        municipality = municipalityComponent.long_name;
      }

      let colony;
      const colonyComponent = addressComponents.find((comp: any) =>
        comp.types.includes("sublocality")
      );
      if (colonyComponent) {
        colony = colonyComponent.long_name;
      }

      return res.status(200).json({
        lat,
        long: lng,
        municipality,
        colony,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
