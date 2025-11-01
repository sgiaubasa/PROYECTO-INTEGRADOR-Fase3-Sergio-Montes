import { useEffect, useState } from "react";
import { useProduct } from "./useProduct";

const KEY_SHOPPING_CART = "shopping-cart";

export const useShoppingCart = () => {
    const [ shoppingCart, setShoppingCart ] = useState({});
    const { fetchProductById } = useProduct();

    const createShoppingCartSchema = (articles = []) => {
        // limpiar posibles items con cantidad 0
        const clean = (articles || []).filter((a) => (a?.quantity ?? 0) > 0);
        return {
            articles: clean,
            totalQuantity: clean.reduce((acc, item) => acc + item.quantity, 0),
            totalAmount: clean.reduce((acc, item) => acc + item.amount, 0),
        };
    };

    const createArticleSchema = (id, name, quantity, stock, price) => {
        // cap a stock
        if (quantity > stock) quantity = stock;
        // si no hay stock, no crear item
        if (stock <= 0 || quantity <= 0) return null;

        return {
            id,
            name,
            quantity,
            price,
            amount: quantity * price,
            stock, // guardo stock para poder bloquear botones +
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

        const articles = [...(shoppingCart.articles || [])];
        const index = articles.findIndex((item) => item.id === product.id);

        if (index >= 0) {
            const article = articles[index];
            const nextQty = article.quantity + quantity;
            const next = createArticleSchema(product.id, product.name, nextQty, product.stock, product.price);
            if (next) articles[index] = next;
            else articles.splice(index, 1); // si quedó en 0, eliminar
        } else {
            const next = createArticleSchema(product.id, product.name, quantity, product.stock, product.price);
            if (next) articles.push(next);
        }

        const data = createShoppingCartSchema(articles);
        localStorage.setItem(KEY_SHOPPING_CART, JSON.stringify(data));
        setShoppingCart(data);
    };

    const subtractArticle = async (idProduct, quantity) => {
        const product = await fetchProductById(idProduct);

        const articles = [...(shoppingCart.articles || [])];
        const index = articles.findIndex((item) => item.id === product.id);

        if (index >= 0) {
            const article = articles[index];
            const nextQty = article.quantity - quantity;
            const next = createArticleSchema(product.id, product.name, nextQty, product.stock, product.price);

            if (next) articles[index] = next;
            else articles.splice(index, 1);

            const data = createShoppingCartSchema(articles);
            localStorage.setItem(KEY_SHOPPING_CART, JSON.stringify(data));
            setShoppingCart(data);
        }
    };

    /** ✅ NUEVOS helpers */
    const removeArticle = (idProduct) => {
        const articles = (shoppingCart.articles || []).filter((a) => a.id !== idProduct);
        const data = createShoppingCartSchema(articles);
        localStorage.setItem(KEY_SHOPPING_CART, JSON.stringify(data));
        setShoppingCart(data);
    };

    const clear = () => {
        const data = createShoppingCartSchema([]);
        localStorage.setItem(KEY_SHOPPING_CART, JSON.stringify(data));
        setShoppingCart(data);
    };

    useEffect(() => {
        getShoppingCart();
    }, []);

    return {
        shoppingCart,
        addArticle,
        subtractArticle,
        removeArticle, // 👈 nuevo
        clear, // 👈 nuevo
    };
};