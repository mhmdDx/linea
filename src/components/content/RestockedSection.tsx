import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import FadeIn from "@/components/animations/FadeIn";

const RestockedSection = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem, cartOpen, setCartOpen } = useCart();
    const { toast } = useToast();
    const [addingId, setAddingId] = useState<string | null>(null);

    useEffect(() => {
        getAllProducts()
            .then((data) => {
                // Just take the next 4 for the "Restocked" look (avoiding duplicates from New Collection)
                setProducts(data.slice(4, 8));
                setLoading(false);
            })
            .catch((e) => {
                console.error("Shopify error:", e);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = async (variantId: string) => {
        setAddingId(variantId);
        try {
            await addItem(variantId, 1);
            if (!cartOpen) setCartOpen(true);
            toast({
                title: "Added to cart",
                description: "Item has been added to your cart.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not add item to cart.",
                variant: "destructive",
            });
        } finally {
            setAddingId(null);
        }
    };

    if (loading) {
        return (
            <section className="w-full mb-16 px-6 mt-16 text-center">
                <h2 className="text-3xl font-serif text-foreground mb-8 text-center">
                    Restocked Favorites
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-square w-full" />
                            <Skeleton className="h-4 w-2/3 mx-auto" />
                            <Skeleton className="h-4 w-1/3 mx-auto" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <FadeIn>
            <section className="w-full mb-16 px-6 mt-16">
                <h2 className="text-3xl font-serif text-foreground mb-8 text-center">
                    Restocked Favorites
                </h2>

                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {products.map((item) => {
                            const product = item.node;
                            const image = product.images.edges[0]?.node?.url;
                            const variantId = product.variants.edges[0]?.node?.id;

                            // Calculate prices
                            const variant = product.variants.edges[0]?.node;
                            const currentPrice = parseFloat(product.priceRange.minVariantPrice.amount);
                            const comparePrice = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
                            const isOnSale = comparePrice && comparePrice > currentPrice;

                            const formattedPrice = currentPrice.toLocaleString('en-EU', {
                                style: 'currency',
                                currency: product.priceRange.minVariantPrice.currencyCode,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            });

                            const formattedComparePrice = comparePrice ? comparePrice.toLocaleString('en-EU', {
                                style: 'currency',
                                currency: product.priceRange.minVariantPrice.currencyCode,
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }) : null;

                            return (
                                <CarouselItem key={product.id} className="basis-full md:basis-1/2 lg:basis-1/4">
                                    <div className="group flex flex-col h-full">
                                        <Link to={`/product/${product.handle}`} className="block relative overflow-hidden mb-3">
                                            <div className="aspect-square bg-muted/10 relative">
                                                {image ? (
                                                    <img
                                                        src={image}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-muted-foreground">No Image</div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="mb-4 flex-grow space-y-1">
                                            <Link to={`/product/${product.handle}`}>
                                                <h3 className="text-sm font-medium text-foreground hover:underline text-left leading-tight">
                                                    {product.title}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-2">
                                                {isOnSale && formattedComparePrice ? (
                                                    <>
                                                        <p className="text-sm font-light text-muted-foreground line-through">
                                                            {formattedComparePrice}
                                                        </p>
                                                        <p className="text-sm font-light text-foreground">
                                                            {formattedPrice}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm font-light text-foreground">
                                                        {formattedPrice}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-none border-foreground/20 hover:bg-foreground hover:text-background transition-colors"
                                                onClick={() => handleAddToCart(variantId)}
                                                disabled={addingId === variantId}
                                            >
                                                {addingId === variantId ? "Adding..." : "Add to cart"}
                                            </Button>
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 lg:hidden" />
                    <CarouselNext className="right-0 lg:hidden" />
                </Carousel>
            </section>
        </FadeIn>
    );
};

export default RestockedSection;
