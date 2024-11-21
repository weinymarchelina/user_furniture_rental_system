"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Helper function to read cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
};

// Helper function to delete cookies
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

const CreateDelivery = () => {
  const [product, setProduct] = useState(null); // To store product info
  const [rentalTime, setRentalTime] = useState(0);
  const [orderAmount, setOrderAmount] = useState(0);
  const [destination, setDestination] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0); // To store the calculated total price
  const router = useRouter();

  useEffect(() => {
    // Get product data from the cookie
    const productInfo = getCookie("product");
    if (productInfo) {
      setProduct(JSON.parse(productInfo)); // Parse cookie string to JSON
    } else {
      // If there is no product cookie, redirect to /product page
      router.push("/product");
    }
  }, [router]);

  useEffect(() => {
    // Update total price whenever orderAmount or rentalTime changes
    if (product && orderAmount > 0 && rentalTime > 0) {
      const calculatedPrice = product.gPrice * orderAmount * rentalTime;
      setTotalPrice(calculatedPrice);
    }
  }, [orderAmount, rentalTime, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before making the request
    if (!orderAmount || orderAmount > product.gNum) {
      setErrorMessage(`Order Amount must be between 1 and ${product.gNum}.`);
      return;
    }

    const parsedRentalTime = parseInt(rentalTime, 10);
    const parsedOrderAmount = parseInt(orderAmount, 10);

    if (isNaN(parsedRentalTime) || parsedRentalTime < 1) {
      setErrorMessage(
        "Rental Time must be an integer greater than or equal to 1."
      );
      return;
    }

    if (isNaN(parsedOrderAmount) || parsedOrderAmount < 1) {
      setErrorMessage(
        "Order Amount must be an integer greater than or equal to 1."
      );
      return;
    }

    try {
      console.log("create delivery");

      // Step 1: Get the user ID from the auth cookie
      const userID = getCookie("auth");

      if (!userID) {
        setErrorMessage("User not authenticated.");
        return;
      }

      // Step 2: Create the delivery order
      const response = await fetch("/api/deliveries/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gID: product.gID,
          pID: product.pID,
          rentalTime: parsedRentalTime,
          orderAmount: parsedOrderAmount,
          destination,
          userId: userID, // Use the actual userID from the auth cookie
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.error) {
        setErrorMessage(data.error);
        return;
      }

      console.log("update stock");

      // Step 3: Update product stock after successful delivery order
      const stockUpdateResponse = await fetch("/api/products/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pID: product.pID,
          orderAmount: parsedOrderAmount,
        }),
      });

      if (!stockUpdateResponse.ok) {
        throw new Error("Failed to update stock");
      }

      // Step 4: Remove the product cookie after the transaction is done
      deleteCookie("product");

      // Step 5: Redirect to delivery page after everything is done
      console.log("Delivery order registered successfully", data);
      setErrorMessage(""); // Clear error message on success
      router.push("/delivery"); // Navigate to the next page
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      {errorMessage && (
        <div className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </div>
      )}

      {product && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Type: <strong>{product.gType}</strong>
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              Price: <strong>${product.gPrice}</strong>
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              Image:
              <div>
                <img src={product.gImage} alt={product.gType} width="100" />
              </div>
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              Order Amount:
              <input
                type="number"
                min="1"
                max={product.gNum}
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                required
              />
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              Rental Time:
              <input
                type="number"
                min="1"
                value={rentalTime}
                onChange={(e) => setRentalTime(e.target.value)}
                required
              />
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              Destination:
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Total Price: ${totalPrice}</strong>
          </div>

          <button type="submit">Check Out</button>
        </form>
      )}
    </>
  );
};

export default CreateDelivery;
