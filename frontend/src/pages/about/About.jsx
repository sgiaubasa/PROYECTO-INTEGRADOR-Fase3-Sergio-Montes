import { Text } from "@/components/texts";
import "./about.scss";
import Mission from "./mission/Mission";
import Values from "./values/Values";
import Vision from "./vision/Vision";

const About = () => {
    return (
        <div className="about">
            <Text variant="h2" className="about__title">
        Nosotros
            </Text>

            {/* Secciones principales */}
            <section className="about__section">
                <Mission />
            </section>

            <section className="about__section">
                <Vision />
            </section>

            <section className="about__section">
                <Values />
            </section>
        </div>
    );
};

export default About;