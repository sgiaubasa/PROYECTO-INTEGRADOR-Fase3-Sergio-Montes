import { Text } from "@/components/texts";
import { API_URL_IMAGES } from "@/constants/api.constant.js";
import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import "./values.scss";

const Values = () => {
    const { institutionContext } = useContext(AppContext);
    const { institution } = institutionContext;

    return (
        <section className="values">
            <Text className="values__title" variant="h3">Valores</Text>
            <div>
                {institution.values && institution.values.description && (
                    <>
                        <img className="values__image" src={`${API_URL_IMAGES}/institutions/${institution.values.thumbnail}`} alt="Imagen de los valores de la empresa"/>
                        <Text className="values__description" variant="p">{institution.values.description}</Text>
                    </>
                )}
            </div>
        </section>
    );
};

export default Values;