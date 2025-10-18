import { Text } from "@/components/texts";
import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import InstitutionItem from "../institution-item/InstitutionItem";
import "./institution.scss";

const Institution = () => {
    const { institutionContext } = useContext(AppContext);
    const { institution } = institutionContext;

    const getItems = () => {
        return [
            {
                label: "Nombre",
                value: institution.name ?? "",
            },
            {
                label: "Dirección",
                value: institution.address ?? "",
            },
            {
                label: "Email",
                value: institution.email ?? "",
            },
            {
                label: "Teléfono",
                value: institution.phone ?? "",
            },
        ];
    };

    return (
        <div className="institution">
            <Text variant="h3">Datos de contacto</Text>
            <ul className="institution__list">
                {getItems().map((item, index) => (
                    <InstitutionItem key={index} item={item} />
                ))}
            </ul>
        </div>
    );
};

export default Institution;