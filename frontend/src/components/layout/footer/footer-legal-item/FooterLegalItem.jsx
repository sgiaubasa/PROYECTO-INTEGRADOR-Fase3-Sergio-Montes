import React from "react";
import "./footer-legal-item.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Text } from "@/components/texts";

const FooterLegalItem = (props) => {
    const { item, className, ...restProps } = props;
    const classes = `footer-legal-item ${className}`;

    return (

        <li className={classes} {...restProps}>
            <Link to={item.path} target="_blank">
                <Text className="footer-legal-item__label" variant="span">{item.label}</Text>
            </Link>
        </li>
    );
};

FooterLegalItem.propTypes = {
    item: PropTypes.shape({
        path: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }),
    className: PropTypes.string,
};

export default FooterLegalItem;