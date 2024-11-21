import Image from "next/image";
import styles from "./page.module.css";
import GetCurrentUser from "../components/crud/GetCurrentUser";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <GetCurrentUser />
    </div>
  );
}
