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
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./product-item.scss";

const ProductItem = (props) => {
    const {
        product,
        isLoading,
        className,
        ...restProps
    } = props;

    const navigate = useNavigate();
    const { shoppingCartContext } = useContext(AppContext);
    const { addArticle, subtractArticle, removeArticle } = shoppingCartContext;

    const classes = `product-item ${className ?? ""}`;

    const handleEditProduct = () => {
        navigate(`/products/${product.id}`);
    };

    const handleAddArticle = () => {
        addArticle(product.id, 1);
    };

    const handleSubtractArticle = () => {
        subtractArticle(product.id, 1);
    };

    const handleRemoveFromCart = () => {
        // Elimina completamente este producto del carrito
        removeArticle(product.id);
    };

    const renderActions = () => {
        if (product.stock === 0) {
            return (<Text variant="p">SIN STOCK</Text>);
        }

        return (
            <>
                {/* Agregar 1 */}
                <Skeleton className="product-item__actions--skeleton" isLoading={isLoading}>
                    <ButtonPrimary
                        className="product-item__add"
                        size="sm"
                        onClick={handleAddArticle}
                        title="Agregar 1 al carrito"
                    >
                        <AddShoppingCartIcon/>
                    </ButtonPrimary>
                </Skeleton>

                {/* Quitar 1 */}
                <Skeleton className="product-item__actions--skeleton" isLoading={isLoading}>
                    <ButtonPrimary
                        className="product-item__remove"
                        size="sm"
                        onClick={handleSubtractArticle}
                        title="Quitar 1 del carrito"
                    >
                        <RemoveCircleOutlineIcon/>
                    </ButtonPrimary>
                </Skeleton>

                {/* Eliminar del carrito */}
                <Skeleton className="product-item__actions--skeleton" isLoading={isLoading}>
                    <ButtonPrimary
                        className="product-item__clear"
                        size="sm"
                        onClick={handleRemoveFromCart}
                        title="Eliminar del carrito"
                        style={{ background: "#b00020" }}
                    >
                        <DeleteOutlineIcon/>
                    </ButtonPrimary>
                </Skeleton>

                {/* Editar producto */}
                <Skeleton className="product-item__actions--skeleton" isLoading={isLoading}>
                    <ButtonPrimary
                        className="product-item__edit"
                        size="sm"
                        onClick={handleEditProduct}
                        title="Editar producto"
                    >
                        <EditOutlinedIcon/>
                    </ButtonPrimary>
                </Skeleton>
            </>
        );
    };

    const getImageUrl = () => {
        if (product.thumbnail === "default.jpg") {
            return `${API_URL_IMAGES}/default.jpg`;
        }
        return `${API_URL_IMAGES}/products/${product.thumbnail}`;
    };

    return (
        <MuiCard className={classes} {...restProps}>
            <Skeleton className="product-item__image--skeleton" isLoading={isLoading}>
                <CardActionArea>
                    <img
                        className="product-item__image"
                        src={getImageUrl()}
                        alt="Imagen del producto"
                        onClick={handleEditProduct}
                    />
                </CardActionArea>
            </Skeleton>

            <div className="product-item__content">
                <Skeleton className="product-item__name--skeleton" isLoading={isLoading}>
                    <Text className="product-item__name" variant="h3">{product.name}</Text>
                </Skeleton>
                <Skeleton className="product-item__description--skeleton" isLoading={isLoading}>
                    <Text className="product-item__description" variant="p">{product.description}</Text>
                </Skeleton>
                <Skeleton className="product-item__price--skeleton" isLoading={isLoading}>
                    <Text className="product-item__price" variant="span">
                        ${product.price.toFixed(2)}
                    </Text>
                </Skeleton>
            </div>

            <div className="product-item__actions">
                {renderActions()}
            </div>
        </MuiCard>
    );
};

ProductItem.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        thumbnail: PropTypes.string.isRequired,
    }),
    isLoading: PropTypes.bool.isRequired,
    className: PropTypes.string,
};

export default ProductItem;
