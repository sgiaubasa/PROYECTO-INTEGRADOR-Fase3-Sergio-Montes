import PropTypes from "prop-types";
import Button from "./Button";

const ButtonPrimary = (props) => {
    const { children, size = "md", ...restProps } = props;

    return (
        <Button
            size={size}
            variant="primary"
            {...restProps}>
            {children}
        </Button>
    );
};

ButtonPrimary.propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf([ "sm", "md", "lg" ]),
};

export default ButtonPrimary;