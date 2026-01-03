import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface Product {
    id: string;
    handle: string;
    title: string;
    image?: string;
    price?: {
        amount: string;
        currencyCode: string;
    };
}

interface FavoritesContextType {
    favorites: Product[];
    addToFavorites: (product: Product) => void;
    removeFromFavorites: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (product: Product) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (e) {
                console.error("Failed to parse favorites from local storage", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (product: Product) => {
        if (!isFavorite(product.id)) {
            setFavorites(prev => [...prev, product]);
            toast({
                title: "Added to favorites",
                description: `${product.title} has been saved to your wishlist.`,
            });
        }
    };

    const removeFromFavorites = (productId: string) => {
        setFavorites(prev => prev.filter(item => item.id !== productId));
        toast({
            title: "Removed from favorites",
            description: "Item removed from your wishlist.",
        });
    };

    const isFavorite = (productId: string) => {
        return favorites.some(item => item.id === productId);
    };

    const toggleFavorite = (product: Product) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
