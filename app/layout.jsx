import "./globals.css";
import NavBar from "../components/ui/Navbar";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ThemeProvider from "../components/ui/ThemeProvider"; // Import the reusable ThemeProvider

export const metadata = {
  title: "FlexiFurnish",
  description:
    "Rent Furniture for Every Need: Flexible rental options for home, office, and events",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <NavBar />
          <ProtectedRoute>{children}</ProtectedRoute>
        </ThemeProvider>
      </body>
    </html>
  );
}
