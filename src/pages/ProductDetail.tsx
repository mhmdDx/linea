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
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    if (handle) {
      getProductByHandle(handle).then(setProduct);
    }
  }, [handle]);

  // Collect all unique images from product media and variants
  const images = useMemo(() => {
    if (!product) return [];

    const productMedia = product.media?.edges?.map((edge: any) => {
      // Prefer the image url if it's a MediaImage, otherwise fallback to previewImage
      return edge.node.image?.url || edge.node.previewImage?.url;
    }) || [];

    const productImages = product.images?.edges?.map((edge: any) => edge.node.url) || [];

    // Combine both old 'images' field (fallback) and new 'media' field
    const mainImages = productMedia.length > 0 ? productMedia : productImages;

    // Filter images: Show generic images + current variant image. Hide other variants' images.
    if (selectedVariant) {
      const variantImageUrls = new Set(
        product.variants?.edges
          ?.map((e: any) => e.node.image?.url)
          .filter(Boolean)
      );

      const currentVariantImageUrl = selectedVariant.image?.url;

      return mainImages.filter((url: string) => {
        // Always show the current variant's image
        if (url === currentVariantImageUrl) return true;

        // If the image belongs to ANY variant (and isn't the current one), hide it
        if (variantImageUrls.has(url)) return false;

        // Otherwise, it's a generic image (detail shot, etc.), so show it
        return true;
      });
    }

    return mainImages;
  }, [product, selectedVariant]);

  const handleVariantChange = useCallback((variant: any) => {
    if (variant) {
      setSelectedVariant(variant);
      if (variant.image && variant.image.url) {
        setSelectedImage(variant.image.url);

        // Scroll to top on small screens (mobile/tablet) to show the new image
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
              images={images}
              selectedImage={selectedImage}
              product={product}
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