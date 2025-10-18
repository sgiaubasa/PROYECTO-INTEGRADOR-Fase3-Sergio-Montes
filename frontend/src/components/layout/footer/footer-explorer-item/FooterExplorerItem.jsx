import React from "react";
import "./footer-explorer-item.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Text } from "@/components/texts";

const FooterExplorerItem = (props) => {
    const { item, className, ...restProps } = props;
    const classes = `footer-explorer-item ${className}`;

    return (

        <li className={classes} {...restProps}>
            <Link to={item.path}>
                <Text className="footer-explorer-item__label" variant="span">{item.label}</Text>
            </Link>
        </li>
    );
};

FooterExplorerItem.propTypes = {
    item: PropTypes.shape({
        path: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }),
    className: PropTypes.string,
};

export default FooterExplorerItem;