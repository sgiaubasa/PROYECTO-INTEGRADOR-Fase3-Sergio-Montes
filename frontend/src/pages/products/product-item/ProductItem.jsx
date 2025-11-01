// frontend/src/pages/products/product-item/ProductItem.jsx
import productsApi from "@/api/products.api.js";
import { ButtonPrimary } from "@/components/buttons";
import { Skeleton } from "@/components/skeleton";
import { Text } from "@/components/texts";
import { API_URL_IMAGES } from "@/constants/api.constant.js";
import AppContext from "@/contexts/AppContext";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { CardActionArea, Card as MuiCard } from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./product-item.scss";

const ProductItem = (props) => {
  const { product, isLoading, className, ...restProps } = props;

  const navigate = useNavigate();
  const { shoppingCartContext, productsContext } = useContext(AppContext) || {};
  const { addArticle, subtractArticle, getQty } = shoppingCartContext || {};

  const classes = `product-item ${className ?? ""}`;
  const pid = product?.id || product?._id;

  /* -----------------------------------------------------------
   * Cantidad en carrito (robusta):
   *  - Si el contexto expone getQty, la usamos
   *  - Si no, buscamos en arrays típicos (items, cart.items, articles)
   *  - Admite keys qty | quantity | count
   * ----------------------------------------------------------*/
  const cartCollections =
    shoppingCartContext?.items ||
    shoppingCartContext?.cart?.items ||
    shoppingCartContext?.articles ||
    shoppingCartContext?.cart ||
    [];

  const inCartQty = useMemo(() => {
    if (!pid) return 0;

    if (typeof getQty === "function") {
      const n = Number(getQty(pid) || 0);
      return Number.isFinite(n) ? n : 0;
    }

    // Buscar en colecciones conocidas
    const arr = Array.isArray(cartCollections) ? cartCollections : [];
    const match = arr.find((x) => {
      const xid = String(x?.id ?? x?._id ?? "");
      return xid && xid === String(pid);
    });

    const qty = Number(match?.qty ?? match?.quantity ?? match?.count ?? 0);
    return Number.isFinite(qty) ? qty : 0;
  }, [pid, getQty, cartCollections]);

  const totalStock = Number(product?.stock || 0);
  const available = Math.max(0, totalStock - inCartQty);

  // Navegaciones
  const handleGoToDetail = () => pid && navigate(`/products/${pid}`);
  const handleEditProduct = () => pid && navigate(`/products/${pid}/edit`);

  // Carrito (con guardas por stock/cero)
  const handleAddArticle = () => {
    if (!pid) return;
    if (available <= 0) return;
    addArticle?.(pid, 1);
  };

  const handleSubtractArticle = () => {
    if (!pid) return;
    if (inCartQty <= 0) return;
    subtractArticle?.(pid, 1);
  };

  // Eliminar producto
  const handleDeleteProduct = async () => {
    try {
      if (!pid) return;
      const ok = window.confirm(
        `¿Seguro querés eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`
      );
      if (!ok) return;

      if (productsContext?.removeProduct) {
        await productsContext.removeProduct(pid);
        return;
      }

      await productsApi.removeProduct(pid);
      navigate("/products");
    } catch (e) {
      console.error("[ProductItem] Error al eliminar producto:", e);
      alert(e?.message || "No se pudo eliminar el producto.");
    }
  };

  // --- Helpers de normalización de thumbnail ---
  const toFilename = (val) => {
    if (val == null) return "";
    if (Array.isArray(val)) return toFilename(val[0]);
    if (typeof val === "object") {
      const any = val.filename || val.name || val.path || val.filepath || val.url || "";
      return toFilename(String(any));
    }
    let s = String(val).trim();
    s = s.replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "");
    s = s.replace(/\\/g, "/");
    const parts = s.split("/");
    return parts[parts.length - 1] || "";
  };

  // Imagen: respeta absoluta y /api; si no, arma /api/public/images/products/<file>
  const getImageUrl = () => {
    let raw = product?.thumbnail;
    if (!raw) return `${API_URL_IMAGES}/default.jpg`;

    if (typeof raw === "string") {
      const t = raw.trim();
      if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/api/")) {
        return t;
      }
    }
    const fileOnly = toFilename(raw);
    return `${API_URL_IMAGES}/products/${fileOnly || "default.jpg"}`;
  };

  const price = Number(product?.price) || 0;

  return (
    <MuiCard className={classes} {...restProps}>
      <Skeleton className="product-item__image--skeleton" isLoading={!!isLoading}>
        <CardActionArea onClick={handleGoToDetail}>
          <img
            className="product-item__image"
            src={getImageUrl()}
            alt="Imagen del producto"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `${API_URL_IMAGES}/default.jpg`;
            }}
          />
        </CardActionArea>
      </Skeleton>

      <div className="product-item__content">
        <Skeleton className="product-item__name--skeleton" isLoading={!!isLoading}>
          <Text className="product-item__name" variant="h3">
            {product?.name ?? ""}
          </Text>
        </Skeleton>

        <Skeleton className="product-item__description--skeleton" isLoading={!!isLoading}>
          <Text className="product-item__description" variant="p">
            {product?.description ?? ""}
          </Text>
        </Skeleton>

        <Skeleton className="product-item__price--skeleton" isLoading={!!isLoading}>
          <Text className="product-item__price" variant="span">
            ${price.toFixed(2)}
          </Text>
        </Skeleton>

        {/* Stock visible (resta lo que ya está en el carrito) */}
        <div style={{ padding: "0 16px", color: "#4a5568", fontWeight: 600 }}>
          {available > 0 ? `Stock: ${available}` : "SIN STOCK"}
        </div>
      </div>

      <div className="product-item__actions">
        {totalStock === 0 ? (
          <Text variant="p">SIN STOCK</Text>
        ) : (
          <>
            <Skeleton className="product-item__actions--skeleton" isLoading={!!isLoading}>
              <ButtonPrimary
                className="product-item__add"
                size="sm"
                onClick={handleAddArticle}
                title="Agregar 1 al carrito"
                disabled={available <= 0}
              >
                <AddShoppingCartIcon />
              </ButtonPrimary>
            </Skeleton>

            <Skeleton className="product-item__actions--skeleton" isLoading={!!isLoading}>
              <ButtonPrimary
                className="product-item__remove"
                size="sm"
                onClick={handleSubtractArticle}
                title="Quitar 1 del carrito"
                disabled={inCartQty <= 0}
              >
                <RemoveCircleOutlineIcon />
              </ButtonPrimary>
            </Skeleton>

            <Skeleton className="product-item__actions--skeleton" isLoading={!!isLoading}>
              <ButtonPrimary
                className="product-item__edit"
                size="sm"
                onClick={handleEditProduct}
                title="Editar producto"
              >
                <EditOutlinedIcon />
              </ButtonPrimary>
            </Skeleton>

            <Skeleton className="product-item__actions--skeleton" isLoading={!!isLoading}>
              <ButtonPrimary
                className="product-item__clear"
                size="sm"
                onClick={handleDeleteProduct}
                title="Eliminar producto"
                style={{ background: "#b00020" }}
              >
                <DeleteOutlineIcon />
              </ButtonPrimary>
            </Skeleton>
          </>
        )}
      </div>
    </MuiCard>
  );
};

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    stock: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    thumbnail: PropTypes.any,
  }),
  isLoading: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default ProductItem;







