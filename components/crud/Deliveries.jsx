"use client";
import { useState, useEffect } from "react";

// Helper function to read cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
};

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch deliveries based on user ID from the auth cookie
  const getDeliveries = async () => {
    try {
      const userID = getCookie("auth"); // Get user ID from the cookie

      if (!userID) {
        console.error("User not authenticated!");
        return; // Handle the case when the user is not authenticated
      }

      // Send the userID to the backend to fetch deliveries for that user
      const response = await fetch(`/api/deliveries/get`);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch deliveries! Status: " + response.status
        );
      }

      const data = await response.json();

      // Sort deliveries by the 'd_startDate' timestamp in descending order (latest first)
      const sortedDeliveries = data.deliveries.sort(
        (a, b) => new Date(b.d_startDate) - new Date(a.d_startDate)
      );
      setDeliveries(sortedDeliveries);
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

  // Function to determine the delivery status based on d_arriveDate
  const getDeliveryStatus = (arriveDate) => {
    const defaultDate = "1970-01-01T00:00:00Z";
    const isArrived =
      new Date(arriveDate).getTime() !== new Date(defaultDate).getTime();
    return isArrived
      ? {
          status: "Arrived",
          color: "green",
          arrivalDate: new Date(arriveDate).toLocaleDateString(), // Format arrival date
        }
      : { status: "Not Arrived", color: "red" };
  };

  return (
    <div>
      {deliveries?.length > 0 ? (
        deliveries.map((delivery) => {
          // Find the corresponding product for the current delivery
          const product = products.find((p) => p.gID === delivery.gID);

          // Calculate the total price (orderAmount * rentalTime * gPrice)
          const totalPrice = product
            ? delivery.d_orderAmount * delivery.d_rentalTime * product.gPrice
            : 0;

          // Get the status and color for the delivery based on d_arriveDate
          const { status, color, arrivalDate } = getDeliveryStatus(
            delivery.d_arriveDate
          );

          return (
            <div
              key={delivery.dID}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <h3>Delivery to: {delivery.d_destination}</h3>
              <p>Rental Time: {delivery.d_rentalTime} days</p>
              <p>Order Amount: {delivery.d_orderAmount}</p>

              {/* Delivery Status */}
              <p style={{ color: color, fontWeight: "bold" }}>
                Status: {status}
              </p>

              {/* Display the arrival date if the item has arrived */}
              {status === "Arrived" && (
                <p>Arrival Date: {arrivalDate}</p> // Display the arrival date
              )}

              {/* Show product details if found */}
              {product ? (
                <div>
                  <h4>Product Details:</h4>
                  <p>Type: {product.gType}</p>
                  <p>Price: ${product.gPrice}</p>
                  <p>Available Quantity: {product.gNum}</p>
                  <div>
                    <img src={product.gImage} alt={product.gType} width="100" />
                  </div>
                  <h5>Total Paid: ${totalPrice}</h5>
                </div>
              ) : (
                <p>Product details not found for gID: {delivery.gID}</p>
              )}
            </div>
          );
        })
      ) : (
        <p>No deliveries found.</p>
      )}
    </div>
  );
};

export default Deliveries;
