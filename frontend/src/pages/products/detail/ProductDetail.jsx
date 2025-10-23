import productsApi from "@/api/products.api.js";
import { API_URL_IMAGES } from "@/constants/api.constant.js";
import AppContext from "@/contexts/AppContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./product-detail.scss";

const currency = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n ?? 0);

export default function ProductDetail() {
  const { id } = useParams();
  const { shoppingCartContext } = useContext(AppContext);
  const { addItem } = shoppingCartContext || { addItem: () => {} };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsApi.fetchProductById(id);
        if (alive) setProduct(data);
      } catch (e) {
        if (alive) setError(e?.message || "Error al cargar el producto");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const imgSrc = useMemo(() => {
    if (!product?.thumbnail) return null;
    return `${API_URL_IMAGES}/products/${product.thumbnail}`;
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
    const quantity = Math.min(Math.max(Number(qty) || 1, 1), product.stock || 99);
    addItem({ ...product, qty: quantity });
  };

  if (loading) {
    return <section className="product-detail"><p>Cargando producto…</p></section>;
  }

  if (error) {
    return (
      <section className="product-detail">
        <p>Ocurrió un error: {error}</p>
        <Link to="/products">← Volver al catálogo</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-detail">
        <p>Producto no encontrado.</p>
        <Link to="/products">← Volver al catálogo</Link>
      </section>
    );
  }

  return (
    <section className="product-detail">
      <div className="product-detail__image">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = `${API_URL_IMAGES}/products/fallback.jpg`; }}
          />
        ) : (
          <div className="product-detail__image--placeholder">Sin imagen</div>
        )}
      </div>

      <div className="product-detail__info">
        <h1 className="product-detail__title">{product.name}</h1>
        <p className="product-detail__price">{currency(product.price)}</p>
        <p className="product-detail__stock">
          {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
        </p>
        <p className="product-detail__desc">{product.description}</p>

        <div className="product-detail__cart">
          <label>
            Cantidad:
            <input
              type="number"
              min={1}
              max={product.stock || 99}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </label>
          <button
            className="product-detail__add"
            disabled={product.stock <= 0}
            onClick={handleAdd}
          >
            Agregar al carrito
          </button>
        </div>

        <Link to="/products" className="product-detail__back">← Volver al catálogo</Link>
      </div>
    </section>
  );
}



