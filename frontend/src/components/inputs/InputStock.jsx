import PropTypes from "prop-types";
import Input from "./Input";

const InputStock = (props) => {
    const {
        formik,
        min = 0,
        step = 0.10,
        ...restProps
    } = props;

    return (
        <Input
            type="number"
            id="stock"
            name="stock"
            label="Stock"
            min={min}
            step={step}
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.stock && Boolean(formik.errors.stock)}
            helperText={formik.touched.stock && formik.errors.stock}
            {...restProps}/>
    );
};

InputStock.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({
            stock: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
        }).isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        touched: PropTypes.shape({ stock: PropTypes.bool }).isRequired,
        errors: PropTypes.shape({ stock: PropTypes.string }).isRequired,
    }).isRequired,
    min: PropTypes.number,
    step: PropTypes.number,
};

export default InputStock;