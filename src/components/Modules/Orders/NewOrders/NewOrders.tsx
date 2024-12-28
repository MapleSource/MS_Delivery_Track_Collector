import React, { useEffect, useState } from "react";
import axios from "axios";
import Module from "@/stories/Layout/Module/Module";
import OrderCard from "@/stories/Cards/OrderCard/OrderCard";
import Grid from "@/stories/Layout/Grid/Grid";
import Title from "@/stories/Typography/Title/Title";
import Label from "@/stories/Typography/Label/Label";

type Order = {
  _id: string;
  order_id: string;
  client_name: string;
  created_at: string;
  status: string;
  collection_date: string;
  packages: string[];
};

const NewOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Record<string, Date>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/mongodb/orders/get-orders`, {
          params: { status: "Orden Creada" },
        });
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

  const handleUpdateStatus = async (orderId: string, selectedDate: Date) => {
    try {
      setLoading(true);
      await axios.post(`/api/mongodb/update-order-status`, {
        orderId,
        collection_date: selectedDate,
      });
      const response = await axios.get(`/api/mongodb/orders/get-orders`, {
        params: { status: "Orden Creada" },
      });
      setOrders(response.data.orders);
    } catch (err) {
      setError("Orden Aprobada");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (orderId: string, date: Date) => {
    setSelectedDates((prev) => ({
      ...prev,
      [orderId]: date,
    }));
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <Module>
        <p>{error}</p>
      </Module>
    );
  }

  return (
    <Module>
      <Title title="Programar Ordenes" />
      <Label label="Programa la fecha de recolección de la orden " />
      <br />
      <Grid gridTemplateColumns="1fr" rowGap="15px">
        {orders.map((order, index) => (
          <OrderCard
            key={index}
            id={order.order_id}
            status={order.status}
            client={order.client_name}
            updated={order.created_at}
            onUpdateStatus={handleUpdateStatus}
            onChange={(date) => handleDateChange(order.order_id, date)}
            value={selectedDates[order.order_id]}
          />
        ))}
      </Grid>
    </Module>
  );
};

export default NewOrders;
