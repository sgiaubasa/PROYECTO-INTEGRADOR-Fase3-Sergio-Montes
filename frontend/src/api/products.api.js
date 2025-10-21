import { API_URL } from "@/constants/api.constant.js";

const mapProduct = (product) => {
  const { _id, ...rest } = product;
  return { id: _id, ...rest };
};

// pequeña utilidad para detectar File en forma robusta
const isFile = (v) =>
  v &&
  typeof v === "object" &&
  typeof v.name === "string" &&
  (v instanceof File || typeof v.size === "number");

const fetchProducts = async (filters = {}) => {
  try {
    let url = `${API_URL}/products`;

    const params = new URLSearchParams();
    if (filters.name) params.set("name", filters.name);
    if (typeof filters.highlighted === "boolean") {
      params.set("highlighted", String(filters.highlighted));
    }

    const qs = params.toString();
    if (qs) url += `?${qs}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const list = Array.isArray(data)
      ? data
      : data && data.status === "success" && Array.isArray(data.payload)
      ? data.payload
      : null;

    if (list) return list.map(mapProduct);

    throw new Error((data && data.message) || "Error al obtener productos");
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

// compat: acepta file en values.thumbnail o values.image
const createProduct = async (values) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("highlighted", values.highlighted || false);

    const file = isFile(values?.thumbnail) ? values.thumbnail
               : isFile(values?.image) ? values.image
               : null;

    if (file) {
      formData.append("thumbnail", file); // el backend espera 'thumbnail'
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

// compat: acepta file en values.thumbnail o values.image
const updateProduct = async (id, values) => {
  try {
    const formData = new FormData();
    if (values.name !== undefined) formData.append("name", values.name);
    if (values.description !== undefined) formData.append("description", values.description);
    if (values.price !== undefined) formData.append("price", values.price);
    if (values.stock !== undefined) formData.append("stock", values.stock);
    if (values.highlighted !== undefined) formData.append("highlighted", values.highlighted);

    const file = isFile(values?.thumbnail) ? values.thumbnail
               : isFile(values?.image) ? values.image
               : null;

    if (file) {
      formData.append("thumbnail", file);
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
      return data.payload ? mapProduct(data.payload) : { id, _id: id };
    }

    throw new Error(data.message || "Error al eliminar producto");
  } catch (error) {
    console.error("Error removing product:", error);
    throw error;
  }
};

const fetchHighlightedProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products?highlighted=true`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const list = Array.isArray(data)
      ? data
      : data && data.status === "success" && Array.isArray(data.payload)
      ? data.payload
      : null;

    if (list) return list.map(mapProduct);

    throw new Error((data && data.message) || "Error al obtener productos destacados");
  } catch (error) {
    console.error("Error fetching highlighted products:", error);
    throw error;
  }
};

/** ✅ NUEVO: compra — descuenta stock en el backend */
const purchaseProducts = async (items) => {
  // items: [{ id, qty }]
  try {
    const res = await fetch(`${API_URL}/products/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();

    if (res.ok && data.status === "success") return data;

    if (res.status === 409) {
      const error = new Error(data.message || "Stock insuficiente");
      error.payload = data.payload;
      throw error;
    }
    throw new Error(data.message || "Error al procesar la compra");
  } catch (error) {
    console.error("purchaseProducts error:", error);
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
  purchaseProducts, // 👈 nuevo
};


