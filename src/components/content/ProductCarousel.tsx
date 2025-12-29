import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from "embla-carousel-autoplay";
import FadeIn from "@/components/animations/FadeIn";

const ProductCarousel = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Shopify error:", e);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="w-full mb-16 px-6">
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="basis-1/2 md:basis-1/3 lg:basis-1/4 shrink-0">
              <div className="aspect-square mb-3 bg-muted/10 animate-pulse" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="w-full mb-16 px-6 text-center py-12 bg-muted/5">
        <h3 className="text-foreground font-light mb-2">Could not load products</h3>
        <p className="text-sm text-muted-foreground">
          {error
            ? "Please check your Shopify configuration."
            : "No products found in your Shopify store."}
        </p>
      </section>
    );
  }

  return (
    <FadeIn>
      <section className="w-full mb-16 mt-24 px-6">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-serif text-foreground">
            New Arrivals
          </h2>
          <Link
            to="/category/shop"
            className="text-sm border-b border-black pb-0.5 hover:text-muted-foreground transition-colors"
          >
            View All
          </Link>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="">
            {products.map((item) => {
              const product = item.node;
              const image = product.images.edges[0]?.node?.url;

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
                <CarouselItem
                  key={product.id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
                >
                  <Link to={`/product/${product.handle}`}>
                    <Card className="border-none shadow-none bg-transparent group">
                      <CardContent className="p-0">
                        <div className="aspect-[3/4] mb-3 overflow-hidden bg-muted/10 relative">
                          {image ? (
                            <img
                              src={image}
                              alt={product.title}
                              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-muted-foreground">No Image</div>
                          )}
                          <div className="absolute inset-0 bg-black/[0.03]"></div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-medium text-foreground">
                            {product.title}
                          </h3>
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
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="left-0 lg:hidden" />
          <CarouselNext className="right-0 lg:hidden" />
        </Carousel>
      </section>
    </FadeIn>
  );
};

export default ProductCarousel;