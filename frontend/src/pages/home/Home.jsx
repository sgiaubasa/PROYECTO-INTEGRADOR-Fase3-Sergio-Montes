import Slider from "../../components/slider/Slider";
import useSlider from "../../hooks/useSlider";

const Home = () => {
  const { images, loading } = useSlider();

  return (
    <div>
      {loading ? (
        <p>Cargando imágenes...</p>
      ) : (
        <Slider images={images} interval={4000} />
      )}

      <p className="welcome">
        ¡Bienvenido a nuestra tienda de servicios de colocación y revestimiento en madera!  
        Descubre calidad, diseño y confianza en cada proyecto.
      </p>
    </div>
  );
};

export default Home;
