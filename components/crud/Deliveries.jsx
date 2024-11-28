"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, Box, Chip } from "@mui/material";

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
    <Box>
      {deliveries?.length > 0 ? (
        <Grid container spacing={3}>
          {deliveries.map((delivery) => {
            const product = products.find((p) => p.gID === delivery.gID);
            const totalPrice = product
              ? delivery.d_orderAmount *
                delivery.d_rentalTime *
                product.gPrice
              : 0;

            const { status, color, arrivalDate } = getDeliveryStatus(
              delivery.d_arriveDate
            );

            return (
              <Grid item xs={12} sm={6} md={4} key={delivery.dID}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {product?.gImage && (
                    <CardMedia
                      component="img"
                      alt={product.gType}
                      height="200"
                      image={product.gImage}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      Delivery to: {delivery.d_destination}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rental Time: {delivery.d_rentalTime} days
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Order Amount: {delivery.d_orderAmount}
                    </Typography>
                    <Chip
                      label={`Status: ${status}`}
                      color={status === "Arrived" ? "success" : "error"} //green and red color
                      sx={{ mt: 1,  }}
                    />
                    {status === "Arrived" && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Arrival Date: {arrivalDate}
                      </Typography>
                    )}

                    {product ? (
                      <>
                        <Typography variant="subtitle1" component="div" sx={{ mt: 2 }}>
                          Product Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type: {product.gType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${product.gPrice}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available Quantity: {product.gNum}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                          Total Paid: ${totalPrice}
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                      >
                        Product details not found for gID: {delivery.gID}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant="h6" align="center">
          No deliveries found.
        </Typography>
      )}
    </Box>
  );
};

export default Deliveries;
