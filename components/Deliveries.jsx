"use client";

import { useState } from "react";
import { useEffect } from "react";

const deliveries = () => {
  const [deliveries, setdeliveries] = useState([]);

  const getDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries/get");

      if (!response.ok) {
        throw new Error(
          "Failed to fetch deliveries! Status: " + response.status
        );
      }

      const data = await response.json();
      console.log(data.deliveries);
      setdeliveries(data.deliveries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDeliveries();
  }, []);

  return (
    <div>
      <h2>deliveries</h2>
      {deliveries?.length > 0 &&
        deliveries.map((delivery) => (
          <div key={delivery.dID}>
            <h3>{delivery.gID}</h3>
            <p>{delivery.d_destination}</p>
          </div>
        ))}
    </div>
  );
};

export default deliveries;
