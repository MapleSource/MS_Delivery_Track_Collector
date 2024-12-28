import React, { useEffect, useRef, useState } from "react";
import Styles from "./BarcodeScanner.module.css";
// @ts-ignore
import Quagga from "quagga";
import axios from "axios";

interface Package {
  package_id: string;
  package_updated_at: string;
  package_status: string;
  order_id: string;
}

interface BarcodeScannerProps {
  packages: Package[];
  onValidation: () => void;
  invalid_status: string;
  valid_status: string;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  packages,
  onValidation,
  invalid_status,
  valid_status,
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const { camera } = Styles;

  useEffect(() => {
    if (videoRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: videoRef.current,
            constraints: {
              facingMode: "environment",
            },
          },
          decoder: {
            readers: ["code_128_reader"],
          },
        },
        (error: any) => {
          if (error) {
            console.error("Error al inicializar Quagga:", error);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((data: any) => {
        const code = data.codeResult.code;
        setScannedCode(code);
        validatePackage(code);
      });
    }

    return () => {
      Quagga.stop();
    };
  }, []);

  const validatePackage = async (barcode: string) => {
    const packageToUpdate = packages.find(
      (pkg) =>
        pkg.package_id === barcode && pkg.package_status === invalid_status
    );

    if (packageToUpdate) {
      try {
        await axios.post(`/api/mongodb/update-status`, {
          package_id: barcode,
          package_status: valid_status,
        });
        console.log(`Paquete ${barcode} actualizado a ${valid_status}`);
        onValidation(); // Refrescar lista después de actualizar
      } catch (error) {
        console.error(`Error al actualizar el paquete ${barcode}:`, error);
      }
    }
  };

  return (
    <div>
      <div
        ref={videoRef}
        style={{ width: "100%", height: "250px", backgroundColor: "#000" }}
        className={camera}
      ></div>
      {scannedCode && (
        <div>
          <h4>Último código escaneado:</h4>
          <p>{scannedCode}</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
