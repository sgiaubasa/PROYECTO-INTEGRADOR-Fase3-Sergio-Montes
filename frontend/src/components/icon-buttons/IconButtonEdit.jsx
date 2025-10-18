import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import IconButton from "./IconButton";

const IconButtonEdit = (props) => {
    const { className, ...restProps } = props;
    const classes = `icon-button__edit ${className ?? ""}`;

    return (
        <IconButton className={classes} {...restProps}>
            <EditIcon />
        </IconButton>
    );
};

IconButtonEdit.propTypes = {
    className: PropTypes.string,
};

export default IconButtonEdit;