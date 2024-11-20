"use client";

import Image from "next/image";
import CreateDelivery from "../../components/crud/CreateDelivery";
import Deliveries from "../../components/crud/Deliveries";

export default function Checkout() {
  return (
    <div>
      <h1>Checkout List</h1>
      <CreateDelivery />
    </div>
  );
}
