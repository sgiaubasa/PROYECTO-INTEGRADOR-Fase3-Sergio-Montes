import PropTypes from "prop-types";
import { useMemo } from "react";
import AppContext from "./AppContext";

import { useInquiry } from "@/hooks/useInquiry";
import { useInstitution } from "@/hooks/useInstitution";
import { useProduct } from "@/hooks/useProduct";
import { useShoppingCart } from "@/hooks/useShoppingCart";

/**
 * Provee los contexts de la app con memoización y valores por defecto “safe”.
 * Mantiene la forma:
 *  - institutionContext
 *  - productsContext
 *  - shoppingCartContext
 *  - inquiryContext
 */
const AppProvider = ({ children }) => {
    // Hooks (si alguno devuelve undefined por error de import, damos fallback)
    const _institution = useInstitution?.() ?? {
        institution: null,
        loadingInstitution: false,
        errorInstitution: null,
        refreshInstitution: async () => {},
    };

    const _products = useProduct?.() ?? {
        products: [],
        loadingProducts: false,
        errorProducts: null,
        filters: { name: "", highlighted: undefined, page: 1, limit: 20 },
        refreshProducts: async () => {},
        createProduct: async () => {},
        updateProduct: async () => {},
        deleteProduct: async () => {},
    };

    const _shopping = useShoppingCart?.() ?? {
        cart: [],
        addItem: () => {},
        removeItem: () => {},
        clear: () => {},
        total: 0,
    };

    const _inquiry = useInquiry?.() ?? {
        sending: false,
        error: null,
        send: async () => ({ ok: false }),
    };

    // Memoizamos el value para evitar rerenders innecesarios
    const value = useMemo(
        () => ({
            institutionContext: _institution,
            productsContext: _products,
            shoppingCartContext: _shopping,
            inquiryContext: _inquiry,
        }),
        [ _institution, _products, _shopping, _inquiry ],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppProvider;