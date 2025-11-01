import { Text } from "@/components/texts";
import { CloseOutlined } from "@mui/icons-material";
import { Fade, IconButton, Snackbar } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "./alert.scss";

const Alert = (props) => {
    const { open, message, variant, onClose, className = "", ...restProps } = props;
    const classes = `alert alert--${variant} ${className ?? ""}`;
    const [ openAlert, setOpenAlert ] = useState(false);

    useEffect(() => {
        setOpenAlert(open);
    }, [open]);

    const handleClose = () => {
        setOpenAlert(false);

        if (onClose) {
            onClose();
        }
    };

    return (
        <Snackbar
            className={classes}
            open={openAlert}
            onClose={handleClose}
            autoHideDuration={3000}
            slots={{ transition: Fade }}
            {...restProps}>
            <div className="alert__content">
                <Text className="alert__message" variant="span">{message}</Text>
                <IconButton size="small" onClick={onClose}>
                    <CloseOutlined className="alert__icon"/>
                </IconButton>
            </div>
        </Snackbar>
    );
};

Alert.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    variant: PropTypes.oneOf([ "success", "danger" ]),
    onClose: PropTypes.func,
    className: PropTypes.string,
};

export default Alert;