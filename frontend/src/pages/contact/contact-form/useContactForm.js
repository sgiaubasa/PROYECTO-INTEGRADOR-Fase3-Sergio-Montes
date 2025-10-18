import AppContext from "@/contexts/AppContext";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { initialValues } from "./contact-form.initial-value.js";
import { validationSchema } from "./contact-form.validation-schema.js";

const useContactForm = () => {
    const { inquiryContext } = useContext(AppContext);
    const { sendInquiry } = inquiryContext;

    const [ isSubmitted, setIsSubmitted ] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            const success = await sendInquiry(values);

            if (success) {
                formik.resetForm();
                setIsSubmitted(true);
            }
        },
    });

    const isSubmitDisabled = () => {
        return isSubmitted
            || !formik.values.name
            || !formik.values.surname
            || !formik.values.email
            || formik.values.phone?.length < 8
            || formik.values.phone?.length > 15
            || !formik.values.inquiry
            || formik.values.inquiry?.length < 10
            || !formik.isValid
            || inquiryContext.isLoading;
    };

    const close = () => {
        setIsSubmitted(false);
        inquiryContext.resetState();
    };

    return {
        formik,
        isSubmitDisabled,
        isSubmitted,
        isLoading: inquiryContext.isLoading,
        error: inquiryContext.error,
        close,
    };

};
export default useContactForm;