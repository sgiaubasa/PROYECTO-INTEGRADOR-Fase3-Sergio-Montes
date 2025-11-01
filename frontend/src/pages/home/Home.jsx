import { useEffect, useRef, useState } from "react";
import Slider from "../../components/slider/Slider";
import { API_URL_IMAGES } from "../../constants/api.constant"; // ✅ usamos tu constante
import useSlider from "../../hooks/useSlider";
import "./home.scss";

const resolveThumbnail = (thumbnail) => {
    if (!thumbnail) return ""; // podés poner un placeholder si querés
    // Si ya viene completa (http o /api/public) la usamos tal cual
    if (thumbnail.startsWith("http") || thumbnail.startsWith("/api/public")) return thumbnail;
    // Si es solo el nombre de archivo, armamos la URL como hace tu página de productos
    // (ajustá "products" si tu backend guarda en otra carpeta)
    return `${API_URL_IMAGES}/products/${thumbnail}`;
};

const Home = () => {
    const { images, loading } = useSlider();
    const [ highlighted, setHighlighted ] = useState([]);
    const carouselRef = useRef(null); // ✅ evitamos querySelector/HMR

    useEffect(() => {
        const fetchHighlighted = async () => {
            try {
                const res = await fetch("/api/products?highlighted=true");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const payload = data?.payload || [];

                // mapeamos la URL de imagen para que siempre sea válida
                const mapped = payload.map((p) => ({
                    ...p,
                    thumbnailUrl: resolveThumbnail(p.thumbnail),
                }));

                setHighlighted(mapped);
            } catch (e) {
                console.error("Error cargando productos destacados:", e);
                setHighlighted([]);
            }
        };
        fetchHighlighted();
    }, []);

    const scroll = (direction) => {
        const container = carouselRef.current;
        if (!container) return;
        const scrollAmount = direction === "left" ? -300 : 300;
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    return (
        <div className="home">
            {loading ? <p>Cargando slider...</p> : <Slider images={images} interval={4000} />}

            <section className="highlighted-products">
                <h2>Productos Destacados</h2>

                {highlighted.length > 0 ? (
                    <div className="carousel-container">
                        <button className="scroll-btn left" onClick={() => scroll("left")}>
              ❮
                        </button>

                        <div className="carousel" ref={carouselRef}>
                            {highlighted.map((p) => (
                                <div className="product-card" key={p._id}>
                                    <img src={p.thumbnailUrl} alt={p.name} />
                                    <h3>{p.name}</h3>
                                    <p>{p.description}</p>
                                    <span className="price">${p.price}</span>
                                </div>
                            ))}
                        </div>

                        <button className="scroll-btn right" onClick={() => scroll("right")}>
              ❯
                        </button>

                        <div className="fade fade-left" />
                        <div className="fade fade-right" />
                    </div>
                ) : (
                    <p className="no-products">No hay productos destacados disponibles.</p>
                )}
            </section>
        </div>
    );
};

export default Home;