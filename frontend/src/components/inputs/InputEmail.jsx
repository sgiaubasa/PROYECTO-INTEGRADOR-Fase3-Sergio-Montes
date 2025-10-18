import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import Input from "./Input";

const InputEmail = (props) => {
    const {
        formik,
        maxLength = 50,
        ...restProps
    } = props;

    return (
        <Input
            type="email"
            id="email"
            name="email"
            label="E-mail"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            endAdornment={<InputAdornment position="end"><EmailOutlinedIcon/></InputAdornment>}
            inputProps={{ maxLength }}
            {...restProps}/>
    );
};

InputEmail.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({ email: PropTypes.string.isRequired }).isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        touched: PropTypes.shape({ email: PropTypes.bool }).isRequired,
        errors: PropTypes.shape({ email: PropTypes.string }).isRequired,
    }).isRequired,
    maxLength: PropTypes.number,
};

export default InputEmail;