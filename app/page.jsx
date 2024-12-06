import Image from "next/image";
import styles from "./page.module.css";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Testimonies from "../components/ui/Testimonies";
import Hero from "../components/ui/Hero";
import Footer from "../components/ui/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <Testimonies />
      <Footer/>
    </div>
  );
}
