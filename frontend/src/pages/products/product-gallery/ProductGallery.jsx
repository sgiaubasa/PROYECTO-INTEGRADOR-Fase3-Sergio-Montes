import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import ProductItem from "../product-item/ProductItem";
import ProductNewItem from "../product-new-item/ProductNewItem";
import "./product-gallery.scss";

const ProductGallery = () => {
  const { productsContext, shoppingCartContext } = useContext(AppContext);
  const { products, isLoading } = productsContext;
  const { shoppingCart } = shoppingCartContext || { shoppingCart: { articles: [] } };

  // Mapa: productId -> qty en carrito (para no pasarnos del stock)
  const qtyInCart = new Map();
  (shoppingCart?.articles || []).forEach((a) => {
    qtyInCart.set(String(a.id ?? a._id), a.quantity || 0);
  });

  return (
    <div className="product-gallery">
      <ProductNewItem />

      {products.map((product) => {
        const id = String(product.id ?? product._id);
        const baseStock = Number(product.stock ?? 0);
        const used = qtyInCart.get(id) || 0;

        // 👉 Disponible considerando lo que ya está en el carrito:
        const disponible = Math.max(0, baseStock - used);

        // Si querés mostrar el stock tal cual viene de la base (sin restar carrito), usá:
        // const disponible = baseStock;

        return (
          <div key={id} className="product-gallery__card">
            <ProductItem product={product} isLoading={isLoading} />

            {/* Stock debajo del producto */}
            <div className="product-gallery__stock" style={{ marginTop: 6, fontSize: 14 }}>
              {disponible > 0 ? (
                <span>Stock disponible: {disponible}</span>
              ) : (
                <span style={{ color: "crimson", fontWeight: 700 }}>Sin stock</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGallery;
