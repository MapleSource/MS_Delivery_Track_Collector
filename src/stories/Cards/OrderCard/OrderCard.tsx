import React from "react";
import Styles from "./OrderCard.module.css";
import Grid from "@/stories/Layout/Grid/Grid";
import StatusTag from "@/stories/Feedback/StatusTag/StatusTag";
import { orderStatus } from "@/data/status";
import Image from "next/image";
import Divider from "@/stories/Utilities/Divider/Divider";
import LastUpdated from "@/stories/DataDisplay/LastUptdated/LastUpdated";
import { orderInfo } from "@/data/orders";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GeneratePackagesPDF from "@/components/Orders/GeneratePackagesPDF/GeneratePackagesPDF";
import { es } from "date-fns/locale/es";
import { formatDateWithOffset } from "@/utils/formatDate";
import useScreenWidth from "@/utils/useScreenWidth";
registerLocale("es", es);

interface OrderCardProps {
  key: number;
  id: string;
  status: string;
  client: string;
  updated: string;
  onUpdateStatus?: (orderId: string, value: Date) => void;
  onChange?: (date: Date) => void;
  value?: Date;
  collection_date?: string;
  onOpenModal?: (orderId: string) => void;
  type?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  key,
  id,
  status,
  client,
  updated,
  onUpdateStatus,
  onChange,
  value,
  collection_date = "01/01/2024",
  onOpenModal,
  type,
}) => {
  const { card, text, button, picker } = Styles;
  const screenWidth = useScreenWidth();
  const matchedStatus =
    orderStatus.find((item) => item.name === status) || orderStatus[0];

  return (
    <div className={card} key={key}>
      <Grid
        gridTemplateColumns={screenWidth < 1024 ? "1fr" : "auto auto 1fr"}
        rowGap="10px"
      >
        <StatusTag status={matchedStatus} />
        <p className={text}>
          #{id} - {client}
        </p>
      </Grid>
      <br />
      <Grid gridTemplateColumns="auto auto auto auto 1fr">
        {orderInfo.map((element, index) => (
          <Grid
            key={index}
            gridTemplateColumns={screenWidth < 1024 ? "1fr" : "auto auto 1fr"}
            rowGap="10px"
          >
            <Grid gridTemplateColumns="20px auto">
              <Image
                src={element.icon}
                alt={element.name}
                width={20}
                height={20}
              />
              <p>Fecha de Recolección:</p>
            </Grid>
            {onUpdateStatus ? (
              <div className={picker}>
                <DatePicker
                  selected={value}
                  onChange={(date) => {
                    if (date && onChange) {
                      onChange(date);
                    }
                  }}
                  locale="es"
                  dateFormat="Pp"
                  placeholderText="Selecciona una fecha"
                />
              </div>
            ) : (
              <p className={text}>{formatDateWithOffset(collection_date)}</p>
            )}
          </Grid>
        ))}
      </Grid>
      <Divider margin="10px" />
      <Grid
        gridTemplateColumns={screenWidth < 1024 ? "1fr" : "auto 1fr auto"}
        rowGap="10px"
      >
        <LastUpdated datetime={updated} />
        <div />
        {onOpenModal ? (
          <button className={button} onClick={() => onOpenModal(id)}>
            Validar orden
          </button>
        ) : onUpdateStatus ? (
          <button
            className={button}
            onClick={() => onUpdateStatus(id, value ?? new Date())}
          >
            Actualizar
          </button>
        ) : type ? (
          <></>
        ) : (
          <GeneratePackagesPDF order_id={id} status={status} />
        )}
      </Grid>
    </div>
  );
};

export default OrderCard;
