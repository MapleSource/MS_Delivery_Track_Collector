import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import Module from "@/stories/Layout/Module/Module";
import DeliveryTable from "@/stories/DataDisplay/DeliveryTable/DeliveryTable";
import { deliveryPackageHeaders } from "@/data/headers";
import Styles from "./Delivery.module.css";
import Modal from "@/stories/Modals/Modal/Modal";

interface Package {
  package_id: string;
  recipient_name: string;
  package_distance: number;
  package_status: string;
  package_group_route?: string;
  recipient_address: string;
}

const Delivery: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleEnd = () => {
    if (typeof window !== "undefined") {
      if (sigCanvas.current) {
        const dataURL = sigCanvas.current.toDataURL();
        setSignature(dataURL);
      }
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get("/api/mongodb/get-delivery-packages");

      setPackages(
        response.data.packages.sort(
          (a: Package, b: Package) => a.package_distance - b.package_distance
        )
      );
    } catch (error) {
      console.error("Error al cargar los paquetes:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleComplete = async () => {
    if (!signature || !photo || !selectedPackage) {
      // if (typeof window !== "undefined") {
      //   message.error(
      //     "Se requiere la firma y la evidencia para completar la entrega"
      //   );
      // }
      return;
    }

    try {
      await axios.post(`/api/mongodb/packages/update-status`, {
        package_id: selectedPackage.package_id,
        package_sign: signature,
        package_evidence: photo,
        package_status: "Entregado",
      });
      // if (typeof window !== "undefined") {
      //   message.success("Entrega completada exitosamente");
      // }
      fetchPackages();
      closeModal();
    } catch (error) {
      if (typeof window !== "undefined") {
        message.error("Error al completar la entrega");
      }
    }
  };

  const handleProblem = async () => {
    if (!problem || !selectedPackage) {
      // if (typeof window !== "undefined") {
      //   message.error("Seleccione un problema para reportar");
      // }
      return;
    }

    try {
      await axios.post(`/api/mongodb/packages/report-problem`, {
        package_id: selectedPackage.package_id,
        package_status: problem,
      });
      // if (typeof window !== "undefined") {
      //   message.success("Problema reportado exitosamente");
      // }
      fetchPackages();
      closeModal();
    } catch (error) {
      // if (typeof window !== "undefined") {
      //   message.error("Error al reportar el problema");
      // }
    }
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setSignature(null);
    setPhoto(null);
    setProblem(null);
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setIsModalOpen(false);
  };

  const handleTakePhoto = async () => {
    try {
      if (typeof window !== "undefined") {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const video = document.createElement("video");
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL("image/png");
        setPhoto(imageData);

        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      // if (typeof window !== "undefined") {
      //   message.error("Error al tomar la foto");
      // }
    }
  };

  return (
    <Module>
      <h2>Paquetes de Repartidor-01</h2>
      <br />
      <a
        target="_blank"
        href={packages[0]?.package_group_route}
        style={{ color: "blue" }}
      >
        Ruta mas optima en Google Maps
      </a>
      <br />
      <br />
      <DeliveryTable
        headers={deliveryPackageHeaders}
        data={packages}
        renderAction={(pkg: any) => (
          <button
            disabled={pkg.package_status !== "En Reparto"}
            onClick={() => {
              setSelectedPackage(pkg);
              setIsModalOpen(true);
            }}
          >
            {pkg.package_status === "Entregado" ||
            pkg.package_status !== "En Reparto"
              ? "Completado"
              : "Completar"}
          </button>
        )}
      />

      {isModalOpen && (
        <Modal title="Completar Entrega" onClose={() => setIsModalOpen(false)}>
          {selectedPackage && (
            <div>
              <p>Persona que recibe: {selectedPackage.recipient_name}</p>
              <p>Direccion: {selectedPackage.recipient_address}</p>
              <br />
              <p>Firma:</p>
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: Styles.SignatureCanvas,
                }}
                onEnd={handleEnd}
              />
              <br />
              <button onClick={handleTakePhoto}>Tomar Foto</button>
              {photo && (
                <img
                  src={photo}
                  alt="Evidencia"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
              <button disabled={!signature || !photo} onClick={handleComplete}>
                Completar Entrega
              </button>
              <select
                defaultValue="Reportar Problema"
                onChange={(e) => setProblem(e.target.value)}
                style={{ width: "100%", marginTop: "10px" }}
              >
                <option value="Domicilio no encontrado">
                  Domicilio no encontrado
                </option>
                <option value="No se recibió">No se recibió</option>
                <option value="No había nadie">No había nadie</option>
                <option value="Paquete extraviado">Paquete extraviado</option>
                <option value="Paquete dañado">Paquete dañado</option>
                <option value="Paquete robado">Paquete robado</option>
              </select>
              <button onClick={handleProblem} style={{ marginTop: "10px" }}>
                Reportar Problema
              </button>
            </div>
          )}
        </Modal>
      )}
    </Module>
  );
};

export default Delivery;
