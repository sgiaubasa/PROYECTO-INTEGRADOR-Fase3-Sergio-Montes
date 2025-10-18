import { Text } from "@/components/texts";
import ProductGallery from "./product-gallery/ProductGallery";
import "./products.scss";

const Products = () => {
    return (
        <div className="products">
            <Text variant="h2">Productos</Text>
            <ProductGallery />
        </div>
    );
};

export default Products;