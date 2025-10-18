import PropTypes from "prop-types";
import Input from "./Input";

const InputSurname = (props) => {
    const {
        formik,
        maxLength = 30,
        ...restProps
    } = props;

    return (
        <Input
            type="text"
            id="surname"
            name="surname"
            label="Apellido"
            value={formik.values.surname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.surname && Boolean(formik.errors.surname)}
            helperText={formik.touched.surname && formik.errors.surname}
            inputProps={{ maxLength }}
            {...restProps}/>
    );
};

InputSurname.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({ surname: PropTypes.string.isRequired }).isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        touched: PropTypes.shape({ surname: PropTypes.bool }).isRequired,
        errors: PropTypes.shape({ surname: PropTypes.string }).isRequired,
    }).isRequired,
    maxLength: PropTypes.number,
};

export default InputSurname;