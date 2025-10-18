import AppContext from "@/contexts/AppContext";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialValues } from "./product-form.initial-value.js";
import { validationSchema } from "./product-form.validation-schema.js";

const useProductForm = (idProduct) => {
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const { productsContext } = useContext(AppContext);
    const { updateProduct, createProduct, fetchProducts, fetchProductById } = productsContext;
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values) => {
            idProduct ? updateProduct(idProduct, values) : createProduct(values);
            setIsSubmitted(true);
            fetchProducts();
        },
    });

    const isSubmitDisabled = () => {
        return isSubmitted
            || !formik.values.name
            || formik.values.price <= 0
            || formik.values.stock < 0
            || !formik.values.thumbnail
            || !formik.isValid;
    };

    const close = () => {
        formik.resetForm();
        navigate("/products");
    };

    const cancel = () => {
        formik.resetForm();
        navigate("/products");
    };

    const loadProduct = async (idProduct) => {
        const product = await fetchProductById(idProduct);
        formik.setValues(product);
    };

    useEffect(() => {
        if (idProduct) {
            loadProduct(idProduct);
        }
    }, [idProduct] );

    return {
        formik,
        isSubmitDisabled,
        isSubmitted,
        close,
        cancel,
    };

};

export default useProductForm;