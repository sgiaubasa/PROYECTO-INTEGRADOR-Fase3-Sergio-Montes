import { useEffect, useState } from "react";
import institutionApi from "../api/institution.api.js";

export const useInstitution = () => {
    const [ institution, setInstitution ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const fetchInstitution = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await institutionApi.fetchInstitution();
            setInstitution(data);
        } catch (error) {
            setInstitution({});
            setError(error.message || "Error al cargar la institución.");
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchInstitution();
    }, []);

    return {
        institution,
        isLoading,
        error,
    };
};