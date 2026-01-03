import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getProductByHandle } from "@/lib/shopify";

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (handle) {
      getProductByHandle(handle).then(setProduct);
    }
  }, [handle]);

  // Collect all unique images from product and variants
  const images = useMemo(() => {
    if (!product) return [];

    const productImages = product.images?.edges?.map((edge: any) => edge.node.url) || [];
    const variantImages = product.variants?.edges
      ?.map((edge: any) => edge.node.image?.url)
      .filter((url: string | undefined) => url !== undefined) || [];

    // Merge and deduplicate images
    const allImages = Array.from(new Set([...productImages, ...variantImages]));
    return allImages.length > 0 ? allImages : productImages;
  }, [product]);

  const handleVariantChange = useCallback((variant: any) => {
    if (variant && variant.image && variant.image.url) {
      setSelectedImage(variant.image.url);

      // Scroll to top on small screens (mobile/tablet) to show the new image
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <section className="w-full lg:px-6">
          {/* Breadcrumb - Show above image on smaller screens */}
          <div className="lg:hidden mb-6 px-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/category/shop">Shop</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <ProductImageGallery
              images={selectedImage ? [selectedImage] : images}
              selectedImage={selectedImage}
            />

            <div className="lg:pl-20 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit px-6 lg:px-0">
              <ProductInfo product={product} onVariantChange={handleVariantChange} />
              {/* <ProductDescription description={product.descriptionHtml} /> */}
            </div>
          </div>
        </section>

        <section className="w-full mt-16 lg:mt-24">
          <div className="mb-4 px-6">
            <h2 className="text-2xl font-heading text-foreground mb-8 text-center uppercase tracking-widest">You might also like</h2>
          </div>
          <ProductCarousel />
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;