// src/app/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL;

const HERO_SLIDES = [
  {
    headline: ["See the", "World", "in Style"],
    sub: "Premium eyewear crafted for perfection. Starting ₹999",
    cta: "Shop Now",
    cta2: "Try Virtually",
    ctaHref: "/shop",
    cta2Href: "/try-on",
    accent: "#0EA5E9",
  },
  {
    headline: ["Summer", "Collection", "2025"],
    sub: "UV protection meets fashion. Explore our exclusive sunglasses",
    cta: "Explore Sunglasses",
    cta2: "View Deals",
    ctaHref: "/shop?category=sunglasses",
    cta2Href: "/shop",
    accent: "#F59E0B",
  },
  {
    headline: ["Blue Light", "Defenders", "Collection"],
    sub: "Work smart, protect your vision. Anti-blue light glasses from ₹799",
    cta: "Shop Now",
    cta2: "Learn More",
    ctaHref: "/shop?category=blue-light",
    cta2Href: "/",
    accent: "#8B5CF6",
  },
];

const CATEGORIES = [
  { name: "Eyeglasses",     slug: "eyeglasses",     icon: "👓", count: "2400+", bg: "from-blue-50 to-blue-100"   },
  { name: "Sunglasses",     slug: "sunglasses",     icon: "😎", count: "1800+", bg: "from-amber-50 to-amber-100" },
  { name: "Contact Lenses", slug: "contact-lenses", icon: "👁️", count: "120+",  bg: "from-teal-50 to-teal-100"   },
  { name: "Kids",           slug: "kids",           icon: "🧒", count: "600+",  bg: "from-pink-50 to-pink-100"   },
  { name: "Sports",         slug: "sports",         icon: "⚡", count: "400+",  bg: "from-green-50 to-green-100" },
  { name: "Blue Light",     slug: "blue-light",     icon: "💻", count: "800+",  bg: "from-purple-50 to-purple-100"},
];

const TRUST_BADGES = [
  { icon: "🚚", text: "Free Delivery above ₹999"  },
  { icon: "🔄", text: "14-Day Easy Returns"        },
  { icon: "💎", text: "1-Year Lens Warranty"       },
  { icon: "🛡️", text: "100% Authentic Products"   },
  { icon: "📦", text: "Same Day Dispatch"          },
];

