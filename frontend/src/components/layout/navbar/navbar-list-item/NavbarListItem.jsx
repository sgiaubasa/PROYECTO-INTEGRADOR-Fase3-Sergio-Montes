import { Text } from "@/components/texts";
import * as iconsMaterial from "@mui/icons-material";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import "./navbar-list-item.scss";

const NavbarListItem = (props) => {
    const { item, isDynamic = false } = props;
    const { pathname } = useLocation();
    const Icon = iconsMaterial[item.iconName];

    const isActive = isDynamic ? pathname.startsWith(item.path) : pathname === item.path;
    const classes = `navbar-list-item ${isActive ? "navbar-list-item--active" : ""}`;

    return (
        <li className={classes}>
            <Link className="navbar-list-item__link" to={item.path}>
                <Icon className="navbar-list-item__icon"/>
                <Text className="navbar-list-item__label" variant="span">{item.label}</Text>
            </Link>
        </li>
    );
};

NavbarListItem.propTypes = {
    item: PropTypes.shape({
        path: PropTypes.string.isRequired,
        iconName: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired,
    isDynamic: PropTypes.bool,
};

export default NavbarListItem;