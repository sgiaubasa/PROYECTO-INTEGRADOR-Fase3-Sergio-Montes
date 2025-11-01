import PropTypes from "prop-types";
import AlertSuccess from "./AlertSuccess";

const AlertSuccessForm = (props) => {
    const { open, message, className, ...restProps } = props;
    const classes = `alert--success-form ${className ?? ""}`;

    return (
        <AlertSuccess
            className={classes}
            open={open}
            message={message}
            variant="success"
            {...restProps}/>
    );
};

AlertSuccessForm.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default AlertSuccessForm;