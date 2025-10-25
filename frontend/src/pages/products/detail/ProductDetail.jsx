// frontend/src/pages/products/detail/ProductDetail.jsx
import productsApi from "@/api/products.api.js";
import { ButtonPrimary } from "@/components/buttons";
import { API_URL_IMAGES } from "@/constants/api.constant.js";
import AppContext from "@/contexts/AppContext";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./product-detail.scss";

const currency = (n) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(n ?? 0);

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { shoppingCartContext } = useContext(AppContext);
    const { addArticle } = shoppingCartContext;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const data = await productsApi.fetchProductById(id);
                if (alive) setProduct(data);
            } catch (e) {
                if (alive) setError(e?.message || "Error al cargar el producto");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    const imgSrc = useMemo(() => {
        if (!product?.thumbnail) return null;
        if (String(product.thumbnail).startsWith("/")) return product.thumbnail;
        return `${API_URL_IMAGES}/products/${product.thumbnail}`;
    }, [product]);

    const clampQty = (val, max) => {
        const n = Number(val);
        const safe = Number.isFinite(n) ? n : 1;
        return Math.min(Math.max(safe, 1), Math.max(max, 0));
    };

    const onQtyChange = (e) => {
        setQty(clampQty(e.target.value, product?.stock ?? 0));
    };

    const handleAddToCartAndBack = () => {
        if (!product || !addArticle) return;
        const quantity = clampQty(qty, product.stock ?? 0);
        if (quantity <= 0) return;

        addArticle(product.id, quantity);
        navigate("/products");
    };

    const handleEditProduct = () => {
        navigate(`/products/${product.id}`);
    };

    const handleDeleteProduct = async () => {
        try {
            if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
            await productsApi.removeProduct(product.id);
            alert("Producto eliminado correctamente");
            navigate("/products");
        } catch (e) {
            alert(e?.message || "No se pudo eliminar el producto");
        }
    };

    if (loading) {
        return (
            <section className="product-detail">
                <p>Cargando producto…</p>
            </section>
        );
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

    const noStock = (product.stock ?? 0) <= 0;
    const invalidQty = qty < 1 || qty > (product.stock ?? 0);

    return (
        <section className="product-detail">
            <div className="product-detail__image">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={product.name}
                        onError={(e) => {
                            e.currentTarget.src = `${API_URL_IMAGES}/products/fallback.jpg`;
                        }}
                    />
                ) : (
                    <div className="product-detail__image--placeholder">Sin imagen</div>
                )}
            </div>

            <div className="product-detail__info">
                <h1 className="product-detail__title">{product.name}</h1>
                <p className="product-detail__price">{currency(product.price)}</p>
                <p className="product-detail__stock">
                    {noStock ? "Sin stock" : `Stock: ${product.stock}`}
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
                            onChange={onQtyChange}
                        />
                    </label>

                    {/* 🔹 Botones: Editar / Eliminar / Agregar */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                        <ButtonPrimary onClick={handleEditProduct} title="Editar producto">
                            <EditOutlinedIcon />&nbsp;Editar
                        </ButtonPrimary>

                        <ButtonPrimary
                            onClick={handleDeleteProduct}
                            title="Eliminar producto"
                            style={{ background: "#b00020" }}>
                            <DeleteOutlineIcon />&nbsp;Eliminar
                        </ButtonPrimary>

                        <ButtonPrimary
                            className="product-detail__add"
                            onClick={handleAddToCartAndBack}
                            disabled={noStock || invalidQty}>
                            <AddShoppingCartIcon />
                            &nbsp;Agregar al carrito
                        </ButtonPrimary>
                    </div>
                </div>

                <Link to="/products" className="product-detail__back">
                    ← Volver al catálogo
                </Link>
            </div>
        </section>
    );
}
