"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";

const Products = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const getProducts = async () => {
    try {
      const response = await fetch("/api/products/get");

      if (!response.ok) {
        throw new Error("Failed to fetch products! Status: " + response.status);
      }

      const data = await response.json();

      const filteredSortedProducts = data.products
        .filter((product) => product.gNum > 0)
        .sort((a, b) => a.gID - b.gID);

      setProducts(filteredSortedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuy = (product) => {
    document.cookie = `product=${JSON.stringify(
      product
    )}; path=/; max-age=3600`;

    router.push("/checkout");
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      {products?.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={product.gID}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  width: "100%",
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {product.gImage && (
                  <CardMedia
                    component="img"
                    alt={product.gType}
                    height="200"
                    image={product.gImage}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.gType}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Price: ${product.gPrice}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available: {product.gNum}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => handleBuy(product)}
                  >
                    Buy
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center">
          No products available
        </Typography>
      )}
    </div>
  );
};

export default Products;
