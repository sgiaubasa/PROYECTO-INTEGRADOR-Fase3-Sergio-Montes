import { Text } from "@/components/texts";
import ContactForm from "./contact-form/ContactForm";
import "./contact.scss";
import Institution from "./institution/Institution";

const Contact = () => {
    return (
        <div className="contact">
            <Text variant="h2">Datos de contacto</Text>
            <div className="contact__content">
                <div className="contact__institution">
                    <Institution />
                </div>

                <div className="contact__form">
                    <Text variant="h3">Formulario de consulta</Text>
                    <ContactForm />
                </div>
            </div>
        </div>
    );
};

export default Contact;