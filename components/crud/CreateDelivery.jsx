"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Grid,
} from "@mui/material";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(";").shift();
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

const CreateDelivery = () => {
  const [product, setProduct] = useState(null);
  const [rentalTime, setRentalTime] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const productInfo = getCookie("product");
    if (productInfo) {
      setProduct(JSON.parse(productInfo));
    } else {
      router.push("/product");
    }
  }, [router]);

  useEffect(() => {
    if (product && orderAmount > 0 && rentalTime > 0) {
      const calculatedPrice = product.gPrice * orderAmount * rentalTime;
      setTotalPrice(calculatedPrice);
    }
  }, [orderAmount, rentalTime, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const userID = getCookie("auth");

      if (!userID) {
        setErrorMessage("User not authenticated.");
        return;
      }

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
          userId: userID,
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

      deleteCookie("product");

      console.log("Delivery order registered successfully", data);
      setErrorMessage("");
      router.push("/delivery");
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {product && (
        <form onSubmit={handleSubmit}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="140"
              image={product.gImage}
              alt={product.gType}
            />
            <CardContent>
              <Typography variant="h6">Type: {product.gType}</Typography>
              <Typography variant="body1">Price: ${product.gPrice}</Typography>
            </CardContent>
          </Card>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Order Amount"
                type="number"
                fullWidth
                inputProps={{ min: 1, max: product.gNum }}
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rental Time"
                type="number"
                fullWidth
                inputProps={{ min: 1 }}
                value={rentalTime}
                onChange={(e) => setRentalTime(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Destination"
                type="text"
                fullWidth
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </Grid>
          </Grid>
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">
              Total Price:{" "}
              <span style={{ fontWeight: "bold" }}>${totalPrice}</span>
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Check Out
          </Button>
        </form>
      )}
    </Box>
  );
};

export default CreateDelivery;
