import { Text } from "@/components/texts";
import { API_URL_IMAGES } from "@/constants/api.constant.js";
import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import "./mission.scss";

const Mission = () => {
    const { institutionContext } = useContext(AppContext);
    const { institution, isLoading, error } = institutionContext || {};

    if (isLoading) {
        return (
            <section className="mission">
                <Text className="mission__title" variant="h3">Misión</Text>
                <Text variant="p">Cargando institución…</Text>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mission">
                <Text className="mission__title" variant="h3">Misión</Text>
                <Text variant="p">No se pudo cargar la institución: {error}</Text>
            </section>
        );
    }

    const hasMission = !!(institution?.mission?.description && institution?.mission?.thumbnail);

    return (
        <section className="mission">
            <Text className="mission__title" variant="h3">Misión</Text>
            <div>
                {hasMission ? (
                    <>
                        <img
                            className="mission__image"
                            src={`${API_URL_IMAGES}/institutions/${institution.mission.thumbnail}`}
                            alt="Imagen de la misión de la empresa"/>
                        <Text className="mission__description" variant="p">
                            {institution.mission.description}
                        </Text>
                    </>
                ) : (
                    <Text variant="p">Sin datos de misión.</Text>
                )}
            </div>
        </section>
    );
};

export default Mission;