import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";
import { getAllProducts, getProductsByCollection, getProductsByQuery } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import type { FilterState } from "./FilterSortBar";

interface ProductGridProps {
  categoryHandle?: string;
  filters?: FilterState;
  sortBy?: string;
  onProductCountChange?: (count: number) => void;
}

const ProductGrid = ({ categoryHandle, filters, sortBy, onProductCountChange }: ProductGridProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        let data;
        // If specific category and not a general "shop" or "new-in" page that might need special logic
        // For simplicity, assuming "shop" means all products for now, or handle it differently if needed.
        if (categoryHandle && categoryHandle !== 'shop' && categoryHandle !== 'new-in') {
          // First try to get by collection handle
          data = await getProductsByCollection(categoryHandle);

          // If no products found via collection, try searching by title
          if (!data || data.length === 0) {
            // Search by title containing the category name (e.g., "bracelet" matches "Golden Halo Bracelet")
            // Remove the 's' at the end for singular form matching
            const singular = categoryHandle.endsWith('s') ? categoryHandle.slice(0, -1) : categoryHandle;
            data = await getProductsByQuery(`title:*${singular}*`);
          }
        } else {
          data = await getAllProducts();
        }
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryHandle]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply category filter (only if user explicitly selected categories)
    if (filters?.categories && filters.categories.length > 0) {
      result = result.filter(item => {
        const product = item.node;
        return filters.categories.some(cat => {
          const singular = cat.endsWith('s') ? cat.slice(0, -1) : cat;
          return product.title.toLowerCase().includes(singular.toLowerCase());
        });
      });
    }

    // Apply price filter
    if (filters?.priceRanges && filters.priceRanges.length > 0) {
      result = result.filter(item => {
        const product = item.node;
        const price = parseFloat(product.priceRange.minVariantPrice.amount);

        return filters.priceRanges.some(range => {
          if (range === "Under €1,000") return price < 1000;
          if (range === "€1,000 - €2,000") return price >= 1000 && price < 2000;
          if (range === "€2,000 - €3,000") return price >= 2000 && price < 3000;
          if (range === "Over €3,000") return price >= 3000;
          return false;
        });
      });
    }

    // Apply material filter
    if (filters?.materials && filters.materials.length > 0) {
      result = result.filter(item => {
        const product = item.node;
        return filters.materials.some(material =>
          product.title.toLowerCase().includes(material.toLowerCase())
        );
      });
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const priceA = parseFloat(a.node.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.node.priceRange.minVariantPrice.amount);

        switch (sortBy) {
          case "price-low":
            return priceA - priceB;
          case "price-high":
            return priceB - priceA;
          case "name":
            return a.node.title.localeCompare(b.node.title);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(result);
    if (onProductCountChange) {
      onProductCountChange(result.length);
    }
  }, [products, filters, sortBy, onProductCountChange]);

  if (loading) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full aspect-square" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (filteredProducts.length === 0 && !loading) {
    return (
      <section className="w-full px-6 mb-16 text-center py-20">
        <p className="text-muted-foreground">No products found.</p>
      </section>
    )
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((item) => {
          const product = item.node;
          const image = product.images.edges[0]?.node?.url;
          const hoverImage = product.images.edges[1]?.node?.url;

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
            <Link key={product.id} to={`/product/${product.handle}`}>
              <Card
                className="border-none shadow-none bg-transparent group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    {image ? (
                      <img
                        src={image}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-muted-foreground text-xs">No Image</div>
                    )}

                    {hoverImage && (
                      <img
                        src={hoverImage}
                        alt={`${product.title} alternate view`}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100"
                      />
                    )}

                    <div className="absolute inset-0 bg-black/[0.03]"></div>
                    {/* {product.availableForSale && (
                      <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                        NEW
                      </div>
                    )} */}
                  </div>
                  <div className="space-y-1">
                    {/* <p className="text-sm font-light text-foreground">
                       Category
                    </p> */}
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
          )
        })}
      </div>

      {/* <Pagination /> */}
    </section>
  );
};

export default ProductGrid;