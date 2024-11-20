import { useState } from "react";

const CreateDelivery = () => {
  const [goodsId, setGoodsId] = useState(0);
  const [rentalTime, setRentalTime] = useState(0);
  const [orderAmount, setOrderAmount] = useState(0);
  const [destination, setDestination] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before making the request
    if (!goodsId.trim()) {
      setErrorMessage("Goods ID is required and must be a valid string.");
      return;
    }

    const parsedGoodsId = parseInt(goodsId, 10);
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
      const response = await fetch("/api/deliveries/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goodsId: parsedGoodsId,
          rentalTime: parsedRentalTime,
          orderAmount: parsedOrderAmount,
          destination,
          userId: "67389bd7c5d0ceb4b46e17e5",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        console.log("Delivery order registered successfully", data);
        setErrorMessage(""); // Clear error message on success
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </div>
      ) : null}
      <form onSubmit={handleSubmit}>
        <label>
          Goods ID:
          <input
            type="number"
            placeholder="Goods ID"
            value={goodsId}
            onChange={(e) => setGoodsId(e.target.value)}
            required
          />
        </label>
        <label>
          Order Amount:
          <input
            type="number"
            min="1"
            placeholder="Order Amount"
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Rental Time:
          <input
            type="number"
            min="1"
            placeholder="Rental Time"
            value={rentalTime}
            onChange={(e) => setRentalTime(e.target.value)}
            required
          />
        </label>
        <label>
          Destination:
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </label>
        <button type="submit">Check Out</button>
      </form>
    </>
  );
};

export default CreateDelivery;
