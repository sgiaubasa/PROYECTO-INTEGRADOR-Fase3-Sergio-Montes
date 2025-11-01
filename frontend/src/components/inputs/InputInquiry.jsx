import PropTypes from "prop-types";
import Input from "./Input";

const InputInquiry = (props) => {
    const {
        formik,
        rows = 5,
        maxLength = 250,
        ...restProps
    } = props;

    return (
        <Input
            type="text"
            id="inquiry"
            name="inquiry"
            label="Consulta"
            multiline
            rows={rows}
            value={formik.values.inquiry}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.inquiry && Boolean(formik.errors.inquiry)}
            helperText={formik.touched.inquiry && formik.errors.inquiry}
            inputProps={{ maxLength }}
            {...restProps}/>
    );
};

InputInquiry.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({ inquiry: PropTypes.string.isRequired }).isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        touched: PropTypes.shape({ inquiry: PropTypes.bool }).isRequired,
        errors: PropTypes.shape({ inquiry: PropTypes.string }).isRequired,
    }).isRequired,
    rows: PropTypes.number,
    maxLength: PropTypes.number,
};

export default InputInquiry;