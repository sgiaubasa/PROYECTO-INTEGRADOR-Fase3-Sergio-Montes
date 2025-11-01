import PropTypes from "prop-types";
import "./text.scss";

const Text = ({ children, className, variant="p", ...restProps }) => {
    const classes = `text text--${variant} ${className ?? ""}`;

    return (
        <>
            {variant === "h1" && (
                <h1 className={classes} {...restProps}>
                    {children}
                </h1>
            )}

            {variant === "h2" && (
                <h2 className={classes} {...restProps}>
                    {children}
                </h2>
            )}

            {variant === "h3" && (
                <h3 className={classes} {...restProps}>
                    {children}
                </h3>
            )}

            {variant === "p" && (
                <p className={classes} {...restProps}>
                    {children}
                </p>
            )}

            {variant === "span" && (
                <span className={classes} {...restProps}>
                    {children}
                </span>
            )}
        </>
    );
};

Text.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    variant: PropTypes.oneOf([ "h1", "h2", "h3", "p", "span" ]).isRequired,
};

export default Text;