export default function HomePage() {
  const [slide, setSlide]       = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [email, setEmail]       = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Auto slide
  useEffect(() => {
    const t = setInterval(
      () => setSlide((p) => (p + 1) % HERO_SLIDES.length),
      4500
    );
    return () => clearInterval(t);
  }, []);

  // Fetch featured products
  useEffect(() => {
    axios
      .get(`${API}/products?featured=true&limit=8`)
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div className="pt-16">

      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          minHeight: "88vh",
          background:
            "linear-gradient(135deg, #0F172A 0%, #164E63 60%, #0F172A 100%)",
        }}
      >
        {/* Glow Orbs */}
        <div
          className="absolute top-20 right-20 w-96 h-96 rounded-full
                     opacity-20 pointer-events-none transition-all duration-1000"
          style={{
            background: current.accent,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-10 left-10 w-64 h-64 rounded-full
                     opacity-10 pointer-events-none"
          style={{
            background: current.accent,
            filter: "blur(60px)",
          }}
        />

        {/* Floating Glasses */}
        <div className="absolute right-8 md:right-24 top-1/2
                        -translate-y-1/2 hidden md:block animate-float">
          <div
            style={{
              fontSize: "200px",
              opacity: 0.12,
              filter: `drop-shadow(0 0 60px ${current.accent}88)`,
            }}
          >
            👓
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5
                         rounded-full text-xs font-semibold mb-6 border"
              style={{
                background: "rgba(14,165,233,0.15)",
                color: "#0EA5E9",
                borderColor: "rgba(14,165,233,0.3)",
              }}
            >
              ⭐ India's #1 Eyewear · 10M+ Happy Customers
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-7xl font-black text-white
                         leading-none mb-5 transition-all duration-500"
              style={{ letterSpacing: "-0.03em" }}
            >
              {current.headline.map((word, i) => (
                <span
                  key={i}
                  className="block"
                  style={{ color: i === 1 ? current.accent : "white" }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              {current.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={current.ctaHref}
                className="px-8 py-4 rounded-full font-bold text-white
                           transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${current.accent}, ${current.accent}bb)`,
                  boxShadow: `0 8px 24px ${current.accent}44`,
                }}
              >
                {current.cta} →
              </Link>
              <Link
                href={current.cta2Href}
                className="px-8 py-4 rounded-full font-bold text-white
                           border transition-all hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              >
                👁️ {current.cta2}
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === slide ? "32px" : "8px",
                background:
                  i === slide
                    ? current.accent
                    : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between
                          items-center gap-4">
            {TRUST_BADGES.map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2 text-sm
                           text-slate-600 font-medium"
              >
                <span>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black
                         text-slate-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-slate-500">
            Find the perfect pair for every occasion
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3
                        lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-6
                         rounded-2xl border border-slate-100
                         hover:border-sky-200 transition-all
                         hover:-translate-y-1 bg-white"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center
                            justify-center text-3xl bg-gradient-to-br
                            ${cat.bg} group-hover:scale-110
                            transition-transform`}
              >
                {cat.icon}
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800 text-sm">
                  {cat.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {cat.count} styles
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                🔥 Trending Now
              </h2>
              <p className="text-slate-500 mt-1">
                Most loved by our customers
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:block text-sm font-bold px-5 py-2.5
                         rounded-full border-2 transition-all
                         hover:bg-slate-900 hover:text-white"
              style={{ borderColor: "#0F172A", color: "#0F172A" }}
            >
              View All →
            </Link>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3
                            lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            /* Skeleton Loading */
            <div className="grid grid-cols-2 md:grid-cols-3
                            lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden
                             border border-slate-100"
                >
                  <div className="skeleton h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-3 w-16" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-3 w-24" />
                    <div className="skeleton h-10 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile View All */}
          <div className="text-center mt-8 md:hidden">
            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded-full font-bold
                         text-white text-sm"
              style={{
                background:
                  "linear-gradient(135deg, #0EA5E9, #0284C7)",
              }}
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Virtual Try-On Banner */}
          <div
            className="relative overflow-hidden rounded-3xl
                       p-8 text-white"
            style={{
              background:
                "linear-gradient(135deg, #0C4A6E, #164E63)",
              minHeight: "200px",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "linear-gradient(135deg, #0EA5E9, transparent)",
              }}
            />
            <div
              className="absolute right-8 top-1/2 -translate-y-1/2
                         text-8xl opacity-20 pointer-events-none"
            >
              👁️
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">
                Virtual Try-On
              </h3>
              <p className="text-white/70 mb-6">
                Try 1000+ frames from home using AI
              </p>
              <Link
                href="/try-on"
                className="inline-block px-6 py-2.5 rounded-full
                           text-sm font-bold text-white border-2
                           hover:bg-white/10 transition-colors"
                style={{ borderColor: "#0EA5E9" }}
              >
                Try Now →
              </Link>
            </div>
          </div>

          {/* BOGO Banner */}
          <div
            className="relative overflow-hidden rounded-3xl
                       p-8 text-white"
            style={{
              background:
                "linear-gradient(135deg, #78350F, #92400E)",
              minHeight: "200px",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "linear-gradient(135deg, #F59E0B, transparent)",
              }}
            />
            <div
              className="absolute right-8 top-1/2 -translate-y-1/2
                         text-8xl opacity-20 pointer-events-none"
            >
              🎁
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">
                Buy 1 Get 1 FREE
              </h3>
              <p className="text-white/70 mb-6">
                On select eyeglasses. Limited time!
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2.5 rounded-full
                           text-sm font-bold text-white border-2
                           hover:bg-white/10 transition-colors"
                style={{ borderColor: "#F59E0B" }}
              >
                Grab Deal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Why LensKart?
            </h2>
            <p className="text-slate-500">
              Trusted by 10 million+ customers across India
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: "🏆",
                title: "Premium Quality",
                desc: "ISI certified lenses with UV protection",
              },
              {
                icon: "💰",
                title: "Best Prices",
                desc: "Starting at ₹999 with no hidden charges",
              },
              {
                icon: "🚀",
                title: "Fast Delivery",
                desc: "Same day dispatch, delivered in 2-3 days",
              },
              {
                icon: "🔬",
                title: "Eye Test",
                desc: "Free online & in-store eye checkup",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="text-center p-6 rounded-2xl border
                           border-slate-100 hover:border-sky-200
                           transition-all hover:-translate-y-1"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center
                              justify-center text-3xl mx-auto mb-4"
                  style={{ background: "#E0F2FE" }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <section
        className="py-16 text-white"
        style={{ background: "#0F172A" }}
      >
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-3xl font-black mb-3">
            Get Exclusive Deals
          </h2>
          <p className="text-slate-400 mb-8">
            Subscribe & save 15% on your first order
          </p>

          {subscribed ? (
            <div
              className="inline-flex items-center gap-2 px-6 py-3
                         rounded-full font-bold text-sm"
              style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}
            >
              ✅ Subscribed! Check your email.
            </div>
          ) : (
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full text-white
                           placeholder-slate-400 outline-none text-sm
                           border border-white/20 bg-white/10
                           focus:border-sky-400 transition-colors"
              />
              <button
                onClick={() => {
                  if (email.includes("@")) {
                    setSubscribed(true);
                  }
                }}
                className="px-6 py-3 rounded-full font-bold
                           text-white text-sm flex-shrink-0
                           transition-all hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #0EA5E9, #0284C7)",
                }}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
              }
