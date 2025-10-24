import { Text } from "@/components/texts";
import AppContext from "@/contexts/AppContext";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useContext, useState } from "react";
import "./shopping-cart.scss";

const ShoppingCart = () => {
    const { shoppingCartContext, productsContext } = useContext(AppContext);
    const { shoppingCart, addArticle, subtractArticle, removeArticle, clear } = shoppingCartContext;
    const { purchase } = productsContext;

    const [ error, setError ] = useState("");
    const [ ok, setOk ] = useState("");

    const onInc = (id, item) => {
        // bloquear si ya está al tope del stock
        if (item.quantity >= (item.stock ?? 0)) return;
        addArticle(id, 1);
    };

    const onDec = (id) => {
        subtractArticle(id, 1);
    };

    const onRemove = (id) => {
        removeArticle(id);
    };

    const onCheckout = async () => {
        setError(""); setOk("");
        const items = (shoppingCart.articles || []).map((a) => ({ id: a.id, qty: a.quantity }));

        if (items.length === 0) return;

        try {
            await purchase(items);
            setOk("Compra realizada con éxito. Stock actualizado.");
            clear();
        } catch (e) {
            if (e?.payload) {
                // payload: estado actual de stock en DB
                const faltantes = e.payload
                    .filter((p) => {
                        const inCart = (shoppingCart.articles || []).find((i) => i.id === String(p._id) || i.id === p._id);
                        return inCart && inCart.quantity > p.stock;
                    })
                    .map((p) => `${p.name} (stock: ${p.stock})`)
                    .join(", ");
                setError(`Stock insuficiente: ${faltantes}`);
            } else {
                setError(e.message || "No se pudo procesar la compra.");
            }
        }
    };

    const total = Number(shoppingCart.totalAmount || 0).toFixed(2);
    const totalUnits = shoppingCart.totalQuantity || 0;

    return (
        <div className="shopping-cart">
            <Text variant="h2">Carrito</Text>

            <Table>
                <TableHead>
                    <TableRow className="table__head">
                        <TableCell align="left">Producto</TableCell>
                        <TableCell align="center">Cant.</TableCell>
                        <TableCell align="right">Precio</TableCell>
                        <TableCell align="right">Importe</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shoppingCart.articles?.map((article)=>(
                        <TableRow key={article.id} className="table__body">
                            <TableCell align="left">{article.name}</TableCell>

                            <TableCell align="center" style={{ whiteSpace: "nowrap" }}>
                                <button onClick={() => onDec(article.id)}>-</button>
                                <span style={{ padding: "0 8px" }}>{article.quantity}</span>
                                <button
                                    onClick={() => onInc(article.id, article)}
                                    disabled={article.quantity >= (article.stock ?? 0)}>+</button>
                            </TableCell>

                            <TableCell align="right">${Number(article.price).toFixed(2)}</TableCell>
                            <TableCell align="right">${Number(article.amount).toFixed(2)}</TableCell>

                            <TableCell align="center">
                                <button onClick={() => onRemove(article.id)}>Eliminar</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="table__footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text className="table__total" variant="p">
                    Total unidades: {totalUnits} — Total: ${total}
                </Text>
                <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn btn-danger" onClick={() => clear()}>Cancelar</button>
                    <button className="btn btn-primary" onClick={onCheckout} disabled={(shoppingCart.articles || []).length === 0}>
                        Comprar
                    </button>
                </div>
            </div>

            {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
            {ok && <div style={{ color: "green", marginTop: 8 }}>{ok}</div>}
        </div>
    );
};

export default ShoppingCart;