import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

interface ShoppingBagProps {
  onViewFavorites?: () => void;
}

const ShoppingBag = ({ onViewFavorites }: ShoppingBagProps) => {
  const { cart, cartOpen, setCartOpen, updateItem, removeItem, checkoutUrl } = useCart();

  if (!cartOpen) return null;

  const cartItems = cart?.lines?.edges?.map((edge: any) => edge.node) || [];
  const subtotal = cart?.cost?.totalAmount?.amount ? parseFloat(cart.cost.totalAmount.amount) : 0;
  const currencyCode = cart?.cost?.totalAmount?.currencyCode || 'EUR';

  return (
    <div className="fixed inset-0 z-50 h-screen">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 h-screen"
        onClick={() => setCartOpen(false)}
      />

      {/* Off-canvas panel */}
      <div className="absolute right-0 top-0 h-screen w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-light text-foreground">Shopping Bag</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6">
          {/* Mobile favorites toggle - only show on mobile */}


          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center">
                Your shopping bag is empty.<br />
                Continue shopping to add items to your bag.
              </p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="flex-1 overflow-y-auto space-y-6 mb-6">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted/10 rounded-lg overflow-hidden relative">
                      {item.merchandise.product.images.edges[0] && (
                        <img
                          src={item.merchandise.product.images.edges[0].node.url}
                          alt={item.merchandise.product.images.edges[0].node.altText || item.merchandise.product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-light text-muted-foreground">{item.merchandise.title === 'Default Title' ? '' : item.merchandise.title}</p>
                          <h3 className="text-sm font-medium text-foreground">{item.merchandise.product.title}</h3>
                        </div>
                        <p className="text-sm font-light text-foreground">
                          {parseFloat(item.merchandise.price.amount).toLocaleString('en-EU', { style: 'currency', currency: item.merchandise.price.currencyCode })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateItem(item.id, item.quantity - 1);
                              } else {
                                removeItem(item.id);
                              }
                            }}
                            className="p-2 hover:bg-muted/50 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-2 text-sm font-light min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-muted/50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal and checkout */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-foreground">Subtotal</span>
                  <span className="text-sm font-medium text-foreground">
                    {subtotal.toLocaleString('en-EU', { style: 'currency', currency: currencyCode })}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>

                {checkoutUrl && (
                  <Button
                    asChild
                    className="w-full rounded-none mb-9"
                    size="lg"
                  >
                    <Link to="/checkout" onClick={() => setCartOpen(false)}>
                      Proceed to Checkout
                    </Link>
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full rounded-none"
                  size="lg"
                  onClick={() => setCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingBag;