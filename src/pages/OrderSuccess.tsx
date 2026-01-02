import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navigation";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

const OrderSuccess = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-muted/10 p-12 rounded-full mb-6">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                </div>

                <h1 className="text-4xl font-light text-foreground mb-4">Thank you for your order!</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-md">
                    Your order has been placed successfully. You will receive an email confirmation shortly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="h-12 px-8 rounded-none text-base">
                        <Link to="/">Continue Shopping</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 px-8 rounded-none text-base">
                        <Link to="/account">View My Orders</Link>
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
