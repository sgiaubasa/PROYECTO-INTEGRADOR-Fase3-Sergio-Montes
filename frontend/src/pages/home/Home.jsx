// frontend/src/pages/home/Home.jsx
import { useEffect, useRef, useState } from "react";
import Slider from "../../components/slider/Slider";
import { API as API_URL, API_URL_IMAGES } from "../../constants/api.constant";
import useSlider from "../../hooks/useSlider";
import "./home.scss";

const resolveThumbnail = (thumbnail) => {
  if (!thumbnail) return "";

  // Si ya viene completa (http) → usar tal cual
  if (thumbnail.startsWith("http")) return thumbnail;

  // Si viene como /api/public/... → prefijar ORIGIN (API_URL sin /api)
  if (thumbnail.startsWith("/api/public")) {
    return `${API_URL.replace(/\/api$/, "")}${thumbnail}`;
  }

  // Si es solo el nombre de archivo → armar URL completa (carpeta products)
  return `${API_URL_IMAGES}/products/${thumbnail}`;
};

const Home = () => {
  const { images, loading } = useSlider(); // slider listo con URLs absolutas
  const [highlighted, setHighlighted] = useState([]);
  const carouselRef = useRef(null); // evita querySelector/HMR

  useEffect(() => {
    const fetchHighlighted = async () => {
      try {
        // En prod pega al backend (API_URL incluye /api)
        const res = await fetch(`${API_URL}/products?highlighted=true`, {
          credentials: "include",
        });
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

