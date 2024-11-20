"use client";

import Image from "next/image";
import CreateDelivery from "../../components/crud/CreateDelivery";
import Deliveries from "../../components/crud/Deliveries";

export default function Delivery() {
  return (
    <div>
      <h1>Delivery List</h1>
      <Deliveries />
    </div>
  );
}
