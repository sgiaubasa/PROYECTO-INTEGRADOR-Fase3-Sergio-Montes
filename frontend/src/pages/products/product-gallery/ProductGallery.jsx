import AppContext from "@/contexts/AppContext";
import { useContext } from "react";
import ProductItem from "../product-item/ProductItem";
import ProductNewItem from "../product-new-item/ProductNewItem";
import "./product-gallery.scss";

const ProductGallery = () => {
    const { productsContext } = useContext(AppContext);
    const { products, isLoading } = productsContext;

    return (
        <div className="product-gallery">
            <ProductNewItem/>
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    product={product}
                    isLoading={isLoading}/>
            ))}
        </div>
    );
};

export default ProductGallery;