import { Text } from "@/components/texts";
import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import ProductGallery from "./product-gallery/ProductGallery";
import "./products.scss";

const Products = () => {
  const { productsContext } = useContext(AppContext);
  const { filters, setFilters, isLoading } = productsContext;

  return (
    <div className="products">
      <Text variant="h2">Productos</Text>

      {/* Filtros de búsqueda */}
      <div className="filters" style={{ display: "flex", gap: "12px", margin: "12px 0" }}>
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={filters.name}
          onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={filters.highlighted === true}
            onChange={(e) =>
              setFilters((f) => ({ ...f, highlighted: e.target.checked ? true : undefined }))
            }
          />
          Solo destacados
        </label>
        {isLoading && <span>Cargando…</span>}
      </div>

      <ProductGallery />
    </div>
  );
};

export default Products;
