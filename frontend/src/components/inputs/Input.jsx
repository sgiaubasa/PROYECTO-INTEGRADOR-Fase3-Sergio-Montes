import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";
import "./input.scss";

const Input = (props) => {
    const {
        className,
        type,
        id,
        name,
        label,
        value,
        onChange,
        onBlur,
        error,
        helperText,
        size = "small",
        endAdornment,
        ...restProps
    } = props;

    const classes = `input  ${error ? "input--invalid" : "input--valid"} ${className ?? ""}`;

    return (
        <FormControl fullWidth className={classes}>
            <InputLabel htmlFor="outlined-adornment-amount" size={size}>{label}</InputLabel>
            <OutlinedInput
                id={id || name}
                label={label}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={error}
                size={size}
                endAdornment={endAdornment}
                {...restProps} />
            {helperText && (
                <FormHelperText className="input__helper-text" error={error} size={size}>{helperText}</FormHelperText>
            )}
        </FormControl>
    );
};

Input.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf([ "text", "email", "number", "tel" ]).isRequired,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    size: PropTypes.oneOf([ "small", "medium", "large" ]),
    endAdornment: PropTypes.node,
};

export default Input;