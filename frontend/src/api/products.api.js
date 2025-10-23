import { API_URL } from "@/constants/api.constant.js";

/* ---------------- Helpers / Utils ---------------- */

const mapProduct = (product) => {
  if (!product) return product;
  const { _id, ...rest } = product;
  return { id: _id ?? product.id, ...rest };
};

const isFile = (v) => {
  if (!v || typeof v !== "object") return false;
  const looksLikeFile = typeof v.name === "string" && typeof v.size === "number";
  const isInstanceOfFile = typeof File !== "undefined" && v instanceof File;
  return isInstanceOfFile || looksLikeFile;
};

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && data.status === "success" && Array.isArray(data.payload)) return data.payload;
  return null;
};

const normalizeItem = (data) => {
  if (data && data.status === "success" && data.payload) return data.payload;
  if (data && !data.status) return data;
  return null;
};

const buildQuery = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (typeof filters.highlighted === "boolean") {
    params.set("highlighted", String(filters.highlighted));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

const cleanStr = (v) => (v == null ? "" : String(v).trim());

/** 🔹 NUEVO: limpia y limita longitud (reemplaza saltos de línea por espacio, colapsa espacios) */
const cleanStrLimited = (v, max = 100) => {
  const s = cleanStr(v)
    .replace(/\r?\n+/g, " ")   // \n -> espacio
    .replace(/\s\s+/g, " ");   // múltiples espacios -> uno
  return s.length > max ? s.slice(0, max) : s;
};

const toNumOrEmpty = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : "";
};
const toBoolStr = (v) => (v === true || v === "true" ? "true" : "false");

/* ---------------- API Calls ---------------- */

const fetchProducts = async (filters = {}) => {
  try {
    const url = `${API_URL}/products${buildQuery(filters)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const list = normalizeList(data);
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
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const item = normalizeItem(data);
    if (item) return mapProduct(item);

    throw new Error((data && data.message) || "Producto no encontrado");
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

// compat: acepta file en values.thumbnail o values.image
const createProduct = async (values) => {
  try {
    const formData = new FormData();
    const payloadLog = {
      name: cleanStr(values?.name),
      // 🔸 Limitar a 100 caracteres según tu backend
      description: cleanStrLimited(values?.description, 100),
      price: toNumOrEmpty(values?.price),
      stock: toNumOrEmpty(values?.stock),
      highlighted: toBoolStr(values?.highlighted),
    };

    formData.append("name", payloadLog.name);
    formData.append("description", payloadLog.description);
    formData.append("price", payloadLog.price);
    formData.append("stock", payloadLog.stock);
    formData.append("highlighted", payloadLog.highlighted);

    const file =
      isFile(values?.thumbnail) ? values.thumbnail :
      isFile(values?.image) ? values.image :
      null;

    if (file) formData.append("thumbnail", file);

    console.log("[API createProduct] URL:", `${API_URL}/products`);
    console.log("[API createProduct] payload (sin file):", payloadLog);
    console.log("[API createProduct] file?:", !!file, file?.name);

    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      body: formData,
    });

    const txt = await response.text();
    let data = null;
    try { data = txt ? JSON.parse(txt) : null; } catch { data = null; }

    console.log("[API createProduct] status:", response.status);
    console.log("[API createProduct] raw response:", txt);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status} ${txt || ""}`);
    }

    const item = normalizeItem(data);
    if (item) return mapProduct(item);
    if (data && !data.status) return mapProduct(data);
    return null;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// compat: acepta file en values.thumbnail o values.image
const updateProduct = async (id, values) => {
  try {
    const formData = new FormData();

    if (values.name !== undefined) {
      formData.append("name", cleanStr(values.name));
    }
    if (values.description !== undefined) {
      // 🔸 Limitar a 100 caracteres también en update
      formData.append("description", cleanStrLimited(values.description, 100));
    }
    if (values.price !== undefined) {
      formData.append("price", toNumOrEmpty(values.price));
    }
    if (values.stock !== undefined) {
      formData.append("stock", toNumOrEmpty(values.stock));
    }
    if (values.highlighted !== undefined) {
      formData.append("highlighted", toBoolStr(values.highlighted));
    }

    const file =
      isFile(values?.thumbnail) ? values.thumbnail :
      isFile(values?.image) ? values.image :
      null;

    if (file) formData.append("thumbnail", file);

    console.log("[API updateProduct] URL:", `${API_URL}/products/${id}`);
    console.log("[API updateProduct] fields set:", Object.fromEntries(formData.entries()));

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    const txt = await response.text();
    let data = null;
    try { data = txt ? JSON.parse(txt) : null; } catch { data = null; }

    console.log("[API updateProduct] status:", response.status);
    console.log("[API updateProduct] raw response:", txt);

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status} ${txt || ""}`);
    }

    const item = normalizeItem(data);
    if (item) return mapProduct(item);
    if (data && !data.status) return mapProduct(data);
    return null;
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

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`HTTP ${response.status} ${txt || ""}`);
    }

    const data = await response.json().catch(() => null);

    if (data && data.status === "success") {
      return data.payload ? mapProduct(data.payload) : { id, _id: id };
    }

    if (!data) return { id, _id: id }; // 204 No Content

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

    const list = normalizeList(data);
    if (list) return list.map(mapProduct);

    throw new Error((data && data.message) || "Error al obtener productos destacados");
  } catch (error) {
    console.error("Error fetching highlighted products:", error);
    throw error;
  }
};

const purchaseProducts = async (items) => {
  try {
    const res = await fetch(`${API_URL}/products/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.status === "success") return data;

    if (res.status === 409) {
      const error = new Error(data.message || "Stock insuficiente");
      error.payload = data.payload;
      throw error;
    }
    throw new Error(data.message || `Error al procesar la compra (HTTP ${res.status})`);
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
  purchaseProducts,
};






