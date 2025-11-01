import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "./slider.scss";

const Slider = ({
    images = [], // ✅ valores por defecto
    interval = 3000, // ✅ valores por defecto
}) => {
    const [ currentIndex, setCurrentIndex ] = useState(0);

    useEffect(() => {
        if (!images.length) return; // evita intervalos vacíos

        const slideInterval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1,
            );
        }, interval);

        return () => clearInterval(slideInterval);
    }, [ images, interval ]);

    if (!images.length) {
        return (
            <div className="slider-skeleton">
                <p>Cargando slider...</p>
            </div>
        );
    }

    return (
        <div className="slider">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentIndex ? "active" : ""}`}>
                    <img src={img} alt={`slide-${index}`} />
                </div>
            ))}

            {/* Botones de navegación */}
            {images.length > 1 && (
                <>
                    <button
                        className="prev"
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex === 0
                                    ? images.length - 1
                                    : currentIndex - 1,
                            )
                        }>
            ❮
                    </button>
                    <button
                        className="next"
                        onClick={() =>
                            setCurrentIndex(
                                currentIndex === images.length - 1
                                    ? 0
                                    : currentIndex + 1,
                            )
                        }>
            ❯
                    </button>
                </>
            )}

            {/* Indicadores */}
            <div className="indicators">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={index === currentIndex ? "active" : ""}
                        onClick={() => setCurrentIndex(index)}/>
                ))}
            </div>
        </div>
    );
};

Slider.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    interval: PropTypes.number,
};

export default Slider;