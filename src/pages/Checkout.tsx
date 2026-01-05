import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CheckoutHeader from "../components/header/CheckoutHeader";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("EG");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("Alexandria");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [emailOffers, setEmailOffers] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ name: string, total: string, method: string } | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Derived state from Cart Context
  const cartItems = cart?.lines?.edges?.map((edge: any) => edge.node) || [];
  const subtotal = cart?.cost?.totalAmount?.amount ? parseFloat(cart.cost.totalAmount.amount) : 0;
  const currencyCode = cart?.cost?.totalAmount?.currencyCode || 'EGP';
  // Shipping Logic
  const getShippingCost = (gov: string) => {
    const upperEgypt = ["Aswan", "Luxor", "Qena", "Sohag", "Asyut", "Minya", "Beni Suef", "Faiyum", "Red Sea"];
    if (gov === "Alexandria") return 70;
    if (upperEgypt.includes(gov)) return 120;
    return 80;
  };

  const shipping = getShippingCost(governorate);
  const total = subtotal + shipping;

  const handleCompleteOrder = async () => {
    // Validation
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!lastName || !address || !city || !phone) {
      toast.error("Please fill in all required delivery fields");
      return;
    }

    if (phone.length < 11) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!cart?.id) {
      toast.error("Cart not found. Please try again.");
      return;
    }

    if (paymentMethod === 'instapay' || paymentMethod === 'wallet') {
      toast.info("Please complete the transfer using the details provided.");
    }

    setIsProcessing(true);

    try {
      // Prepare line items for the order
      const lineItems = cartItems.map((item: any) => ({
        variantId: item.merchandise.id,
        quantity: item.quantity,
        price: item.merchandise.price.amount,
        title: item.merchandise.product.title
      }));

      // Prepare shipping address
      const shippingAddress = {
        firstName: firstName || "",
        lastName: lastName,
        address1: address,
        address2: apartment,
        city: city,
        province: governorate,
        zip: postalCode || "",
        country: country,
        phone: phone || ""
      };

      const orderPayload = {
        email: email.trim(),
        lineItems,
        shippingAddress,
        paymentMethod,
        financialStatus: 'pending',
        shippingCost: shipping,
        customerId: user?.id // Pass the customer ID if logged in
      };

      // Call the serverless API endpoint to create the order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Details:', JSON.stringify(errorData, null, 2));
        throw new Error(errorData.error || errorData.details?.message || JSON.stringify(errorData) || "Failed to create order");
      }

      const orderResult = await response.json();

      if (orderResult.success) {
        toast.success(`Order ${orderResult.orderName} placed successfully!`);
        clearCart();
        setCompletedOrder({
          name: orderResult.orderName,
          total: total.toFixed(2),
          method: paymentMethod
        });
        window.scrollTo(0, 0);
      } else {
        throw new Error(orderResult.message || "Failed to create order");
      }

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "There was an issue placing your order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <CheckoutHeader />
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
          <div className="bg-green-50/50 border border-green-100 rounded-lg p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-600"><path d="M20 6 9 17l-5-5" /></svg>
            </div>

            <h2 className="text-3xl font-serif text-black">Order Placed Successfully</h2>
            <p className="text-gray-500">Thank you! Your order <span className="font-bold text-black">{completedOrder.name}</span> has been received.</p>

            <div className="bg-white border border-gray-200 rounded-md p-6 max-w-md mx-auto">
              <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-medium">Amount Due</p>
              <p className="text-3xl font-semibold text-black mb-6">{currencyCode} {completedOrder.total}</p>

              {(completedOrder.method === 'instapay' || completedOrder.method === 'wallet') && (
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div>
                    <h3 className="text-sm font-medium text-black mb-3">
                      Payment Instructions ({completedOrder.method === 'instapay' ? 'InstaPay' : 'Wallet'})
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">Please transfer to:</p>

                    {completedOrder.method === 'instapay' ? (
                      <div
                        className="bg-gray-50 border border-gray-200 p-3 rounded text-center inline-flex items-center gap-3 cursor-pointer hover:border-black transition-colors group mx-auto"
                        onClick={() => {
                          navigator.clipboard.writeText('kirolushany@instapay');
                          toast.success('Address copied to clipboard!');
                        }}
                      >
                        <p className="font-mono text-sm font-medium">kirolushany@instapay</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy text-gray-400 group-hover:text-black"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                      </div>
                    ) : (
                      <div
                        className="bg-gray-50 border border-gray-200 p-3 rounded text-center inline-flex items-center gap-3 cursor-pointer hover:border-black transition-colors group mx-auto"
                        onClick={() => {
                          navigator.clipboard.writeText('01220329007');
                          toast.success('Number copied to clipboard!');
                        }}
                      >
                        <p className="font-mono text-sm font-medium">0122 032 9007</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy text-gray-400 group-hover:text-black"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      After transferring, please send proof of payment for Order <span className="font-bold text-black">{completedOrder.name}</span> via WhatsApp:
                    </p>
                    <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                      <a
                        href={`https://wa.me/201220329007?text=Hello,%20I%20have%20paid%20for%20Order%20${completedOrder.name}.%20Here%20is%20the%20receipt.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                        Send Receipt on WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {completedOrder.method === 'cod' && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    We have sent a confirmation email to <span className="font-medium">{email}</span>.
                  </p>
                  <Button asChild variant="outline" className="mt-6 w-full text-black border-black hover:bg-black hover:text-white">
                    <Link to="/">Continue Shopping</Link>
                  </Button>
                </div>
              )}
              {(completedOrder.method === 'instapay' || completedOrder.method === 'wallet') && (
                <Button asChild variant="ghost" className="mt-4 text-gray-500 hover:text-black">
                  <Link to="/">Return to Home</Link>
                </Button>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <CheckoutHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-light mb-4 text-black">Your cart is empty</h2>
          <Button asChild variant="outline" className="rounded-md border-black text-black hover:bg-black hover:text-white">
            <a href="/">Continue Shopping</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#333]">
      <CheckoutHeader />

      <main className="">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr]">

            {/* Left Column - Forms */}
            <div className="order-2 lg:order-1 px-4 sm:px-6 lg:pl-8 lg:pr-12 py-8 lg:py-12 space-y-8">

              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-xs mb-8 text-gray-500">
                <span className="text-black font-medium">Cart</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-black font-medium">Information</span>
                <ChevronRight className="h-3 w-3" />
                <span>Shipping</span>
                <ChevronRight className="h-3 w-3" />
                <span>Payment</span>
              </nav>

              {/* Contact Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium tracking-tight text-black">Contact</h2>
                  <a href="/login" className="text-sm text-black underline hover:text-gray-600 transition-colors">
                    Log in
                  </a>
                </div>
                <div className="space-y-4">
                  <FloatingLabelInput
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                </div>
              </section>

              {/* Delivery Section */}
              <section>
                <h2 className="text-lg font-medium tracking-tight text-black mb-4">Delivery</h2>
                <div className="space-y-3">


                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <FloatingLabelInput
                      type="text"
                      label="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <FloatingLabelInput
                      type="text"
                      label="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  {/* Address */}
                  <FloatingLabelInput
                    type="text"
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  {/* Apartment */}
                  <FloatingLabelInput
                    type="text"
                    label="Apartment, suite, etc. (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />

                  {/* City, Governorate, Postal Code */}
                  <div className="grid grid-cols-3 gap-3">
                    <FloatingLabelInput
                      type="text"
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <div className="relative">
                      <label className="absolute top-1.5 left-3 text-[11px] font-medium text-gray-500 z-10 pointer-events-none">Governorate</label>
                      <select
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        className="w-full h-[50px] px-3 pt-4 pb-1 rounded-md border border-gray-300 bg-white focus:border-black focus:ring-black/5 outline-none appearance-none text-sm shadow-sm transition-all"
                      >
                        <option value="Alexandria">Alexandria</option>
                        <option value="Cairo">Cairo</option>
                        <option value="Giza">Giza</option>
                        <option value="Qalyubia">Qalyubia</option>
                        <option value="Dakahlia">Dakahlia</option>
                        <option value="Sharqia">Sharqia</option>
                        <option value="Gharbia">Gharbia</option>
                        <option value="Kafr El Sheikh">Kafr El Sheikh</option>
                        <option value="Beheira">Beheira</option>
                        <option value="Damietta">Damietta</option>
                        <option value="Port Said">Port Said</option>
                        <option value="Ismailia">Ismailia</option>
                        <option value="Suez">Suez</option>
                        <option value="Monufia">Monufia</option>
                        <option value="Faiyum">Faiyum</option>
                        <option value="Beni Suef">Beni Suef</option>
                        <option value="Minya">Minya</option>
                        <option value="Asyut">Asyut</option>
                        <option value="Sohag">Sohag</option>
                        <option value="Qena">Qena</option>
                        <option value="Luxor">Luxor</option>
                        <option value="Aswan">Aswan</option>
                        <option value="Red Sea">Red Sea</option>
                        <option value="New Valley">New Valley</option>
                        <option value="Matrouh">Matrouh</option>
                        <option value="North Sinai">North Sinai</option>
                        <option value="South Sinai">South Sinai</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/3 pointer-events-none">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    <FloatingLabelInput
                      type="text"
                      label="Postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <FloatingLabelInput
                      type="tel"
                      label="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-3"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 group relative cursor-help z-10">
                      <span className="text-gray-400 text-xs border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center hover:border-black hover:text-black transition-colors">?</span>
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black text-white text-xs rounded shadow-lg hidden group-hover:block z-50">
                        In case we need to contact you about your order
                      </div>
                    </div>
                  </div>

                  {/* Save Info */}
                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded-sm border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <label htmlFor="saveInfo" className="text-sm text-gray-600 cursor-pointer select-none">
                      Save this information for next time
                    </label>
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section>
                <h2 className="text-lg font-medium tracking-tight text-black mb-4">Shipping method</h2>
                <div className="border border-black bg-blue-50/10 rounded-md p-4 flex items-center justify-between cursor-pointer ring-1 ring-black/5 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border border-black flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-black" />
                    </div>
                    <span className="text-sm font-medium text-black">Standard</span>
                  </div>
                  <span className="text-sm font-medium text-black">{currencyCode} {shipping.toFixed(2)}</span>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-lg font-medium tracking-tight text-black mb-2">Payment</h2>
                <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>

                <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm space-y-0">

                  {/* Cash on Delivery (COD) */}
                  <div className={`p-4 flex items-center justify-between border-b border-gray-200 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-blue-50/10' : 'bg-white'}`} onClick={() => setPaymentMethod('cod')}>
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                        {paymentMethod === 'cod' && <div className="h-2 w-2 rounded-full bg-black" />}
                      </div>
                      <span className="text-sm font-medium text-black">Cash on Delivery (COD)</span>
                    </div>
                  </div>

                  {/* COD Content */}
                  {paymentMethod === 'cod' && (
                    <div className="bg-gray-50 p-6 text-center border-b border-gray-200">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <p className="text-sm text-gray-600 max-w-xs mx-auto">Pay with cash upon delivery.</p>
                      </div>
                    </div>
                  )}

                  {/* Instapay - التحويل الفوري */}
                  <div className={`p-4 flex items-center justify-between border-b border-gray-200 cursor-pointer transition-colors ${paymentMethod === 'instapay' ? 'bg-blue-50/10' : 'bg-white'}`} onClick={() => setPaymentMethod('instapay')}>
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'instapay' ? 'border-black' : 'border-gray-300'}`}>
                        {paymentMethod === 'instapay' && <div className="h-2 w-2 rounded-full bg-black" />}
                      </div>
                      <span className="text-sm font-medium text-black">Instapay - التحويل الفوري</span>
                    </div>
                  </div>

                  {/* Instapay Content */}
                  {paymentMethod === 'instapay' && (
                    <div className="bg-gray-50 p-6 border-b border-gray-200">
                      <div className="space-y-4 text-center">
                        <p className="text-sm text-gray-900 font-medium">
                          Payment Instructions
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Please transfer the total amount to the following InstaPay address:
                        </p>
                        <div
                          className="bg-white border border-gray-200 p-3 rounded text-center inline-flex items-center gap-3 cursor-pointer hover:border-black transition-colors group"
                          onClick={() => {
                            navigator.clipboard.writeText('kirolushany@instapay');
                            toast.success('Address copied to clipboard!');
                          }}
                        >
                          <p className="font-mono text-sm font-medium">kirolushany@instapay</p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy text-gray-400 group-hover:text-black"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                        </div>

                        <div className="pt-2">
                          <p className="text-xs text-black font-medium mb-1">
                            After transfer, please send screenshot to:
                          </p>
                          <a
                            href="https://wa.me/201220329007"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                            0122 032 9007
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Orange Cash / Vodafone Cash */}
                  <div className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'wallet' ? 'bg-blue-50/10' : 'bg-white'}`} onClick={() => setPaymentMethod('wallet')}>
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-black' : 'border-gray-300'}`}>
                        {paymentMethod === 'wallet' && <div className="h-2 w-2 rounded-full bg-black" />}
                      </div>
                      <span className="text-sm font-medium text-black">Orange Cash / Vodafone Cash</span>
                    </div>
                  </div>

                  {/* Wallet Content */}
                  {paymentMethod === 'wallet' && (
                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                      <div className="space-y-4 text-center">
                        <p className="text-sm text-gray-900 font-medium">
                          Payment Instructions
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Please transfer the total amount to the following wallet number:
                        </p>
                        <div
                          className="bg-white border border-gray-200 p-3 rounded text-center inline-flex items-center gap-3 cursor-pointer hover:border-black transition-colors group"
                          onClick={() => {
                            navigator.clipboard.writeText('01220329007');
                            toast.success('Number copied to clipboard!');
                          }}
                        >
                          <p className="font-mono text-sm font-medium">0122 032 9007</p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy text-gray-400 group-hover:text-black"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                        </div>

                        <div className="pt-2">
                          <p className="text-xs text-black font-medium mb-1">
                            After transfer, please send screenshot to:
                          </p>
                          <a
                            href="https://wa.me/201220329007"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                            0122 032 9007
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </section>

              {/* Billing Address */}
              <section>
                <h2 className="text-lg font-medium tracking-tight text-black mb-4">Billing address</h2>
                <div className="space-y-0 border border-gray-200 rounded-md overflow-hidden shadow-sm">
                  <div className="p-4 flex items-center gap-3 border-b border-gray-200 bg-white">
                    <div className="h-4 w-4 rounded-full border border-black flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-black" />
                    </div>
                    <span className="text-sm font-medium text-black">Same as shipping address</span>
                  </div>
                  <div className="p-4 flex items-center gap-3 bg-gray-50 opacity-60">
                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                    <span className="text-sm font-medium text-gray-600">Use a different billing address</span>
                  </div>
                </div>
              </section>

              {/* Complete Order Button */}
              <Button
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="w-full h-14 text-lg font-medium bg-black hover:bg-black/90 text-white rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isProcessing ? "Processing..." : "Complete Order"}
              </Button>
            </div>

            {/* Right Column - Order Summary - Sticky */}
            <div className="order-1 lg:order-2 bg-[#fafafa] border-l border-gray-200">
              <div className="sticky top-0 h-full">
                <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
                  {/* Products */}
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative h-16 w-16 border border-gray-200 rounded-md bg-white flex-shrink-0">
                          {item.merchandise.product.images.edges[0] && (
                            <img
                              src={item.merchandise.product.images.edges[0].node.url}
                              alt={item.merchandise.product.title}
                              className="h-full w-full object-cover p-1 rounded-md"
                            />
                          )}
                          <div className="absolute -top-2 -right-2 h-5 w-5 bg-gray-500 text-white text-[10px] font-medium flex items-center justify-center rounded-full shadow-sm">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.merchandise.product.title}
                          </h4>
                          {item.merchandise.title !== "Default Title" && (
                            <p className="text-xs text-gray-500 mt-0.5">{item.merchandise.title}</p>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {currencyCode} {parseFloat(item.merchandise.price.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">{currencyCode} {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-sm font-medium">{currencyCode} {shipping.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-6 flex justify-between items-end">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-500">{currencyCode}</span>
                      <span className="text-2xl font-semibold text-gray-900">{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>
      <div className="lg:hidden">
        {/* Simplified mobile footer or none */}
        <div className="py-8 text-center text-xs text-gray-400">
          © 2024 Linea Jewelry Inc.
        </div>
      </div>
    </div>
  );
};

export default Checkout;