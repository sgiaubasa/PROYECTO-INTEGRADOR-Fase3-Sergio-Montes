import { IconButtonBadge } from "@/components/icon-buttons";
import AppContext from "@/contexts/AppContext";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./header.scss";
import InstitutionLogo from "./institution-logo/InstitutionLogo";

const Header = () => {
    const { shoppingCartContext } = useContext(AppContext);
    const { shoppingCart } = shoppingCartContext;
    const navigate = useNavigate();

    const handleShoppingCart = () => {
        navigate("/shopping-cart");
    };

    return (
        <header className="header">
            {/* 🟢 Logo izquierda */}
            <div className="header_institution">
                <InstitutionLogo />
            </div>

            {/* 🟢 Texto centrado */}
            <h1 className="header_title-center">AF Revestimiento</h1>

            {/* 🟢 Carrito derecha */}
            <IconButtonBadge
                className="header_shopping-cart"
                badgeContent={shoppingCart.totalQuantity ?? 0}>
                <ShoppingCartIcon onClick={handleShoppingCart} />
            </IconButtonBadge>
        </header>
    );
};

export default Header;