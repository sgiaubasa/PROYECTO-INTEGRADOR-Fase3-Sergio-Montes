import { Text } from "@/components/texts";
import { API_URL_IMAGES } from "@/constants/api.constant.js";
import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import "./mission.scss";

const Mission = () => {
    const { institutionContext } = useContext(AppContext);
    const { institution } = institutionContext;

    return (
        <section className="mission">
            <Text className="mission__title" variant="h3">Misión</Text>
            <div>
                {institution.mission && institution.mission.description && (
                    <>
                        <img className="mission__image" src={`${API_URL_IMAGES}/institutions/${institution.mission.thumbnail}`} alt="Imagen de la misión de la empresa"/>
                        <Text className="mission__description" variant="p">{institution.mission.description}</Text>
                    </>
                )}
            </div>
        </section>
    );
};

export default Mission;