import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import ProductsList from "./components/ProductsList";
import ProductDetail from "./components/ProductDetail";
import ProductEditor from "./components/ProductEditor";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GoToTop from "@/components/GoToTop";

export default function App() {
  return (
    <div>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route
            path="/products/new"
            element={<ProductEditor mode="create" />}
          />
          <Route
            path="/products/:id/edit"
            element={<ProductEditor mode="edit" />}
          />
        </Routes>
      </main>
      <Footer />
      <GoToTop />
    </div>
  );
}
