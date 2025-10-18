import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import Input from "./Input";

const InputPhone = (props) => {
    const {
        formik,
        minLength = 8,
        maxLength = 15,
        ...restProps
    } = props;

    return (
        <Input
            type="tel"
            id="phone"
            name="phone"
            label="Teléfono"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            endAdornment={<InputAdornment position="end"><LocalPhoneOutlinedIcon/></InputAdornment>}
            inputProps={{ minLength, maxLength }}
            {...restProps}/>
    );
};

InputPhone.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.shape({ phone: PropTypes.string.isRequired }).isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        touched: PropTypes.shape({ phone: PropTypes.bool }).isRequired,
        errors: PropTypes.shape({ phone: PropTypes.string }).isRequired,
    }).isRequired,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
};

export default InputPhone;