"use client";

import { useState, useEffect } from "react";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch deliveries
  const getDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries/get");

      if (!response.ok) {
        throw new Error(
          "Failed to fetch deliveries! Status: " + response.status
        );
      }

      const data = await response.json();
      setDeliveries(data.deliveries);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch products
  const getProducts = async () => {
    try {
      const response = await fetch("/api/products/get");

      if (!response.ok) {
        throw new Error("Failed to fetch products! Status: " + response.status);
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDeliveries();
    getProducts();
  }, []);

  return (
    <div>
      <h2>Deliveries</h2>
      {deliveries?.length > 0 &&
        deliveries.map((delivery) => {
          // Find the corresponding product for the current delivery
          const product = products.find((p) => p.gID === delivery.gID);

          return (
            <div key={delivery.dID}>
              <h3>Delivery to: {delivery.d_destination}</h3>
              <p>Rental Time: {delivery.d_rentalTime}</p>
              <p>Order Amount: {delivery.d_orderAmount}</p>

              {/* Show product details if found */}
              {product ? (
                <div>
                  <h4>Product Details:</h4>
                  <p>Type: {product.gType}</p>
                  <p>Price: {product.gPrice}</p>
                  <p>Available Quantity: {product.gNum}</p>
                </div>
              ) : (
                <p>Product details not found for gID: {delivery.gID}</p>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Deliveries;
