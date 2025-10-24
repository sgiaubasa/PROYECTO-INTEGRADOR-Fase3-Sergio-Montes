import { Text } from "@/components/texts";
import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import ProductGallery from "./product-gallery/ProductGallery";
import "./products.scss";

const Products = () => {
    const { productsContext } = useContext(AppContext);
    const { filters, setFilters, isLoading } = productsContext;

    return (
        <section className="products-page">
            <Text variant="h2">Productos</Text>

            {/* Filtros de búsqueda */}
            <div className="products-page__filters">
                <div className="filters__group">
                    <input
                        type="text"
                        className="filters__search"
                        placeholder="Buscar por nombre…"
                        value={filters.name ?? ""}
                        onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}/>
                </div>

                <label className="filters__check">
                    <input
                        type="checkbox"
                        checked={filters.highlighted === true}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, highlighted: e.target.checked ? true : undefined }))
                        }/>
                    <span>Solo destacados</span>
                </label>

                {isLoading && <span className="filters__loading">Cargando…</span>}
            </div>

            <ProductGallery />
        </section>
    );
};

export default Products;