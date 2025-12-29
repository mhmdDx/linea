
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createCart, addToCart, removeCartLines, updateCartLines, getCart } from '../lib/shopify';

interface CartContextType {
    cart: any;
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    addItem: (variantId: string, quantity: number) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
    updateItem: (lineId: string, quantity: number) => Promise<void>;
    checkoutUrl: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<any>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

    useEffect(() => {
        const initializeCart = async () => {
            const existingCartId = localStorage.getItem('shopifyRequestCartId');
            if (existingCartId) {
                try {
                    const existingCart = await getCart(existingCartId);
                    if (existingCart) {
                        setCart(existingCart);
                        setCheckoutUrl(existingCart.checkoutUrl);
                    } else {
                        localStorage.removeItem('shopifyRequestCartId');
                    }
                } catch (e) {
                    console.error("Failed to load existing cart", e);
                    localStorage.removeItem('shopifyRequestCartId');
                }
            }
        };

        initializeCart();
    }, []);

    const addItem = async (variantId: string, quantity: number) => {
        let newCart;
        if (!cart) {
            newCart = await createCart(variantId, quantity);
            localStorage.setItem('shopifyRequestCartId', newCart.id);
        } else {
            newCart = await addToCart(cart.id, variantId, quantity);
        }
        setCart(newCart);
        setCheckoutUrl(newCart.checkoutUrl);
        setCartOpen(true);
    };

    const removeItem = async (lineId: string) => {
        if (!cart) return;
        const newCart = await removeCartLines(cart.id, [lineId]);
        setCart(newCart);
        setCheckoutUrl(newCart.checkoutUrl);
    };

    const updateItem = async (lineId: string, quantity: number) => {
        if (!cart) return;
        const newCart = await updateCartLines(cart.id, lineId, quantity);
        setCart(newCart);
        setCheckoutUrl(newCart.checkoutUrl);
    };

    return (
        <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addItem, removeItem, updateItem, checkoutUrl }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
