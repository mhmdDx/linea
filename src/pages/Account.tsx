import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navigation";
import { Loader2 } from "lucide-react";

const Account = () => {
    const { user, logout, loading, isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />
            <main className="flex-1 p-6 sm:p-12 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-border pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-light text-foreground">My Account</h1>
                        <p className="text-muted-foreground mt-1">Welcome back, {user.firstName}.</p>
                    </div>
                    <Button onClick={() => { logout(); navigate("/"); }} variant="outline" className="rounded-none">
                        Log Out
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Order History */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-xl font-light text-foreground">Order History</h2>
                        {user.orders?.edges?.length > 0 ? (
                            <div className="space-y-4">
                                {user.orders.edges.map(({ node }: any) => (
                                    <div key={node.id} className="border border-border p-6 rounded-none bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                                            <div>
                                                <h3 className="font-medium text-lg text-foreground">Order #{node.orderNumber}</h3>
                                                <p className="text-sm text-muted-foreground">{new Date(node.processedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                            {(() => {
                                                let status = { label: 'Processing', color: 'bg-gray-100 text-gray-800 border-gray-200' };

                                                if (node.financialStatus === 'PENDING') {
                                                    status = { label: 'Pending Confirmation', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
                                                } else if (node.financialStatus === 'PAID') {
                                                    status = { label: 'Confirmed', color: 'bg-blue-50 text-blue-700 border-blue-200' };
                                                    if (node.fulfillmentStatus === 'FULFILLED') {
                                                        status = { label: 'Shipped', color: 'bg-green-50 text-green-700 border-green-200' };
                                                    }
                                                } else if (node.financialStatus === 'VOIDED' || node.canceledAt) {
                                                    status = { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' };
                                                }

                                                return (
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium border ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {node.lineItems.edges.map(({ node: item }: any) => (
                                                <div key={item.title} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                                                        {item.variant?.image ? (
                                                            <img
                                                                src={item.variant.image.url}
                                                                alt={item.variant.image.altText || item.title}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-border/50">
                                            <span className="text-sm font-medium">Total</span>
                                            <div className="flex items-center gap-4">
                                                <span className="font-medium">{parseFloat(node.totalPrice.amount).toLocaleString('en-IE', { style: 'currency', currency: node.totalPrice.currencyCode })}</span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={async () => {
                                                        for (const edge of node.lineItems.edges) {
                                                            const item = edge.node;
                                                            if (item.variant && item.variant.id) {
                                                                await addItem(item.variant.id, item.quantity);
                                                            }
                                                        }
                                                        navigate("/checkout");
                                                    }}
                                                >
                                                    Buy Again
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-muted/10 p-8 text-center rounded-none border border-border border-dashed">
                                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                                <Button asChild variant="link" className="mt-2 text-foreground">
                                    <a href="/">Start Shopping</a>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Account Details */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-light text-foreground">Account Details</h2>
                        <div className="bg-muted/10 p-6 rounded-none border border-border">
                            <p className="text-foreground font-medium mb-1">{user.firstName} {user.lastName}</p>
                            <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
                            {/* Address logic can be added here later */}
                            <p className="text-xs text-muted-foreground italic">Addresses can be managed at checkout.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Account;
