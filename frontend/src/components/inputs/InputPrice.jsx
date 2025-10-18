import { InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import Input from "./Input";

const InputPrice = (props) => {
    const {
        formik,
        min = 0,
        step = 0.01,
        currency = "$",
        ...restProps
    } = props;

    return (
        <Input
            type="number"
            id="price"
            name="price"
            label="Precio"
            min={min}
            step={step}
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            endAdornment={<InputAdornment position="end">{currency}</InputAdornment>}
            {...restProps}/>
    );
};

InputPrice.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({
            price: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        }).isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        touched: PropTypes.shape({ price: PropTypes.bool }).isRequired,
        errors: PropTypes.shape({ price: PropTypes.string }).isRequired,
    }).isRequired,
    min: PropTypes.number,
    step: PropTypes.number,
    currency: PropTypes.string,
};

export default InputPrice;