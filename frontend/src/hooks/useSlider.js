import { useEffect, useState } from "react";

export default function useSlider() {
    const [ images, setImages ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        let ok = true;
        (async () => {
            try {
                const res = await fetch("/api/slider"); // proxy de Vite → :3000
                const data = await res.json();
                const imgs = (data?.payload || []).map((s) => s.src); // ej: "/api/public/images/slider/slider1.jpg"
                if (ok) setImages(imgs);
            } catch (e) {
                console.error("Error cargando slider:", e);
                if (ok) setImages([]);
            } finally {
                if (ok) setLoading(false);
            }
        })();
        return () => { ok = false; };
    }, []);

    return { images, loading };
}