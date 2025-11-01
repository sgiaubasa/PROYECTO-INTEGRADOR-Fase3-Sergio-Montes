import PropTypes from "prop-types";
import Button from "./Button";

const ButtonDanger = (props) => {
    const { children, size = "md", ...restProps } = props;

    return (
        <Button
            size={size}
            variant="danger"
            {...restProps}>
            {children}
        </Button>
    );
};

ButtonDanger.propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf([ "sm", "md", "lg" ]),
};

export default ButtonDanger;