import { Text } from "@/components/texts";
import { useParams } from "react-router-dom";
import ProductForm from "./product-form/ProductForm";
import "./product.scss";

const Product = () => {
    const { id } = useParams();

    return (
        <div className="product">
            <Text variant="h2">Producto</Text>
            <ProductForm idProduct={id || null}/>
        </div>
    );
};

export default Product;