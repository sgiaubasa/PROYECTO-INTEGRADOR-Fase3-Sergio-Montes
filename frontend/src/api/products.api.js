import { API_URL } from "@/constants/api.constant.js";

const mapProduct = (product) => {
    const { _id, ...rest } = product;
    return { id: _id, ...rest };
};

const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (data.status === "success") {
            return data.payload.map(mapProduct);
        }

        throw new Error(data.message || "Error al obtener productos");
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

const fetchProductById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();

        if (data.status === "success") {
            return mapProduct(data.payload);
        }

        throw new Error(data.message || "Producto no encontrado");
    } catch (error) {
        console.error("Error fetching product by id:", error);
        throw error;
    }
};

const createProduct = async (values) => {
    try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("stock", values.stock);
        formData.append("highlighted", values.highlighted || false);

        if (values.image instanceof File) {
            formData.append("image", values.image);
        }

        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.status === "success") {
            return mapProduct(data.payload);
        }

        throw new Error(data.message || "Error al crear producto");
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

const updateProduct = async (id, values) => {
    try {
        const formData = new FormData();
        if (values.name) formData.append("name", values.name);
        if (values.description !== undefined) formData.append("description", values.description);
        if (values.price) formData.append("price", values.price);
        if (values.stock !== undefined) formData.append("stock", values.stock);
        if (values.highlighted !== undefined) formData.append("highlighted", values.highlighted);

        if (values.image instanceof File) {
            formData.append("image", values.image);
        }

        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "PUT",
            body: formData,
        });

        const data = await response.json();

        if (data.status === "success") {
            return mapProduct(data.payload);
        }

        throw new Error(data.message || "Error al actualizar producto");
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

const removeProduct = async (id) => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (data.status === "success") {
            return mapProduct(data.payload);
        }

        throw new Error(data.message || "Error al eliminar producto");
    } catch (error) {
        console.error("Error removing product:", error);
        throw error;
    }
};

const fetchHighlightedProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products?highlighter=true`);
        const data = await response.json();

        if (data.status === "success") {
            return data.payload.map(mapProduct);
        }

        throw new Error(data.message || "Error al obtener productos destacados");
    } catch (error) {
        console.error("Error fetching highlighted products:", error);
        throw error;
    }
};

export default {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    removeProduct,
    fetchHighlightedProducts,
};