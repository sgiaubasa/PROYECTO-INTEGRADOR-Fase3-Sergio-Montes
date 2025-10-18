import AlertSuccessForm from "@/components/alerts/AlertSuccessForm";
import { ButtonDanger, ButtonPrimary } from "@/components/buttons";
import { InputDescription, InputImage, InputName, InputPrice, InputStock } from "@/components/inputs";
import PropTypes from "prop-types";
import "./product-form.scss";
import useProductForm from "./useProductForm.js";

const ProductForm = (props) => {
    const { idProduct, className, ...restProps } = props;
    const classes = `product-form ${className ?? ""}`;

    const { formik, isSubmitted, isSubmitDisabled, cancel, close } = useProductForm(idProduct);

    return (
        <form className={classes} onSubmit={formik.handleSubmit} {...restProps}>
            <InputName formik={formik} />
            <InputDescription formik={formik} />
            <InputPrice formik={formik} />
            <InputStock formik={formik} />
            <InputImage formik={formik} />

            <div className="product-form__actions">
                <ButtonPrimary type="submit" disabled={isSubmitDisabled()}>Aceptar</ButtonPrimary>
                <ButtonDanger type="button" onClick={() => cancel()}>Cancelar</ButtonDanger>
            </div>

            <div className="product-form__alert">
                <AlertSuccessForm
                    open={isSubmitted}
                    message="Los cambios se registraron correctamente."
                    onClose={() => close()}/>
            </div>
        </form>
    );
};

ProductForm.propTypes = {
    idProduct: PropTypes.string,
    className: PropTypes.string,
};

export default ProductForm;