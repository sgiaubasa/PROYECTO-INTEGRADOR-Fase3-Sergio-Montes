// frontend/src/hooks/useSlider.js
import { useEffect, useState } from "react";
import { API as API_URL } from "@/constants/api.constant";

export default function useSlider() {
  const [images, setImages] = useState([]);   // array de URLs absolutas
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // En prod pega al backend (API_URL incluye /api)
        const res = await fetch(`${API_URL}/sliders`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const payload = Array.isArray(data) ? data : (data.payload ?? []);

        // Acepta claves: image | src | url
        // Y convierte a URL absoluta (prefijando ORIGIN si viene como /api/public/...)
        const toAbs = (u) =>
          u.startsWith("http")
            ? u
            : `${API_URL.replace(/\/api$/, "")}${u.startsWith("/") ? "" : "/"}${u}`;

        const imgs = payload
          .map((s) => s?.src || s?.image || s?.url || "")
          .filter(Boolean)
          .map(toAbs);

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
