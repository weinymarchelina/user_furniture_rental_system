import Image from "next/image";
import styles from "./page.module.css";
import GetCurrentUser from "../components/crud/GetCurrentUser";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Testimonies from "../components/ui/Testimonies";
import Hero from "../components/ui/Hero";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>

      <GetCurrentUser />
      <Hero />
      <Testimonies />
    </div>
  );
}
