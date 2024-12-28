import React, { useEffect, useState } from "react";
import axios from "axios";
import Module from "@/stories/Layout/Module/Module";
import OrderCard from "@/stories/Cards/OrderCard/OrderCard";
import Grid from "@/stories/Layout/Grid/Grid";
import Title from "@/stories/Typography/Title/Title";
import Label from "@/stories/Typography/Label/Label";
import Modal from "@/stories/Modals/Modal/Modal";
import BarcodeScanner from "../../BarcodeScanner/BarcodeScanner";
import { validatePackageHeaders } from "@/data/headers";
import VerifyTable from "@/stories/DataDisplay/VerifyTable/VerifyTable";
import Button from "@/stories/Buttons/Button/Button";
import { message } from "antd";

type Order = {
  _id: string;
  order_id: string;
  client_name: string;
  created_at: string;
  status: string;
  collection_date: string;
  packages: string[];
};

type Package = {
  package_id: string;
  package_updated_at: string;
  package_status: string;
  order_id: string;
};

const VerifyOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/mongodb/orders/get-orders`, {
        params: { status: "En Recolección" },
      });
      setOrders(response.data.orders);
    } catch (err) {
      setError("Error al cargar órdenes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchPackages = async (orderId: string) => {
    try {
      const response = await axios.get(`/api/mongodb/packages/get-packages`, {
        params: { order_id: orderId },
      });
      const sortedPackages = response.data.packages.sort(
        (a: Package, b: Package) =>
          a.package_status.localeCompare(b.package_status)
      );
      setPackages(sortedPackages);
    } catch (error) {
      console.error("Error al obtener los paquetes:", error);
      setError("No se pudieron cargar los paquetes.");
    }
  };

  const validateButtonState = (packages: Package[]) => {
    const allPackagesValid = packages.every(
      (pkg) => pkg.package_status !== "En Recolección"
    );
    setIsButtonDisabled(!allPackagesValid);
  };

  const handleOpenModal = async (orderId: string) => {
    setLoading(true);
    await fetchPackages(orderId);
    setSelectedOrder(orderId);
    setIsModalOpen(true);
    setLoading(false);
  };

  const handlePackageValidation = async () => {
    if (selectedOrder) {
      await fetchPackages(selectedOrder);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.post(`/api/mongodb/update-status`, {
        package_id: id,
        package_status: newStatus,
      });
      console.log(`Estado del paquete ${id} actualizado a ${newStatus}`);
      const updatedPackages = packages.map((pkg) =>
        pkg.package_id === id ? { ...pkg, package_status: newStatus } : pkg
      );
      setPackages(updatedPackages);
      validateButtonState(updatedPackages);
    } catch (error) {
      console.error(`Error al actualizar el estado del paquete ${id}:`, error);
    }
  };

  const handleOrderStatusUpdate = async (newStatus: string) => {
    if (selectedOrder) {
      try {
        await axios.post(`/api/mongodb/orders/update-order-status`, {
          order_id: selectedOrder,
          status: newStatus,
        });
        console.log(
          `Estado de la orden ${selectedOrder} actualizado a "${newStatus}"`
        );
        setIsModalOpen(false);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === selectedOrder
              ? { ...order, status: newStatus }
              : order
          )
        );
        if (typeof window !== "undefined") {
          message.success(
            newStatus === "En Transito"
              ? "Orden Verificada"
              : "Orden Actualizada a En Almacén"
          );
        }
        await fetchOrders();
      } catch (error) {
        console.error(
          `Error al actualizar el estado de la orden ${selectedOrder}:`,
          error
        );
      }
    }
  };

  const handlePackagesStatusUpdate = async (newStatus: string) => {
    try {
      const updatedPackages = await Promise.all(
        packages.map(async (pkg) => {
          await axios.post(`/api/mongodb/update-status`, {
            package_id: pkg.package_id,
            package_status: newStatus,
          });
          return { ...pkg, package_status: newStatus };
        })
      );
      console.log(`Todos los paquetes actualizados a ${newStatus}`);
      setPackages(updatedPackages);
      validateButtonState(updatedPackages);
      if (typeof window !== "undefined") {
        message.success(
          newStatus === "En Transito"
            ? "Paquetes Verificados"
            : "Paquetes Actualizados a En Reparto"
        );
      }
    } catch (error) {
      console.error(`Error al actualizar el estado de los paquetes:`, error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <Module>
        <Title title="Verificar orden a recolectar" />
        <Label label="Consulta y valida las órdenes en recolección" />
        <br />
        <p>{error} No se encontraron elementos</p>
      </Module>
    );
  }

  return (
    <Module>
      <Title title="Verificar orden a recolectar" />
      <Label label="Consulta y valida las órdenes en recolección" />
      <br />
      <Grid gridTemplateColumns="1fr" rowGap="15px">
        {orders.map((order, index) => (
          <OrderCard
            key={index}
            id={order.order_id}
            status={order.status}
            client={order.client_name}
            updated={order.created_at}
            onOpenModal={handleOpenModal}
          />
        ))}
      </Grid>
      {isModalOpen && (
        <Modal
          title={`Escanear la Orden ${selectedOrder}`}
          onClose={() => setIsModalOpen(false)}
        >
          <BarcodeScanner
            packages={packages}
            onValidation={handlePackageValidation}
            invalid_status="En Recolección"
            valid_status="En Transito"
          />
          <VerifyTable
            headers={validatePackageHeaders}
            data={packages}
            onStatusChange={handleStatusChange}
            invalid_status="En Recolección"
            valid_status="En Transito"
          />
          <br />
          <Grid>
            <Button
              disabled={isButtonDisabled}
              label="Finalizar Validacion"
              onClick={() => handleOrderStatusUpdate("En Transito")}
            />
            <Button
              disabled={isButtonDisabled}
              label="Repartir"
              onClick={() => {
                handleOrderStatusUpdate("En Almacén"),
                  handlePackagesStatusUpdate("En Almacén");
              }}
            />
          </Grid>
        </Modal>
      )}
    </Module>
  );
};

export default VerifyOrder;
