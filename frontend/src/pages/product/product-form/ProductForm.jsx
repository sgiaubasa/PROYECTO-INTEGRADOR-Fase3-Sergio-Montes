// frontend/src/pages/product/product-form/ProductForm.jsx
import AlertSuccessForm from "@/components/alerts/AlertSuccessForm";
import { ButtonDanger, ButtonPrimary } from "@/components/buttons";
import {
    InputDescription,
    InputImage,
    InputName,
    InputPrice,
    InputStock,
} from "@/components/inputs";
import PropTypes from "prop-types";
import "./product-form.scss";
import useProductForm from "./useProductForm.js";

const ProductForm = (props) => {
  const { idProduct, className, ...restProps } = props;
  const classes = `product-form ${className ?? ""}`;

  const { formik, isSubmitted, isSubmitDisabled, cancel, close } =
    useProductForm(idProduct);

  return (
    <form
      className={classes}
      onSubmit={formik.handleSubmit}
      encType="multipart/form-data"
      {...restProps}
    >
      <InputName formik={formik} />
      <InputDescription formik={formik} />
      <InputPrice formik={formik} />
      <InputStock formik={formik} />

      <InputImage
        formik={formik}
        name="image"
        accept="image/*"
        onChange={(e) => {
          const file = e?.currentTarget?.files?.[0] ?? null;
          if (file) {
            formik.setFieldValue("image", file);
            // Asegurar que NO viaje "thumbnail" desde el form
            formik.setFieldValue("thumbnail", undefined);
          } else {
            formik.setFieldValue("image", undefined);
          }
        }}
      />

      <div className="product-form__actions">
        <ButtonPrimary type="submit" disabled={isSubmitDisabled()}>
          Aceptar
        </ButtonPrimary>
        <ButtonDanger type="button" onClick={() => cancel()}>
          Cancelar
        </ButtonDanger>
      </div>

      <div className="product-form__alert">
        <AlertSuccessForm
          open={isSubmitted}
          message="Los cambios se registraron correctamente."
          onClose={() => close()}
        />
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  idProduct: PropTypes.string,
  className: PropTypes.string,
};

export default ProductForm;


