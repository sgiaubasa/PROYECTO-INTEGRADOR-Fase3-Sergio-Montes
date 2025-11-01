// frontend/src/pages/products/product-gallery/ProductGallery.jsx
import { Text } from "@/components/texts";
import AppContext from "@/contexts/AppContext";
import { useContext, useMemo } from "react";
import ProductItem from "../product-item/ProductItem.jsx";
import "./product-gallery.scss";

const ProductGallery = () => {
  const { productsContext } = useContext(AppContext) || {};
  const { products, isLoading, error } = productsContext || {};

  // 🔒 Defensa: si products no es array, lo fuerzo a array vacío
  const safeProducts = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  if (error) {
    return (
      <div className="product-gallery__empty">
        <Text variant="p">Ocurrió un error al cargar los productos.</Text>
      </div>
    );
  }

  if (!isLoading && safeProducts.length === 0) {
    return (
      <div className="product-gallery__empty">
        <Text variant="p">No se encontraron productos con ese filtro.</Text>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {safeProducts.map((p) => {
        // ✅ normaliza thumbnail a "solo filename"
        let thumb = "default.jpg";
        const t = p?.thumbnail;

        if (t) {
          if (typeof t === "object") {
            // casos raros después de crear: File/objeto
            const fname =
              t.filename || t.name || t.path || t.filepath || t.url || "";
            thumb = String(fname).replace(/\\/g, "/").split("/").pop() || "default.jpg";
          } else {
            // string
            thumb = String(t).replace(/\\/g, "/").split("/").pop() || "default.jpg";
          }
        }

        // id seguro
        const id = p?.id ?? p?._id;

        return (
          <div className="product-gallery__card" key={String(id)}>
            <ProductItem
              product={{
                id,
                _id: id,
                name: String(p?.name ?? ""),
                description: String(p?.description ?? ""),
                price: Number(p?.price) || 0,
                stock: Number(p?.stock) || 0,
                thumbnail: thumb,
                highlighted: !!p?.highlighted,
              }}
              isLoading={!!isLoading}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProductGallery;

