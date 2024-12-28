// src/components/ActiveOrders.tsx

import React, { useState } from "react";
import Styles from "./Table.module.css";

interface OrderData {
  order_id: string;
  client_name: string;
  creation_date: string;
  status: string;
  collection_date: string;
  packages: string[];
}

const ActiveOrders: React.FC = () => {
  const { content } = Styles;
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchActiveOrders = async () => {
    try {
      const response = await fetch("/api/mongodb/get-active-orders");
      const data = await response.json();
      setOrders(data.orders);
      setHasFetched(true);
    } catch (error) {
      console.error("Error al obtener órdenes activas:", error);
    }
  };

  return (
    <div className={content}>
      <button onClick={fetchActiveOrders}>Buscar Órdenes Activas</button>

      {hasFetched && orders.length > 0 ? (
        <table
          style={{
            border: "1px solid black",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th>ID de Orden</th>
              <th>Cliente</th>
              <th>Fecha de Creación</th>
              <th>Estatus</th>
              <th>Fecha de Recolección</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.client_name}</td>
                <td>{new Date(order.creation_date).toLocaleString()}</td>
                <td>{order.status}</td>
                <td>{order.collection_date}</td>
                {/* <td>{order.packages.length}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : hasFetched && orders.length === 0 ? (
        <p>No se encontraron órdenes activas.</p>
      ) : null}
    </div>
  );
};

export default ActiveOrders;
