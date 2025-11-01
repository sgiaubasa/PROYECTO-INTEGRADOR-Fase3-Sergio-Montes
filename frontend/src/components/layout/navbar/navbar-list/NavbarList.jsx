import PropTypes from "prop-types";
import NavbarListItem from "../navbar-list-item/NavbarListItem";
import { items } from "./navbar-list.config";
import "./navbar-list.scss";

const NavbarList = (props) => {
    const { className } = props;
    const classes = `navbar-list ${className ?? ""}`;

    return (
        <ul className={classes}>
            {items.map((item) => (
                <NavbarListItem
                    key={item.path}
                    item={item}
                    isDynamic={item.isDynamic}/>
            ))}
        </ul>
    );
};

NavbarList.propTypes = {
    className: PropTypes.string,
};

export default NavbarList;