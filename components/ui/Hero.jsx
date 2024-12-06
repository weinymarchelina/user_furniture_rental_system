"use client";

import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const handleShopNow = () => {
    router.push("/product");
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "500px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        my: 5,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Image
          src="/bg.jpg"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></Box>

      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          zIndex: 2,
          p: 3,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Rent Furniture for Every Need
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Flexible rental options for home, office, and events.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, p: 1.5, fontSize: 16 }}
          onClick={handleShopNow}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
