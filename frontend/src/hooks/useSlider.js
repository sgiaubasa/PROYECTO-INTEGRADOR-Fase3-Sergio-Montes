// frontend/src/hooks/useSlider.js
import { useEffect, useState } from "react";

export default function useSlider() {
  const [images, setImages] = useState([]);   // array de URLs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/sliders"); // <-- PLURAL
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const payload = Array.isArray(data) ? data : (data.payload ?? []);
        const imgs = payload
          .map(s => s?.src || s?.image || s?.url || "")
          .filter(Boolean);
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
