import PropTypes from "prop-types";
import Alert from "./Alert";

const AlertDanger = (props) => {
    const { open, message, className, ...restProps } = props;

    return (
        <Alert
            className={className}
            open={open}
            message={message}
            variant="danger"
            {...restProps}/>
    );
};

AlertDanger.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default AlertDanger;