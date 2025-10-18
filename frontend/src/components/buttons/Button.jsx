import PropTypes from "prop-types";
import "./button.scss";

const Button = (props) => {
    const { children, className, size, variant, ...restProps } = props;
    const classes = `button button--${size} button--${variant} ${className ?? ""}`;

    return (
        <button className={classes} {...restProps}>
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOf([ "sm", "md", "lg" ]).isRequired,
    variant: PropTypes.oneOf([ "danger", "primary" ]).isRequired,
};

export default Button;