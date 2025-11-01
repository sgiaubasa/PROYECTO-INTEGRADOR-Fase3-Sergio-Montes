import { Text } from "@/components/texts";
import { Link, useParams } from "react-router-dom";
import ProductForm from "./product-form/ProductForm";
import "./product.scss";

const Product = () => {
    const { id } = useParams();

    return (
        <section className="product">
            <header className="product__header">
                <Text variant="h2" className="product__title">
                    {id ? "Editar producto" : "Nuevo producto"}
                </Text>
                <Link to="/products" className="product__back">
          ← Volver al catálogo
                </Link>
            </header>

            <div className="product__form-container">
                <ProductForm idProduct={id || null} />
            </div>
        </section>
    );
};

export default Product;