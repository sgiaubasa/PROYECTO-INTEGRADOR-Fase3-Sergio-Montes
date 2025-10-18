import { Skeleton as MuiSkeleton } from "@mui/material";
import PropTypes from "prop-types";
import "./skeleton.scss";

const Skeleton = (props) => {
    const {
        children,
        isLoading,
        className,
        ...restProps
    } = props;

    const classes = `skeleton ${className ?? ""}`;

    if (isLoading) {
        return (
            <MuiSkeleton
                className={classes}
                animation="wave"
                variant="rounded"
                {...restProps}/>
        );
    }

    return children;
};

Skeleton.propTypes = {
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool.isRequired,
    className: PropTypes.string,
};

export default Skeleton;