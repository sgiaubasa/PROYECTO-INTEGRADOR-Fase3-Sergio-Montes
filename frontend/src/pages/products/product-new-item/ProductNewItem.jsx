import { API_URL_IMAGES } from "@/constants/api.constant.js";
import { CardActionArea, Card as MuiCard } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./product-new-item.scss";

const ProductNewItem = (props) => {
    const { className, ...restProps } = props;

    const navigate = useNavigate();

    const classes = `product-new-item ${className ?? ""}`;

    const handleCreateProduct = () => {
        navigate("/products/new");
    };

    return (
        <MuiCard className={classes} {...restProps}>
            <CardActionArea>
                <img
                    className="product-new-item__image"
                    src={`${API_URL_IMAGES}/products/create.png`}
                    alt="Crear producto"
                    onClick={handleCreateProduct}/>
            </CardActionArea>
        </MuiCard>
    );
};

ProductNewItem.propTypes = {
    className: PropTypes.string,
};

export default ProductNewItem;