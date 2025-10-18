import { useEffect, useState } from "react";
import { useProduct } from "./useProduct";

const KEY_SHOPPING_CART = "shopping-cart";

export const useShoppingCart = () => {
    const [ shoppingCart, setShoppingCart ] = useState({});
    const { fetchProductById } = useProduct();

    const createShoppingCartSchema = (articles = []) => {
        return {
            articles,
            totalQuantity: articles.reduce((acc, item) => acc + item.quantity, 0),
            totalAmount: articles.reduce((acc, item) => acc + item.amount, 0),

        };
    };

    const createArticleSchema = (id, name, quantity, stock, price) => {
        if (quantity > stock) {
            quantity = stock;
        }

        return {
            id,
            name,
            quantity,
            price,
            amount: quantity * price,
        };
    };

    const getShoppingCart = () => {
        let data = JSON.parse(localStorage.getItem(KEY_SHOPPING_CART));

        if (!data) {
            data = createShoppingCartSchema();
            localStorage.setItem(KEY_SHOPPING_CART, JSON.stringify(data));
        }

        setShoppingCart(data);
    };

    const addArticle = async (idProduct, quantity) => {
        const product = await fetchProductById(idProduct);

        const articles = shoppingCart.articles;
        const index = articles.findIndex((item) => item.id === product.id);

        if (index >= 0) {
            const article = articles[index];
            quantity = article.quantity + quantity;
            articles[index] = createArticleSchema(product.id, product.name, quantity, product.stock, product.price);
        } else {
            articles.push(createArticleSchema(product.id, product.name, quantity, product.stock, product.price));
        }

        const data = createShoppingCartSchema(articles);
        localStorage.setItem(KEY_SHOPPING_CART, JSON.stringify(data));
        setShoppingCart(data);
    };

    const subtractArticle = async (idProduct, quantity) => {
        const product = await fetchProductById(idProduct);

        const articles = shoppingCart.articles;
        const index = articles.findIndex((item) => item.id === product.id);

        if (index >= 0) {
            const article = articles[index];
            quantity = article.quantity - quantity;
            articles[index] = createArticleSchema(product.id, product.name, quantity, product.stock, product.price);

            if (quantity <= 0) {
                articles.splice(index, 1);
            }

            const data = createShoppingCartSchema(articles);
            localStorage.setItem(KEY_SHOPPING_CART, JSON.stringify(data));
            setShoppingCart(data);
        }
    };

    useEffect(() => {
        getShoppingCart();
    }, []);

    return {
        shoppingCart,
        addArticle,
        subtractArticle,
    };
};