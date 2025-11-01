// frontend/src/pages/PageRoutes.jsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProductDetail from "./products/detail/ProductDetail"; // ✅ detalle

// Rutas principales cargadas con lazy
const Home = lazy(() => import("./home/Home"));
const About = lazy(() => import("./about/About"));
const Contact = lazy(() => import("./contact/Contact"));
const Products = lazy(() => import("./products/Products"));
const Product = lazy(() => import("./product/Product")); // ✅ este es tu formulario (crear/editar)
const ShoppingCart = lazy(() => import("./shopping-cart/ShoppingCart"));

const PageRoutes = () => {
  return (
    <Suspense fallback="Cargando página...">
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Secciones informativas */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Productos */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<Product />} />

        {/* ✅ NUEVA ruta para EDICIÓN (abre el formulario precargado) */}
        <Route path="/products/:id/edit" element={<Product />} />

        {/* Detalle del producto */}
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Carrito de compras */}
        <Route path="/shopping-cart" element={<ShoppingCart />} />
      </Routes>
    </Suspense>
  );
};

export default PageRoutes;
