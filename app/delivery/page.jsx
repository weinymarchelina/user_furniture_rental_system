"use client";

import Image from "next/image";
import CreateDelivery from "../../components/crud/CreateDelivery";
import Deliveries from "../../components/crud/Deliveries";
import Footer from "../../components/ui/Footer";

export default function Delivery() {
  return (
    <div>
      <h1>Delivery List</h1>
      <Deliveries />
      <Footer />
    </div>
  );
}
