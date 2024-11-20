"use client";

import { useState } from "react";
import { useEffect } from "react";

const products = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await fetch("/api/products/get");

      if (!response.ok) {
        throw new Error("Failed to fetch products! Status: " + response.status);
      }

      const data = await response.json();
      console.log(data);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <h2>products</h2>
      {products?.length > 0 &&
        products.map((product) => (
          <div key={product.gID}>
            <h3>{product.gType}</h3>
            <p>{product.gPrice}</p>
          </div>
        ))}
    </div>
  );
};

export default products;

/*
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [number, setNumber] = useState("");
  const [goodsId, setGoodsId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
*/
