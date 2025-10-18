import { IconButton as IconButtonMui } from "@mui/material";
import PropTypes from "prop-types";
import "./icon-button.scss";

const IconButton = (props) => {
    const { children, className, ...restProps } = props;
    const classes = `icon-button ${className ?? ""}`;

    return (
        <IconButtonMui className={classes} {...restProps}>
            {children}
        </IconButtonMui>
    );
};

IconButton.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default IconButton;