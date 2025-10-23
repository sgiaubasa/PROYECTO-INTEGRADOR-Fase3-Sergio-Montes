import AppContext from "@/contexts/AppContext";
import { Fragment, useContext } from "react";
import ProductItem from "../product-item/ProductItem";
import ProductNewItem from "../product-new-item/ProductNewItem";
import "./product-gallery.scss";

const ProductGallery = () => {
  const app = useContext(AppContext) || {};
  const productsCtx = app.productsContext || { products: [], isLoading: false };
  const cartCtx = app.shoppingCartContext || { shoppingCart: { articles: [] } };

  const { products = [], isLoading = false } = productsCtx;
  const { shoppingCart } = cartCtx;

  // Mapa: productId -> qty en carrito (para no pasarnos del stock)
  const qtyInCart = new Map();
  (shoppingCart?.articles || []).forEach((a) => {
    qtyInCart.set(String(a.id ?? a._id), Number(a.quantity) || 0);
  });

  const renderCard = (product) => {
    const id = String(product?.id ?? product?._id ?? crypto.randomUUID());
    const baseStock = Number(product?.stock ?? 0);
    const used = qtyInCart.get(id) || 0;

    // Stock disponible considerando lo que ya está en el carrito
    const disponible = Math.max(0, baseStock - used);

    return (
      <div key={id} className="product-gallery__card">
        <ProductItem product={product} isLoading={isLoading} />
        <div className="product-gallery__stock">
          {disponible > 0 ? (
            <span className="product-gallery__stock--ok">Stock disponible: {disponible}</span>
          ) : (
            <span className="product-gallery__stock--out">Sin stock</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="product-gallery">
      {/* Primer item: crear nuevo producto */}
      <div className="product-gallery__card product-gallery__card--new">
        <ProductNewItem />
      </div>

      {/* Estado de carga: esqueletos */}
      {isLoading && products.length === 0 ? (
        Array.from({ length: 6 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="product-gallery__card product-gallery__card--skeleton" />
        ))
      ) : (
        <Fragment>
          {products.length > 0 ? (
            products.map(renderCard)
          ) : (
            <div className="product-gallery__empty">
              <p>No hay productos para mostrar.</p>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ProductGallery;


