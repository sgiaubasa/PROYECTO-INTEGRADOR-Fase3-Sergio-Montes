// frontend/src/hooks/useProduct.js
import { useEffect, useState } from "react";
import productsApi from "../api/products.api.js";

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    highlighted: undefined,
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productsApi.fetchProducts(filters);
      setProducts(data);
    } catch (err) {
      setProducts([]);
      setError(err?.message || "Error al cargar productos.");
    }
    setIsLoading(false);
  };

  const fetchProductById = async (id) => {
    setIsLoading(true);
    setError(null);
    let product = null;
    try {
      product = await productsApi.fetchProductById(id);
    } catch (err) {
      setError(err?.message || "Error al cargar producto.");
    }
    setIsLoading(false);
    return product;
  };

  const createProduct = async (values) => {
    setIsLoading(true);
    setError(null);
    let product = null;
    try {
      // Limpieza defensiva: NUNCA mandar thumbnail como File
      const cleaned = { ...values };
      if (cleaned.thumbnail && typeof cleaned.thumbnail !== "string") {
        delete cleaned.thumbnail;
      }

      product = await productsApi.createProduct(cleaned);
      await fetchProducts();
    } catch (err) {
      setError(err?.message || "Error al crear producto.");
    }
    setIsLoading(false);
    return product;
  };

  const updateProduct = async (id, values) => {
    setIsLoading(true);
    setError(null);
    let product = null;
    try {
      const cleaned = { ...values };
      if (cleaned.thumbnail && typeof cleaned.thumbnail !== "string") {
        delete cleaned.thumbnail;
      }

      product = await productsApi.updateProduct(id, cleaned);
      await fetchProducts();
    } catch (err) {
      setError(err?.message || "Error al modificar producto.");
    }
    setIsLoading(false);
    return product;
  };

  const removeProduct = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await productsApi.removeProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err?.message || "Error al eliminar producto.");
    }
    setIsLoading(false);
  };

  const purchase = async (items) => {
    const resp = await productsApi.purchaseProducts(items);
    await fetchProducts();
    return resp;
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    removeProduct,
    filters,
    setFilters,
    purchase,
  };
};
