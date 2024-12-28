import React, { useEffect, useState } from "react";
import axios from "axios";
import Module from "@/stories/Layout/Module/Module";
import OrderCard from "@/stories/Cards/OrderCard/OrderCard";
import Grid from "@/stories/Layout/Grid/Grid";
import Title from "@/stories/Typography/Title/Title";

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

const CheckOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/mongodb/orders/get-orders`);
        setOrders(response.data.orders);
      } catch (err) {
        setError("Error al cargar órdenes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenModal = async (orderId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/mongodb/packages/get-packages`, {
        params: { order_id: orderId },
      });
      setPackages(response.data.packages);
      setSelectedOrder(orderId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener los paquetes:", error);
      setError("No se pudieron cargar los paquetes.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <Module>
        <Title title="Todas las ordenes" />
        <p>{error}</p>
      </Module>
    );
  }

  return (
    <Module>
      <Title title="Todas las ordenes" />
      <br />
      <Grid gridTemplateColumns="1fr" rowGap="15px">
        {orders.map((order, index) => (
          <OrderCard
            key={index}
            id={order.order_id}
            status={order.status}
            client={order.client_name}
            updated={order.created_at}
            collection_date={order.collection_date}
            type="consulting"
          />
        ))}
      </Grid>
    </Module>
  );
};

export default CheckOrders;
