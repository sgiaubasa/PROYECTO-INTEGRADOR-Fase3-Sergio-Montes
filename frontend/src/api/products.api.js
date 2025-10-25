import { API_URL } from "@/constants/api.constant.js";

/* Helpers */

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
  if (typeof filters.highlighted === "boolean") params.set("highlighted", String(filters.highlighted));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

const clean = (s) => (s == null ? "" : String(s).trim());
const toNumStr = (v) =>
  v === null || v === undefined || v === "" ? "" : String(Number(v));

/* --------- SIEMPRE FormData: campos + (opcional) image --------- */
const toFormData = (values = {}) => {
  const fd = new FormData();

  fd.append("name", clean(values.name));
  fd.append("description", clean(values.description));

  fd.append("price", toNumStr(values.price));
  fd.append("stock", toNumStr(values.stock));

  const highlightedBool = values.highlighted === true || values.highlighted === "true";
  fd.append("highlighted", highlightedBool ? "true" : "false");

  if (isFile(values.image)) {
    fd.append("image", values.image);
  }
  // nunca enviar "thumbnail" como File

  return fd;
};

/* ---------------- API ---------------- */

const fetchProducts = async (filters = {}) => {
  const url = `${API_URL}/products${buildQuery(filters)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const list = normalizeList(data);
  if (list) return list.map(mapProduct);
  throw new Error(data?.message || "Error al obtener productos");
};

const fetchProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const item = normalizeItem(data);
  if (item) return mapProduct(item);
  throw new Error(data?.message || "Producto no encontrado");
};

const createProduct = async (values) => {
  const safe = { ...values };
  if (safe.thumbnail && typeof safe.thumbnail !== "string") delete safe.thumbnail;

  const body = toFormData(safe);
  const res = await fetch(`${API_URL}/products`, { method: "POST", body });
  const txt = await res.text();
  let data = null; try { data = txt ? JSON.parse(txt) : null; } catch {}
  if (!res.ok) {
    console.error("[API createProduct] server said:", txt);
    throw new Error(data?.message || `HTTP ${res.status} ${txt || ""}`);
  }
  const item = normalizeItem(data);
  if (item) return mapProduct(item);
  if (data && !data.status) return mapProduct(data);
  return null;
};

const updateProduct = async (id, values) => {
  const safe = { ...values };
  if (safe.thumbnail && typeof safe.thumbnail !== "string") delete safe.thumbnail;

  const body = toFormData(safe);
  const res = await fetch(`${API_URL}/products/${id}`, { method: "PUT", body });
  const txt = await res.text();
  let data = null; try { data = txt ? JSON.parse(txt) : null; } catch {}
  if (!res.ok) {
    console.error("[API updateProduct] server said:", txt);
    throw new Error(data?.message || `HTTP ${res.status} ${txt || ""}`);
  }
  const item = normalizeItem(data);
  if (item) return mapProduct(item);
  if (data && !data.status) return mapProduct(data);
  return null;
};

const removeProduct = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status} ${txt || ""}`);
  }
  const data = await res.json().catch(() => null);
  if (data?.status === "success") return data.payload ? mapProduct(data.payload) : { id, _id: id };
  if (!data) return { id, _id: id };
  throw new Error(data.message || "Error al eliminar producto");
};

const fetchHighlightedProducts = async () => {
  const res = await fetch(`${API_URL}/products?highlighted=true`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const list = normalizeList(data);
  if (list) return list.map(mapProduct);
  throw new Error(data?.message || "Error al obtener productos destacados");
};

const purchaseProducts = async (items) => {
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




