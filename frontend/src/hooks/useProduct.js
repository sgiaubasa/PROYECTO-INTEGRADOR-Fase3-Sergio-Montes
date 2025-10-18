import { useEffect, useState } from "react";
import productsApi from "../api/products.api.js";

export const useProduct = () => {
    const [ products, setProducts ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await productsApi.fetchProducts();
            setProducts(data);
        } catch (error) {
            setProducts([]);
            setError(error.message || "Error al cargar productos.");
        }

        setIsLoading(false);
    };

    const fetchProductById = async (id) => {
        setIsLoading(true);
        setError(null);
        let product = null;

        try {
            product = await productsApi.fetchProductById(id);
        } catch (error) {
            setError(error.message || "Error al carga producto.");
        }

        setIsLoading(false);
        return product;
    };

    const createProduct = async (values) => {
        setIsLoading(true);
        setError(null);
        let product = null;

        try {
            product = await productsApi.createProduct(values);
            fetchProducts();
        } catch (error) {
            setError(error.message || "Error al crear producto.");
        }

        setIsLoading(false);
        return product;
    };

    const updateProduct = async (id, values) => {
        setIsLoading(true);
        setError(null);
        let product = null;

        try {
            product = await productsApi.updateProduct(id, values);
            fetchProducts();
        } catch (error) {
            setError(error.message || "Error al modificar producto.");
        }

        setIsLoading(false);
        return product;
    };

    const removeProduct = async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            await productsApi.removeProduct(id);
            fetchProducts();
        } catch (error) {
            setError(error.message || "Error al eliminar producto.");
        }

        setIsLoading(false);
    };

    const checkProductStock = async (id) => {
        setIsLoading(true);
        setError(null);
        let result = false;

        try {
            result = await productsApi.checkProductStock(id);
        } catch (error) {
            setError(error.message || "Error al chequear stock de producto.");
        }

        setIsLoading(false);
        return result;
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        isLoading,
        error,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        removeProduct,
        checkProductStock,
    };
};