import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCustomerAccessToken } from "@/lib/shopify";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navigation";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await createCustomerAccessToken(email, password);

            if (data?.customerAccessToken?.accessToken) {
                await login(data.customerAccessToken.accessToken, data.customerAccessToken.expiresAt);
                toast.success("Welcome back!");
                navigate("/account");
            } else if (data?.customerUserErrors?.length) {
                toast.error(data.customerUserErrors[0].message);
            } else {
                toast.error("Invalid email or password.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("An error occurred during login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />
            <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-light text-foreground">Login</h1>
                        <p className="mt-2 text-muted-foreground">Welcome back.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-none h-12"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-sm text-foreground underline hover:no-underline">
                                    Forgot?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-none h-12"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-none text-base"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-foreground underline hover:no-underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
