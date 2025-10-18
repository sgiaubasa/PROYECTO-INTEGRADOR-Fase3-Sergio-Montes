import AlertSuccessForm from "@/components/alerts/AlertSuccessForm";
import { ButtonPrimary } from "@/components/buttons";
import { InputEmail, InputInquiry, InputName, InputPhone, InputSurname } from "@/components/inputs";
import PropTypes from "prop-types";
import "./contact-form.scss";
import useContactForm from "./useContactForm";

const ContactForm = (props) => {
    const { className, ...restProps } = props;
    const classes = `contact-form ${className ?? ""}`;

    const { formik, isSubmitted, isSubmitDisabled } = useContactForm();

    return (
        <form className={classes} onSubmit={formik.handleSubmit} {...restProps}>
            <InputName formik={formik} />
            <InputSurname formik={formik} />
            <InputEmail formik={formik} />
            <InputPhone formik={formik} />
            <InputInquiry formik={formik} />

            <div className="contact-form__actions">
                <ButtonPrimary type="submit" disabled={isSubmitDisabled()}>Enviar</ButtonPrimary>
            </div>

            <div className="contact-form__alert">
                <AlertSuccessForm
                    open={isSubmitted}
                    message="Tu consulta fue enviada correctamente."/>
            </div>
        </form>
    );
};

ContactForm.propTypes = {
    className: PropTypes.string,
};

export default ContactForm;