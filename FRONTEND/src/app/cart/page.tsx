// src/app/cart/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

type Step = "cart" | "address" | "payment";

interface Address {
  name:    string;
  phone:   string;
  line1:   string;
  line2:   string;
  city:    string;
  state:   string;
  pincode: string;
}

export default function CartPage() {
  const { cart, cartTotal, updateQty, removeItem, clearCart } = useCart();
  const { token, user } = useAuth();
  const router          = useRouter();

  const [step, setStep]           = useState<Step>("cart");
  const [couponCode, setCoupon]   = useState("");
  const [discount, setDiscount]   = useState(0);
  const [couponData, setCouponData] = useState<any>(null);
  const [payMethod, setPayMethod] = useState("RAZORPAY");
  const [placing, setPlacing]     = useState(false);
  const [address, setAddress]     = useState<Address>({
    name:    user?.name || "",
    phone:   "",
    line1:   "",
    line2:   "",
    city:    "",
    state:   "",
    pincode: "",
  });

  const shipping = cartTotal - discount > 999 ? 0 : 99;
  const total    = cartTotal - discount + shipping;

  const steps: Step[] = ["cart", "address", "payment"];

  // ── VALIDATE COUPON ───────────────────────────────────────────
  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await axios.post(
        `${API}/coupons/validate`,
        { code: couponCode, orderValue: cartTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscount(data.discount);
      setCouponData(data.coupon);
      toast.success(`✅ Coupon applied! You save ₹${data.discount}`);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Invalid coupon");
    }
  };

  // ── PLACE ORDER ───────────────────────────────────────────────
  const placeOrder = async () => {
    if (!token) { router.push("/auth"); return; }
    setPlacing(true);
    try {
      const { data } = await axios.post(
        `${API}/orders`,
        {
          items: cart.map((i) => ({
            productId:  i.productId,
            quantity:   i.quantity,
            lensType:   i.lensType,
          })),
          addressId:    "temp",
          paymentMethod: payMethod,
          couponCode:   couponData?.code,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (payMethod === "RAZORPAY" && data.razorpayOrder) {
        const rzp = new (window as any).Razorpay({
          key:      data.keyId,
          amount:   data.razorpayOrder.amount,
          currency: "INR",
          name:     "LensKart",
          order_id: data.razorpayOrder.id,
          prefill: {
            name:  user?.name,
            email: user?.email,
          },
          theme: { color: "#0EA5E9" },
          handler: async (response: any) => {
            await axios.post(
              `${API}/orders/verify-payment`,
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("🎉 Order placed successfully!");
            clearCart();
            router.push("/dashboard/orders");
          },
        });
        rzp.open();
      } else {
        toast.success("🎉 Order placed! COD confirmed.");
        clearCart();
        router.push("/dashboard/orders");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  // ── STEP HANDLER ──────────────────────────────────────────────
  const handleNext = () => {
    if (step === "cart") {
      if (cart.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }
      setStep("address");
    } else if (step === "address") {
      if (!address.name || !address.phone || !address.line1 ||
          !address.city || !address.state || !address.pincode) {
        toast.error("Please fill all required fields");
        return;
      }
      setStep("payment");
    } else {
      placeOrder();
    }
  };

  return (
    <div className="pt-20 min-h-screen" style={{ background: "#F8FAFC" }}>

      {/* Razorpay Script */}
      <script
        src="https://checkout.razorpay.com/v1/checkout.js"
        async
      />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── PAGE TITLE ───────────────────────────────────────── */}
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          {step === "cart"
            ? "🛒 Your Cart"
            : step === "address"
            ? "📍 Delivery Address"
            : "💳 Payment"}
        </h1>

        {/* ── STEPS INDICATOR ─────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 text-sm font-bold"
                style={{
                  color:
                    step === s
                      ? "#0EA5E9"
                      : i < steps.indexOf(step)
                      ? "#10B981"
                      : "#64748B",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center
                             justify-center font-black text-sm text-white"
                  style={{
                    background:
                      step === s
                        ? "#0EA5E9"
                        : i < steps.indexOf(step)
                        ? "#10B981"
                        : "#E2E8F0",
                  }}
                >
                  {i < steps.indexOf(step) ? "✓" : i + 1}
                </div>
                <span className="capitalize hidden sm:block">{s}</span>
              </div>
              {i < 2 && (
                <div
                  className="h-0.5 w-8 hidden sm:block"
                  style={{
                    background:
                      i < steps.indexOf(step) ? "#10B981" : "#E2E8F0",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* ── STEP 1: CART ──────────────────────────────────── */}
            {step === "cart" && (
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div
                    className="text-center py-20 bg-white rounded-2xl
                               border border-slate-100"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Add some eyewear to get started!
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block px-6 py-2.5 rounded-full
                                 text-sm font-bold text-white"
                      style={{ background: "#0EA5E9" }}
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-5 border
                                 border-slate-100 flex gap-5 items-center"
                      style={{
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                      }}
                    >
                      {/* Product Image */}
                      <div
                        className="w-24 h-24 rounded-xl flex items-center
                                   justify-center flex-shrink-0 overflow-hidden"
                        style={{ background: "#f0f9ff" }}
                      >
                        {item.product.images?.[0]?.url ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-5xl">👓</span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 font-medium mb-0.5">
                          {item.product.brand}
                        </p>
                        <h3 className="font-bold text-slate-900 mb-1
                                       truncate">
                          {item.product.name}
                        </h3>
                        {item.lensType && (
                          <p className="text-xs text-slate-400 mb-2">
                            Lens: {item.lensType}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          {/* Qty Controls */}
                          <div
                            className="flex items-center gap-2 px-3 py-1.5
                                       rounded-xl border border-slate-200"
                          >
                            <button
                              onClick={() =>
                                updateQty(item.id, item.quantity - 1)
                              }
                              className="text-slate-500 hover:text-slate-900
                                         font-bold w-5 text-center"
                            >
                              −
                            </button>
                            <span className="font-bold text-sm w-5
                                             text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQty(item.id, item.quantity + 1)
                              }
                              className="text-slate-500 hover:text-slate-900
                                         font-bold w-5 text-center"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-400
                                       hover:text-red-600 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <div className="font-black text-slate-900 text-lg">
                          ₹{(item.product.price * item.quantity)
                            .toLocaleString("en-IN")}
                        </div>
                        <div className="text-xs text-slate-400">
                          ₹{item.product.price.toLocaleString("en-IN")} each
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── STEP 2: ADDRESS ───────────────────────────────── */}
            {step === "address" && (
              <div
                className="bg-white rounded-2xl p-6 border border-slate-100"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <h3 className="font-bold text-slate-900 mb-6">
                  Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name",    label: "Full Name *",              span: true  },
                    { key: "phone",   label: "Phone Number *",           span: false },
                    { key: "pincode", label: "Pincode *",                span: false },
                    { key: "line1",   label: "Address Line 1 *",         span: true  },
                    { key: "line2",   label: "Address Line 2 (Optional)", span: true  },
                    { key: "city",    label: "City *",                   span: false },
                    { key: "state",   label: "State *",                  span: false },
                  ].map(({ key, label, span }) => (
                    <div key={key} className={span ? "sm:col-span-2" : ""}>
                      <label
                        className="text-xs font-bold text-slate-400
                                   uppercase tracking-wider mb-2 block"
                      >
                        {label}
                      </label>
                      <input
                        value={(address as any)[key]}
                        onChange={(e) =>
                          setAddress((a) => ({
                            ...a,
                            [key]: e.target.value,
                          }))
                        }
                        placeholder={`Enter ${label.replace(" *", "")}`}
                        className="input-base"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 3: PAYMENT ───────────────────────────────── */}
            {step === "payment" && (
              <div
                className="bg-white rounded-2xl p-6 border border-slate-100"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <h3 className="font-bold text-slate-900 mb-6">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      id:  "RAZORPAY",
                      label: "💳 Card / UPI / Netbanking",
                      sub:   "Powered by Razorpay — 100% secure",
                    },
                    {
                      id:  "UPI",
                      label: "📱 UPI Directly",
                      sub:   "GPay, PhonePe, Paytm, BHIM",
                    },
                    {
                      id:  "COD",
                      label: "💵 Cash on Delivery",
                      sub:   "Pay when your order arrives",
                    },
                  ].map((m) => (
                    <label
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className="flex items-center gap-4 p-4 rounded-xl
                                 border-2 cursor-pointer transition-all"
                      style={{
                        borderColor:
                          payMethod === m.id ? "#0EA5E9" : "#E2E8F0",
                        background:
                          payMethod === m.id ? "#E0F2FE" : "white",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2
                                   flex-shrink-0 flex items-center
                                   justify-center"
                        style={{
                          borderColor:
                            payMethod === m.id ? "#0EA5E9" : "#E2E8F0",
                        }}
                      >
                        {payMethod === m.id && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: "#0EA5E9" }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          {m.label}
                        </div>
                        <div className="text-xs text-slate-400">
                          {m.sub}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── ORDER SUMMARY ────────────────────────────────────── */}
          <div>
            <div
              className="bg-white rounded-2xl p-6 border border-slate-100
                         sticky top-24"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <h3 className="font-black text-slate-900 mb-5">
                Order Summary
              </h3>

              {/* Cart Items Preview */}
              {cart.slice(0, 2).map((i) => (
                <div
                  key={i.id}
                  className="flex gap-3 mb-3 pb-3 border-b
                             border-slate-50 items-center"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center
                               justify-center text-2xl flex-shrink-0"
                    style={{ background: "#f0f9ff" }}
                  >
                    👓
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800
                                    truncate">
                      {i.product.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      Qty: {i.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-900
                                  flex-shrink-0">
                    ₹{(i.product.price * i.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
              {cart.length > 2 && (
                <p className="text-xs text-slate-400 mb-3">
                  +{cart.length - 2} more items
                </p>
              )}

              {/* Coupon Input */}
              {step === "cart" && (
                <div className="flex gap-2 mb-5">
                  <input
                    value={couponCode}
                    onChange={(e) => setCoupon(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && validateCoupon()}
                    placeholder="Coupon code"
                    className="flex-1 input-base py-2.5 text-sm"
                  />
                  <button
                    onClick={validateCoupon}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold
                               text-white flex-shrink-0"
                    style={{ background: "#0EA5E9" }}
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Coupon Applied */}
              {couponData && (
                <div
                  className="text-xs font-bold mb-4 flex items-center
                             gap-1.5 p-3 rounded-xl"
                  style={{ background: "#DCFCE7", color: "#16A34A" }}
                >
                  ✅ {couponData.code} applied — You save ₹{discount}
                </div>
              )}

              {/* Price Breakdown */}
              <div
                className="space-y-3 border-t border-slate-100
                           pt-4 mb-5"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600 font-medium">
                      −₹{discount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span
                    className={`font-medium ${
                      shipping === 0 ? "text-green-600" : ""
                    }`}
                  >
                    {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
                  </span>
                </div>
                <div
                  className="flex justify-between text-lg font-black
                             border-t border-slate-100 pt-3"
                >
                  <span>Total</span>
                  <span style={{ color: "#0EA5E9" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={placing}
                className="w-full py-4 rounded-2xl font-black text-white
                           transition-all hover:scale-[1.02]
                           active:scale-[0.98] disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, #0EA5E9, #0284C7)",
                  boxShadow: "0 8px 24px rgba(14,165,233,0.3)",
                }}
              >
                {placing
                  ? "Processing..."
                  : step === "cart"
                  ? "Proceed to Address →"
                  : step === "address"
                  ? "Continue to Payment →"
                  : "🔒 Place Order Securely"}
              </button>

              {/* Security Badge */}
              {step === "payment" && (
                <p className="text-center text-xs text-slate-400 mt-3
                              flex items-center justify-center gap-1">
                  🔒 Secured by Razorpay · 256-bit SSL
                </p>
              )}

              {/* Free Shipping Note */}
              {shipping > 0 && (
                <p className="text-center text-xs text-slate-400 mt-3">
                  Add ₹{(999 - (cartTotal - discount)).toLocaleString("en-IN")} more for FREE shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

