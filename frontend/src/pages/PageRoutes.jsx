import { Route, Routes } from "react-router-dom";

import { lazy, Suspense } from "react";

const Home = lazy(() => import("./home/Home"));
const About = lazy(() => import("./about/About"));
const Contact = lazy(() => import("./contact/Contact"));
const Products = lazy(() => import("./products/Products"));
const Product = lazy(() => import("./product/Product"));
const ShoppingCart = lazy(() => import("./shopping-cart/ShoppingCart"));

const PageRoutes = () => {
    return (
        <Suspense fallback="Cargando página...">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<Product />} />
                <Route path="/products/:id" element={<Product />} />
                <Route path="/shopping-cart" element={<ShoppingCart />} />
            </Routes>
        </Suspense>

    );
};

export default PageRoutes;