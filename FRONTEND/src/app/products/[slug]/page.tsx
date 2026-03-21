// src/app/products/[slug]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const LENS_TYPES = [
  { name: "Single Vision", desc: "For distance or reading", price: 0,    icon: "👁️" },
  { name: "Progressive",   desc: "Near + far vision",      price: 1500,  icon: "🔭" },
  { name: "Bifocal",       desc: "Two focal points",       price: 800,   icon: "🔍" },
  { name: "Zero Power",    desc: "Fashion / Blue light",   price: 0,     icon: "💻" },
];

export default function ProductDetailPage() {
  const { slug }                     = useParams();
  const { addToCart }                = useCart();
  const { toggle, isWishlisted }     = useWishlist();
  const [product, setProduct]        = useState<any>(null);
  const [loading, setLoading]        = useState(true);
  const [activeImg, setActiveImg]    = useState(0);
  const [lensType, setLensType]      = useState("Single Vision");
  const [rxMode, setRxMode]          = useState<"upload" | "manual" | "saved">("upload");
  const [qty, setQty]                = useState(1);
  const [tab, setTab]                = useState<"details" | "reviews" | "shipping">("details");
  const [adding, setAdding]          = useState(false);
  const [prescription, setPrescription] = useState({
    rightSPH: "", rightCYL: "", rightAXIS: "", rightADD: "",
    leftSPH:  "", leftCYL:  "", leftAXIS:  "", leftADD:  "",
  });

  useEffect(() => {
    if (!slug) return;
    axios
      .get(`${API}/products/${slug}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div
          className="w-10 h-10 border-2 border-t-transparent
                     rounded-full animate-spin"
          style={{ borderColor: "#0EA5E9", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center
                      justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Product not found
          </h2>
          <Link
            href="/shop"
            className="inline-block mt-4 px-6 py-2.5 rounded-full
                       text-sm font-bold text-white"
            style={{ background: "#0EA5E9" }}
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const disc       = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const lensExtra  = LENS_TYPES.find((l) => l.name === lensType)?.price || 0;
  const wishlisted = isWishlisted(product.id);
  const finalPrice = (product.price + lensExtra) * qty;

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product.id, qty, lensType);
    setAdding(false);
  };

  return (
    <div className="pt-20 min-h-screen" style={{ background: "#F8FAFC" }}>

      {/* ── BREADCRUMB ───────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center
                        gap-2 text-sm text-slate-400 flex-wrap">
          <Link href="/" className="hover:text-sky-500">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-sky-500">Shop</Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category?.slug}`}
            className="hover:text-sky-500"
          >
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── IMAGE GALLERY ─────────────────────────────────── */}
          <div>
            {/* Main Image */}
            <div
              className="rounded-3xl overflow-hidden border
                         border-slate-100 bg-white mb-4 relative group"
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                aspectRatio: "1",
              }}
            >
              <div
                className="absolute inset-0 flex items-center
                            justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                }}
              >
                {product.images?.[activeImg]?.url ? (
                  <Image
                    src={product.images[activeImg].url}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-105
                               transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="text-9xl group-hover:scale-110
                               transition-transform duration-500"
                  >
                    👓
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggle(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full
                           flex items-center justify-center shadow-md
                           transition-transform hover:scale-110"
                style={{
                  background: wishlisted ? "#FEE2E2" : "white",
                }}
              >
                <svg
                  className={`w-5 h-5 ${
                    wishlisted ? "text-red-500" : "text-slate-400"
                  }`}
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12
                       20.364l7.682-7.682a4.5 4.5 0
                       00-6.364-6.364L12 7.636l-1.318-1.318a4.5
                       4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* Discount Badge */}
              {disc > 0 && (
                <div className="absolute top-4 left-4">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: "#DCFCE7", color: "#16A34A" }}
                  >
                    {disc}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {(product.images?.length > 0
                ? product.images
                : [...Array(4)]
              ).map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="rounded-xl overflow-hidden border-2
                             transition-all"
                  style={{
                    aspectRatio: "1",
                    background: "#f0f9ff",
                    borderColor:
                      activeImg === i ? "#0EA5E9" : "transparent",
                  }}
                >
                  {product.images?.[i]?.url ? (
                    <Image
                      src={product.images[i].url}
                      alt=""
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center
                                    justify-center text-3xl">
                      👓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── PRODUCT INFO ──────────────────────────────────── */}
          <div>
            {/* Brand */}
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: "#0EA5E9" }}
            >
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.avgRating || 0)
                        ? "text-amber-400"
                        : "text-gray-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902
                      0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0
                      1.371 1.24.588 1.81l-2.8 2.034a1 1 0
                      00-.364 1.118l1.07 3.292c.3.921-.755
                      1.688-1.54 1.118l-2.8-2.034a1 1 0
                      00-1.175 0l-2.8 2.034c-.784.57-1.838-.197
                      -1.539-1.118l1.07-3.292a1 1 0 00-.364
                      -1.118L2.98 8.72c-.783-.57-.38-1.81.588
                      -1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {product.avgRating?.toFixed(1)} ·{" "}
                {product._count?.reviews} reviews
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full font-bold"
                style={{ background: "#DCFCE7", color: "#16A34A" }}
              >
                In Stock ✓
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-4xl font-black"
                style={{ color: "#0EA5E9" }}
              >
                ₹{(product.price + lensExtra).toLocaleString("en-IN")}
              </span>
              <div>
                {product.originalPrice > product.price && (
                  <div className="text-slate-400 line-through text-sm">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </div>
                )}
                {disc > 0 && (
                  <div className="text-green-600 font-bold text-sm">
                    {disc}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Virtual Try-On CTA */}
            <Link
              href="/try-on"
              className="w-full py-3.5 rounded-2xl font-bold text-white
                         mb-6 flex items-center justify-center gap-3
                         transition-all hover:scale-[1.02]
                         active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #7C3AED, #4F46E5)",
                boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
              }}
            >
              <span className="text-xl">👁️</span>
              Try On Virtually — FREE
            </Link>

            {/* Lens Type */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 mb-3">
                Select Lens Type
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {LENS_TYPES.map((l) => (
                  <button
                    key={l.name}
                    onClick={() => setLensType(l.name)}
                    className="p-3 rounded-xl border-2 text-left
                               transition-all"
                    style={{
                      borderColor:
                        lensType === l.name ? "#0EA5E9" : "#E2E8F0",
                      background:
                        lensType === l.name ? "#E0F2FE" : "white",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{l.icon}</span>
                      <span className="text-sm font-bold text-slate-800">
                        {l.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{l.desc}</div>
                    <div
                      className="text-xs font-bold mt-1"
                      style={{ color: "#0EA5E9" }}
                    >
                      {l.price ? `+₹${l.price}` : "Included"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prescription */}
            <div
              className="mb-6 p-5 rounded-2xl border border-slate-100"
              style={{ background: "#F8FAFC" }}
            >
              <h3 className="font-bold text-slate-900 mb-3">
                💊 Prescription
              </h3>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-4">
                {(["upload", "manual", "saved"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setRxMode(m)}
                    className="flex-1 py-2 rounded-xl text-xs
                               font-bold capitalize transition-all"
                    style={{
                      background:
                        rxMode === m ? "#0F172A" : "white",
                      color: rxMode === m ? "white" : "#64748B",
                      border: `1px solid ${
                        rxMode === m ? "#0F172A" : "#E2E8F0"
                      }`,
                    }}
                  >
                    {m === "upload"
                      ? "📤 Upload"
                      : m === "manual"
                      ? "✏️ Manual"
                      : "💾 Saved"}
                  </button>
                ))}
              </div>

              {/* Upload Mode */}
              {rxMode === "upload" && (
                <div
                  className="border-2 border-dashed border-slate-200
                             rounded-xl p-4 text-center cursor-pointer
                             hover:border-sky-300 transition-colors"
                >
                  <div className="text-2xl mb-1">📤</div>
                  <p className="text-sm text-slate-500">
                    Drop your prescription or{" "}
                    <span className="text-sky-500 font-medium">
                      browse
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    JPG, PNG, PDF upto 5MB
                  </p>
                </div>
              )}

              {/* Manual Mode */}
              {rxMode === "manual" && (
                <div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="col-span-4 text-xs font-bold
                                    text-slate-400 grid grid-cols-4
                                    gap-2">
                      <span>SPH</span>
                      <span>CYL</span>
                      <span>AXIS</span>
                      <span>ADD</span>
                    </div>
                    {/* Right Eye */}
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-6
                                       font-bold flex-shrink-0">R</span>
                      {["rightSPH","rightCYL","rightAXIS","rightADD"].map((f) => (
                        <input
                          key={f}
                          type="number"
                          step="0.25"
                          placeholder="0.00"
                          value={(prescription as any)[f]}
                          onChange={(e) =>
                            setPrescription((p) => ({
                              ...p,
                              [f]: e.target.value,
                            }))
                          }
                          className="flex-1 px-2 py-2 rounded-lg
                                     border border-slate-200 text-sm
                                     text-center font-mono outline-none
                                     focus:border-sky-400"
                        />
                      ))}
                    </div>
                    {/* Left Eye */}
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-6
                                       font-bold flex-shrink-0">L</span>
                      {["leftSPH","leftCYL","leftAXIS","leftADD"].map((f) => (
                        <input
                          key={f}
                          type="number"
                          step="0.25"
                          placeholder="0.00"
                          value={(prescription as any)[f]}
                          onChange={(e) =>
                            setPrescription((p) => ({
                              ...p,
                              [f]: e.target.value,
                            }))
                          }
                          className="flex-1 px-2 py-2 rounded-lg
                                     border border-slate-200 text-sm
                                     text-center font-mono outline-none
                                     focus:border-sky-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Mode */}
              {rxMode === "saved" && (
                <div className="space-y-2">
                  <label
                    className="flex items-center gap-3 p-3 rounded-xl
                               bg-white border border-slate-100
                               cursor-pointer hover:border-sky-200
                               transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2
                                 flex items-center justify-center"
                      style={{ borderColor: "#0EA5E9" }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#0EA5E9" }}
                      />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-slate-800">
                        My Prescription #1
                      </div>
                      <div className="text-xs text-slate-400">
                        Saved Jan 15, 2025
                      </div>
                    </div>
                  </label>
                  <Link
                    href="/dashboard/prescriptions"
                    className="block text-xs text-sky-500 font-medium
                               text-center mt-2 hover:text-sky-700"
                  >
                    + Add New Prescription
                  </Link>
                </div>
              )}
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex gap-4 mb-6">
              <div
                className="flex items-center gap-3 px-4 py-3
                           rounded-xl border border-slate-200 bg-white"
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 rounded-full flex items-center
                             justify-center font-bold text-slate-600
                             hover:bg-slate-100 transition-colors"
                >
                  −
                </button>
                <span className="font-bold w-6 text-center text-slate-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-6 h-6 rounded-full flex items-center
                             justify-center font-bold text-slate-600
                             hover:bg-slate-100 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={adding}
                className="flex-1 py-3 rounded-xl font-bold text-white
                           transition-all hover:scale-[1.02]
                           active:scale-[0.98] disabled:opacity-70"
                style={{
                  background:
                    "linear-gradient(135deg, #0EA5E9, #0284C7)",
                  boxShadow: "0 8px 24px rgba(14,165,233,0.3)",
                }}
              >
                {adding
                  ? "Adding..."
                  : `🛒 Add to Cart · ₹${finalPrice.toLocaleString("en-IN")}`}
              </button>
            </div>

            {/* Delivery Info */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl mb-6"
              style={{ background: "#F0FDF4" }}
            >
              <span className="text-xl">🚚</span>
              <div>
                <p className="text-sm font-bold text-green-800">
                  Free Delivery
                </p>
                <p className="text-xs text-green-600">
                  Estimated delivery in 3-5 business days
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex gap-4 mb-4">
                {(["details", "reviews", "shipping"] as const).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className="text-sm font-bold capitalize pb-2
                                 border-b-2 transition-all"
                      style={{
                        borderColor:
                          tab === t ? "#0EA5E9" : "transparent",
                        color: tab === t ? "#0EA5E9" : "#64748B",
                      }}
                    >
                      {t}
                    </button>
                  )
                )}
              </div>

              {/* Details Tab */}
              {tab === "details" && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Brand",    product.brand],
                    ["Category", product.category?.name],
                    ["Shape",    product.frameShape],
                    ["Material", product.frameMaterial],
                    ["Gender",   product.gender],
                    ["SKU",      product.sku],
                  ].map(([k, v]) =>
                    v ? (
                      <div
                        key={String(k)}
                        className="flex justify-between py-2
                                   border-b border-slate-50"
                      >
                        <span className="text-sm text-slate-500">
                          {k}
                        </span>
                        <span className="text-sm font-medium
                                         text-slate-800">
                          {v}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {tab === "reviews" && (
                <div className="space-y-4">
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((r: any) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-xl bg-slate-50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-8 h-8 rounded-full flex
                                       items-center justify-center
                                       text-white text-xs font-bold"
                            style={{ background: "#0EA5E9" }}
                          >
                            {r.user.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-bold
                                            text-slate-800">
                              {r.user.name}
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <svg
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= r.rating
                                      ? "text-amber-400"
                                      : "text-gray-200"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921
                                    1.603-.921 1.902 0l1.07 3.292a1
                                    1 0 00.95.69h3.462c.969 0 1.371
                                    1.24.588 1.81l-2.8 2.034a1 1 0
                                    00-.364 1.118l1.07 3.292c.3.921
                                    -.755 1.688-1.54 1.118l-2.8
                                    -2.034a1 1 0 00-1.175 0l-2.8
                                    2.034c-.784.57-1.838-.197-1.539
                                    -1.118l1.07-3.292a1 1 0 00-.364
                                    -1.118L2.98 8.72c-.783-.57-.38
                                    -1.81.588-1.81h3.461a1 1 0
                                    00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        {r.title && (
                          <p className="text-sm font-bold
                                        text-slate-800 mb-1">
                            {r.title}
                          </p>
                        )}
                        {r.body && (
                          <p className="text-sm text-slate-600">
                            {r.body}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              )}

              {/* Shipping Tab */}
              {tab === "shipping" && (
                <div className="space-y-3">
                  {[
                    { icon: "🚚", text: "Free delivery in 3–5 business days" },
                    { icon: "⚡", text: "Express delivery available (₹99)" },
                    { icon: "🔄", text: "14-day hassle-free returns" },
                    { icon: "💎", text: "1-year lens warranty included" },
                    { icon: "📦", text: "Eco-friendly packaging" },
                  ].map((i) => (
                    <div
                      key={i.text}
                      className="flex items-center gap-3 text-sm
                                 text-slate-700"
                    >
                      <span className="text-lg">{i.icon}</span>
                      {i.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

