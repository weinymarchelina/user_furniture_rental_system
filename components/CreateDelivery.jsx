import { useState } from "react";

const CreateDelivery = () => {
  const [goodsId, setGoodsId] = useState("");
  const [rentalTime, setRentalTime] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [destination, setDestination] = useState("");

  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    // e.preventDefault();

    try {
      const response = await fetch("/api/deliveries/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // goodsId: goodsId,
          goodsId,
          rentalTime,
          orderAmount,
          destination,
          // type,
          // price,
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
      }

      return data;
    } catch (error) {}

    console.log({
      goodsId,
      rentalTime,
      orderAmount,
      destination,
    });
  };

  return (
    <>
      {errorMessage ? (
        <div className="error-message">Error: {errorMessage}</div>
      ) : null}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="order amount"
          value={price}
          onChange={(e) => setOrderAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="rental time"
          value={price}
          onChange={(e) => setRentalTime(e.target.value)}
          required
        />
        <input
          type="destination"
          placeholder="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <button type="submit">Check Out</button>
      </form>
    </>
  );
};

export default CreateDelivery;
