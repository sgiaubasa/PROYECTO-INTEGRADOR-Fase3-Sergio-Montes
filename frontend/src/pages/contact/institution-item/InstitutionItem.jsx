import { Text } from "@/components/texts";
import PropTypes from "prop-types";
import "./institution-item.scss";

const InstitutionItem = (props) => {
    const { item, className, ...restProps } = props;
    const classes = `institution-item ${className}`;

    return (
        <li className={classes} {...restProps}>
            <strong className="institution-item__label">{item.label}:</strong>
            <Text className="institution-item__value" variant="span">{item.value}</Text>
        </li>
    );
};

InstitutionItem.propTypes = {
    item: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }),
    className: PropTypes.string,
};

export default InstitutionItem;