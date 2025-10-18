import PropTypes from "prop-types";
import Input from "./Input";

const InputName = (props) => {
    const {
        formik,
        maxLength = 25,
        ...restProps
    } = props;

    return (
        <Input
            type="text"
            id="name"
            name="name"
            label="Nombre"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            inputProps={{ maxLength }}
            {...restProps}/>
    );
};

InputName.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        touched: PropTypes.shape({ name: PropTypes.bool }).isRequired,
        errors: PropTypes.shape({ name: PropTypes.string }).isRequired,
    }).isRequired,
    maxLength: PropTypes.number,
};

export default InputName;