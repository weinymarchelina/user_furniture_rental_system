"use client";

import Image from "next/image";
import Products from "../../components/crud/Products";

export default function Product() {
  return (
    <div>
      <h1>Product List</h1>
      <Products />
    </div>
  );
}
