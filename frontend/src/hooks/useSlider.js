// frontend/src/hooks/useSlider.js
import { useEffect, useState } from "react";
import { API_BASE } from "@/constants/api.constant"; // 👈 base del backend

export default function useSlider() {
  const [images, setImages] = useState([]);   // array de URLs finales
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/sliders`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const payload = Array.isArray(data) ? data : (data.payload ?? []);

        // Normalizamos a URL absoluta:
        const imgs = payload
          .map(s => s?.src || s?.image || s?.url || "")
          .filter(Boolean)
          .map(u => (u.startsWith("http") ? u : `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`));

        if (alive) setImages(imgs);
      } catch (e) {
        console.error("Error cargando slider:", e);
        if (alive) setImages([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  return { images, loading };
}
