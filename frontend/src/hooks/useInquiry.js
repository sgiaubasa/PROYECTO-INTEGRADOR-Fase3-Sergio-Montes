import { useState } from "react";
import inquiryApi from "../api/inquiry.api.js";

export const useInquiry = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    const sendInquiry = async (values) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await inquiryApi.sendInquiry(values);
            setSuccess(true);
            return true;
        } catch (error) {
            setError(error.message || "Error al enviar la consulta.");
            setSuccess(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setIsLoading(false);
    };

    return {
        sendInquiry,
        resetState,
        isLoading,
        error,
        success,
    };
};