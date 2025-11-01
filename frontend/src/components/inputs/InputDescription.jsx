import PropTypes from "prop-types";
import Input from "./Input";

const InputDescription = (props) => {
    const {
        formik,
        rows = 4,
        maxLength = 100,
        ...restProps
    } = props;

    return (
        <Input
            type="text"
            id="description"
            name="description"
            label="Descripción"
            multiline
            rows={rows}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            inputProps={{ maxLength }}
            {...restProps}/>
    );
};

InputDescription.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({ description: PropTypes.string.isRequired }).isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        touched: PropTypes.shape({ description: PropTypes.bool }).isRequired,
        errors: PropTypes.shape({ description: PropTypes.string }).isRequired,
    }).isRequired,
    rows: PropTypes.number,
    maxLength: PropTypes.number,
};

export default InputDescription;