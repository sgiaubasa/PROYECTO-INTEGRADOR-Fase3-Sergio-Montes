import { Text } from "@/components/texts";
import "./about.scss";
import Mission from "./mission/Mission";
import Values from "./values/Values";
import Vision from "./vision/Vision";

const About = () => {
    return (
        <div className="about">
            <Text variant="h2">Nosotros</Text>
            <Mission/>
            <Vision/>
            <Values/>
        </div>
    );
};

export default About;