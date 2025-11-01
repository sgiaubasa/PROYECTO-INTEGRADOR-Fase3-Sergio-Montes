// frontend/src/pages/products/Products.jsx
import { Text } from "@/components/texts";
import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductGallery from "./product-gallery/ProductGallery";
import "./products.scss";

const Products = () => {
  const { productsContext } = useContext(AppContext);
  const { filters, setFilters, isLoading } = productsContext;

  return (
    <section className="products-page">
      {/* Header con botón Nuevo producto */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Text variant="h2">Productos</Text>

        {/* Botón para crear un nuevo producto */}
        <Link to="/products/new" className="btn btn-primary">
          + Nuevo producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="products-page__filters">
        <div className="filters__group">
          <input
            type="text"
            className="filters__search"
            placeholder="Buscar por nombre…"
            value={filters.name ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, name: e.target.value }))
            }
          />
        </div>

        <label className="filters__check">
          <input
            type="checkbox"
            checked={filters.highlighted === true}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                highlighted: e.target.checked ? true : undefined,
              }))
            }
          />
          <span>Solo destacados</span>
        </label>

        {isLoading && <span className="filters__loading">Cargando…</span>}
      </div>

      {/* Galería */}
      <ProductGallery />
    </section>
  );
};

export default Products;

