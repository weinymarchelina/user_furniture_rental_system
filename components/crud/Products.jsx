"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For redirection
import Image from "next/image"; // Next.js Image component for optimized images

const Products = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  // Function to get products from the server
  const getProducts = async () => {
    try {
      const response = await fetch("/api/products/get");

      if (!response.ok) {
        throw new Error("Failed to fetch products! Status: " + response.status);
      }

      const data = await response.json();
      // Filter out products with fewer than 1 gNum and sort by gID
      const filteredSortedProducts = data.products
        .filter((product) => product.gNum > 0) // Exclude products with gNum <= 0
        .sort((a, b) => a.gID - b.gID); // Sort products by gID (ascending)

      setProducts(filteredSortedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to set cookie with product info and redirect to checkout page
  const handleBuy = (product) => {
    // Store product info in cookies
    document.cookie = `product=${JSON.stringify(
      product
    )}; path=/; max-age=3600`;
    // Redirect to checkout page
    router.push("/checkout");
  };

  // Fetch products when component is mounted
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      {products?.length > 0 ? (
        products.map((product) => (
          <div
            key={product.gID}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              margin: "1rem",
            }}
          >
            <h3>{product.gType}</h3>
            <p>Price: ${product.gPrice}</p>
            <p>Available: {product.gNum}</p>
            {product.gImage && (
              <Image
                src={product.gImage} // Cloudinary image URL
                alt={product.gType}
                width={300} // Set the desired width
                height={300} // Set the desired height
                layout="intrinsic"
              />
            )}
            <button onClick={() => handleBuy(product)}>Buy</button>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default Products;
