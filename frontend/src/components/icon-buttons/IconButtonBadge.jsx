import { Badge } from "@mui/material";
import PropTypes from "prop-types";
import IconButton from "./IconButton";

const IconButtonBadge = (props) => {
    const { children, badgeContent, className, ...restProps } = props;
    const classes = `icon-button-badge ${className ?? ""}`;

    return (
        <IconButton className={classes} {...restProps}>
            <Badge badgeContent={badgeContent} color="secondary">
                {children}
            </Badge>
        </IconButton>
    );
};

IconButtonBadge.propTypes = {
    children: PropTypes.node.isRequired,
    badgeContent: PropTypes.number.isRequired,
    className: PropTypes.string,
};

export default IconButtonBadge;