import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Minus, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductInfo = ({ product, onVariantChange }: { product: any, onVariantChange?: (variant: any) => void }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  // Initialize with options from the first variant or defaults
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Track the current product ID to prevent unnecessary resets
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  useEffect(() => {
    if (product && product.variants?.edges?.length > 0 && product.id !== currentProductId) {
      setCurrentProductId(product.id);

      // Default to the first variant
      const defaultVariant = product.variants.edges[0].node;
      setSelectedVariant(defaultVariant);

      const initialOptions: Record<string, string> = {};
      defaultVariant.selectedOptions.forEach((opt: any) => {
        initialOptions[opt.name] = opt.value;
      });
      setSelectedOptions(initialOptions);

      // Notify parent of initial variant
      if (onVariantChange) {
        onVariantChange(defaultVariant);
      }
    }
  }, [product, onVariantChange, currentProductId]);

  const handleOptionChange = (name: string, value: string) => {
    const newOptions = { ...selectedOptions, [name]: value };
    setSelectedOptions(newOptions);

    // Find matching variant
    const variant = product.variants.edges.find((edge: any) => {
      return edge.node.selectedOptions.every((opt: any) => newOptions[opt.name] === opt.value);
    });

    if (variant) {
      setSelectedVariant(variant.node);
      if (onVariantChange) {
        onVariantChange(variant.node);
      }
    } else {
      // Optional: Handle case where variant doesn't exist (though usually it should if options are derived correctly)
      setSelectedVariant(null);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    await addItem(selectedVariant.id, quantity);
    setAdding(false);
  };

  if (!product || !selectedVariant) return null;

  const currentPrice = parseFloat(selectedVariant.price.amount);
  const comparePrice = selectedVariant.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : null;
  const isOnSale = comparePrice && comparePrice > currentPrice;

  const formattedPrice = currentPrice.toLocaleString('en-EU', {
    style: 'currency',
    currency: selectedVariant.price.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedComparePrice = comparePrice ? comparePrice.toLocaleString('en-EU', {
    style: 'currency',
    currency: selectedVariant.price.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) : null;


  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb - Show only on desktop */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/category/shop" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs uppercase tracking-wider text-foreground font-medium">{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title and price */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-heading text-foreground leading-tight">{product.title}</h1>
        <div className="flex items-center gap-4">
          {isOnSale && formattedComparePrice ? (
            <>
              <p className="text-xl font-serif italic text-muted-foreground line-through decoration-1">
                {formattedComparePrice}
              </p>
              <p className="text-2xl font-serif italic text-foreground">{formattedPrice}</p>
            </>
          ) : (
            <p className="text-2xl font-serif italic text-foreground">{formattedPrice}</p>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-border/50" />

      {/* Product Options */}
      <div className="space-y-6">
        {product.options?.map((option: any) => {
          // Skip the default "Title" option for single-variant products
          if (option.name === "Title" && option.values.includes("Default Title")) {
            return null;
          }

          return (
            <div key={option.name} className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                {option.name}
              </label>
              <Select
                value={selectedOptions[option.name]}
                onValueChange={(value) => handleOptionChange(option.name, value)}
              >
                <SelectTrigger className="w-full h-12 border-border border-2 rounded-md bg-background hover:bg-background/90 transition-colors focus:ring-1 focus:ring-foreground">
                  <SelectValue placeholder={`Select ${option.name}`} />
                </SelectTrigger>
                <SelectContent>
                  {option.values.map((value: string) => (
                    <SelectItem key={value} value={value} className="cursor-pointer">
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center gap-6">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-[3rem] justify-center border-l border-r border-border">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Button
          className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 text-sm uppercase tracking-[0.2em] rounded-none transition-all duration-300"
          onClick={handleAddToCart}
          disabled={adding || !selectedVariant}
        >
          {adding ? 'Adding to Bag...' : (selectedVariant ? 'Add to Bag' : 'Unavailable')}
        </Button>
      </div>

      {/* Product details Accordion */}
      <div className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-t border-border">
            <AccordionTrigger className="text-xs uppercase tracking-widest hover:no-underline py-4">
              Product Details
            </AccordionTrigger>
            <AccordionContent>
              <div
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                className="text-sm font-light text-muted-foreground space-y-4 leading-relaxed max-w-prose"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping" className="border-t border-border">
            <AccordionTrigger className="text-xs uppercase tracking-widest hover:no-underline py-4">
              Shipping & Returns
            </AccordionTrigger>
            <AccordionContent className="text-sm font-light text-muted-foreground leading-relaxed">
              <p>We offer complimentary shipping on all orders. Returns are accepted within 30 days of purchase for a full refund, provided the item is in its original condition.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="care" className="border-t border-b border-border">
            <AccordionTrigger className="text-xs uppercase tracking-widest hover:no-underline py-4">
              Care Instructions
            </AccordionTrigger>
            <AccordionContent className="text-sm font-light text-muted-foreground leading-relaxed">
              <p>To maintain the shine of your jewelry, avoid exposure to harsh chemicals and perfumes. Clean gently with a soft cloth.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ProductInfo;