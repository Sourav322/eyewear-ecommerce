import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const theme = {
  navy: "#0F172A",
  teal: "#0EA5E9",
  tealDark: "#0284C7",
  tealLight: "#E0F2FE",
  accent: "#F59E0B",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#64748B",
  success: "#10B981",
  danger: "#EF4444",
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Titan Aviator Pro", brand: "Titan", price: 2499, originalPrice: 3999, category: "Eyeglasses", gender: "Men", shape: "Aviator", color: "#C0A882", colorName: "Gold", rating: 4.5, reviews: 234, tag: "Bestseller", emoji: "🥇" },
  { id: 2, name: "Vincent Chase Retro", brand: "Vincent Chase", price: 1299, originalPrice: 2199, category: "Sunglasses", gender: "Unisex", shape: "Wayfarer", color: "#1a1a1a", colorName: "Matte Black", rating: 4.3, reviews: 187, tag: "New", emoji: "✨" },
  { id: 3, name: "Lenskart Air Classic", brand: "Lenskart", price: 1799, originalPrice: 2999, category: "Eyeglasses", gender: "Women", shape: "Round", color: "#C41E3A", colorName: "Cherry Red", rating: 4.7, reviews: 412, tag: "Trending", emoji: "🔥" },
  { id: 4, name: "John Jacobs Sport", brand: "John Jacobs", price: 3299, originalPrice: 4999, category: "Sports", gender: "Men", shape: "Wrap", color: "#004F9E", colorName: "Navy Blue", rating: 4.4, reviews: 98, tag: "Premium", emoji: "💎" },
  { id: 5, name: "Fossil Cat Eye", brand: "Fossil", price: 2199, originalPrice: 3599, category: "Eyeglasses", gender: "Women", shape: "Cat Eye", color: "#8B4513", colorName: "Tortoise", rating: 4.6, reviews: 321, tag: "Trending", emoji: "🔥" },
  { id: 6, name: "Ray-Ban Clubmaster", brand: "Ray-Ban", price: 5999, originalPrice: 7999, category: "Sunglasses", gender: "Unisex", shape: "Browline", color: "#2C1810", colorName: "Havana", rating: 4.8, reviews: 567, tag: "Premium", emoji: "💎" },
  { id: 7, name: "Bausch & Lomb Clarity", brand: "Bausch & Lomb", price: 799, originalPrice: 1299, category: "Contact Lenses", gender: "Unisex", shape: "—", color: "#ADD8E6", colorName: "Clear", rating: 4.2, reviews: 203, tag: "Bestseller", emoji: "🥇" },
  { id: 8, name: "Bolon Geometric", brand: "Bolon", price: 2899, originalPrice: 4299, category: "Eyeglasses", gender: "Women", shape: "Geometric", color: "#C0C0C0", colorName: "Silver", rating: 4.5, reviews: 145, tag: "New", emoji: "✨" },
];

const CATEGORIES = [
  { name: "Eyeglasses", icon: "👓", count: "2400+ styles", bg: "from-blue-50 to-blue-100" },
  { name: "Sunglasses", icon: "😎", count: "1800+ styles", bg: "from-amber-50 to-amber-100" },
  { name: "Contact Lenses", icon: "👁️", count: "120+ types", bg: "from-teal-50 to-teal-100" },
  { name: "Kids", icon: "🧒", count: "600+ styles", bg: "from-pink-50 to-pink-100" },
  { name: "Sports", icon: "⚡", count: "400+ styles", bg: "from-green-50 to-green-100" },
  { name: "Blue Light", icon: "💻", count: "800+ styles", bg: "from-purple-50 to-purple-100" },
];

const ORDERS = [
  { id: "LK-2024-001", date: "Jan 15, 2025", product: "Titan Aviator Pro", status: "Delivered", amount: 2499, statusColor: "text-green-600 bg-green-50" },
  { id: "LK-2024-002", date: "Feb 3, 2025", product: "Vincent Chase Retro", status: "Processing", amount: 1299, statusColor: "text-amber-600 bg-amber-50" },
  { id: "LK-2024-003", date: "Feb 20, 2025", product: "Lenskart Air Classic", status: "Shipped", amount: 1799, statusColor: "text-blue-600 bg-blue-50" },
];

const SHAPES = ["All", "Aviator", "Wayfarer", "Round", "Rectangle", "Cat Eye", "Geometric", "Browline", "Wrap"];
const FRAME_MATERIALS = ["All", "Metal", "Acetate", "TR90", "Titanium"];

// ─── UTILITIES ─────────────────────────────────────────────────────────────────
const formatPrice = (p) => `₹${p.toLocaleString("en-IN")}`;
const discount = (orig, price) => Math.round(((orig - price) / orig) * 100);

// ─── STAR RATING ───────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.floor(rating) ? "text-amber-400" : s - 0.5 <= rating ? "text-amber-300" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── PRODUCT CARD ──────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onNavigate, isWishlisted, onToggleWishlist }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden border border-slate-100 cursor-pointer group"
      style={{ boxShadow: hovered ? "0 20px 40px rgba(14,165,233,0.15)" : "0 2px 12px rgba(0,0,0,0.06)", transition: "all 0.3s ease", transform: hovered ? "translateY(-4px)" : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onNavigate("product-detail", product)}
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: product.tag === "New" ? "#DCFCE7" : product.tag === "Premium" ? "#FEF3C7" : product.tag === "Trending" ? "#FEE2E2" : "#DBEAFE", color: product.tag === "New" ? "#16A34A" : product.tag === "Premium" ? "#D97706" : product.tag === "Trending" ? "#DC2626" : "#2563EB" }}>
          {product.emoji} {product.tag}
        </span>
      </div>
      {/* Wishlist */}
      <button
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={{ background: isWishlisted ? "#FEE2E2" : "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
      >
        <svg className={`w-4 h-4 ${isWishlisted ? "text-red-500" : "text-gray-400"}`} fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      {/* Product Image Area */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)` }}>
        <div className="text-center transition-transform duration-300" style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}>
          <div className="text-8xl mb-1">👓</div>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: product.color, opacity: 0.6 }} />
        </div>
        {/* Try On overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(15,23,42,0.7)" }}>
          <span className="text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/30" style={{ backdropFilter: "blur(8px)" }}>
            👁️ Try On
          </span>
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="font-bold text-slate-800 text-sm mb-2 leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-extrabold" style={{ color: theme.teal }}>{formatPrice(product.price)}</span>
          <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
          <span className="text-xs font-bold text-green-600">{discount(product.originalPrice, product.price)}% off</span>
        </div>
        {/* Color dot */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ background: product.color }} />
          <span className="text-xs text-slate-500">{product.colorName}</span>
        </div>
        <button
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
          style={{ background: hovered ? theme.teal : "#F1F5F9", color: hovered ? "white" : theme.navy }}
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ currentPage, onNavigate, cartCount, wishlistCount, user }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Eyeglasses", "Sunglasses", "Contact Lenses", "Sports", "Kids"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{ background: scrolled ? "rgba(255,255,255,0.95)" : "white", backdropFilter: "blur(12px)", boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "0 1px 0 #E2E8F0" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2 font-black text-xl tracking-tight" style={{ color: theme.navy }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>L</div>
            <span>Lens<span style={{ color: theme.teal }}>Kart</span></span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <button key={l} onClick={() => onNavigate("plp", l)} className="text-sm font-medium transition-colors hover:text-sky-500" style={{ color: theme.muted }}>{l}</button>
            ))}
          </div>

          {/* Search Bar (desktop) */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-all" style={{ background: "#F8FAFC", borderColor: searchOpen ? theme.teal : theme.border, width: "220px" }}>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input placeholder="Search frames..." className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" onFocus={() => setSearchOpen(true)} onBlur={() => setSearchOpen(false)} />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            <button onClick={() => onNavigate("virtual-tryon")} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>
              <span>👁️</span> Try On
            </button>
            <button onClick={() => onNavigate("wishlist")} className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "#EF4444" }}>{wishlistCount}</span>}
            </button>
            <button onClick={() => onNavigate("cart")} className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: theme.teal }}>{cartCount}</span>}
            </button>
            <button onClick={() => onNavigate(user ? "dashboard" : "login")} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: user ? `linear-gradient(135deg, ${theme.teal}, #0284C7)` : "#E2E8F0", color: user ? "white" : theme.muted }}>
              {user ? user.name[0].toUpperCase() : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            </button>
            <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center" onClick={() => setMobileMenu(!mobileMenu)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2">
            {navLinks.map((l) => (
              <button key={l} onClick={() => { onNavigate("plp", l); setMobileMenu(false); }} className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">{l}</button>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-slate-50 mx-0">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input placeholder="Search frames..." className="bg-transparent text-sm outline-none flex-1" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── HOMEPAGE ──────────────────────────────────────────────────────────────────
function HomePage({ onNavigate, onAddToCart, wishlist, onToggleWishlist }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    { headline: "See the World in Style", sub: "Premium eyewear crafted for perfection. Starting ₹999", cta: "Shop Now", cta2: "Try Virtually", bg: "from-slate-900 via-slate-800 to-sky-900", accent: theme.teal },
    { headline: "Summer Collection 2025", sub: "UV protection meets fashion. Explore our exclusive sunglasses", cta: "Explore Sunglasses", cta2: "View Deals", bg: "from-amber-900 via-orange-900 to-red-900", accent: "#F59E0B" },
    { headline: "Blue Light Defenders", sub: "Work smart, protect your vision. Anti-blue light glasses from ₹799", cta: "Shop Blue Light", cta2: "Learn More", bg: "from-violet-900 via-purple-900 to-indigo-900", accent: "#8B5CF6" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveSlide((p) => (p + 1) % heroSlides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {/* Hero */}
      <section className="relative h-screen max-h-[700px] flex items-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${slide.bg.split(" ")[0].replace("from-", "").replace(/-\d+/, (m) => m)})` }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #0F172A 0%, #164E63 50%, #0F172A 100%)`, transition: "all 0.8s ease" }} />
        {/* Animated orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-20" style={{ background: slide.accent, filter: "blur(80px)", transition: "background 0.8s ease" }} />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-10" style={{ background: slide.accent, filter: "blur(60px)" }} />
        {/* Floating eyeglasses */}
        <div className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 text-center hidden md:block" style={{ animation: "float 4s ease-in-out infinite" }}>
          <div style={{ fontSize: "180px", opacity: 0.15, filter: "drop-shadow(0 0 40px rgba(14,165,233,0.5))" }}>👓</div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(14,165,233,0.2)", color: theme.teal, border: `1px solid rgba(14,165,233,0.3)` }}>
              ⭐ India's #1 Eyewear Brand · 2M+ Happy Customers
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{ letterSpacing: "-0.02em", transition: "all 0.5s ease" }}>
              {slide.headline.split(" ").map((w, i) => (
                <span key={i} style={{ color: i === 2 || i === 3 ? slide.accent : "white" }}>{w} </span>
              ))}
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">{slide.sub}</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => onNavigate("plp")} className="px-8 py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}dd)`, boxShadow: `0 8px 24px ${slide.accent}44` }}>
                {slide.cta} →
              </button>
              <button onClick={() => onNavigate("virtual-tryon")} className="px-8 py-3.5 rounded-full font-bold text-white border transition-all hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.3)" }}>
                👁️ {slide.cta2}
              </button>
            </div>
          </div>
        </div>
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} className="h-2 rounded-full transition-all" style={{ width: i === activeSlide ? "32px" : "8px", background: i === activeSlide ? slide.accent : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-4 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-0">
            {[
              { icon: "🚚", text: "Free Delivery above ₹999" },
              { icon: "🔄", text: "14-Day Easy Returns" },
              { icon: "💎", text: "1-Year Lens Warranty" },
              { icon: "🛡️", text: "100% Authentic Products" },
              { icon: "📦", text: "Same Day Dispatch" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <span>{b.icon}</span> {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Shop by Category</h2>
          <p className="text-slate-500">Find the perfect pair for every occasion</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button key={cat.name} onClick={() => onNavigate("plp", cat.name)} className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-100 hover:border-sky-200 transition-all hover:-translate-y-1" style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${cat.bg} group-hover:scale-110 transition-transform`}>{cat.icon}</div>
              <div className="text-center">
                <div className="font-bold text-slate-800 text-sm">{cat.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{cat.count}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">🔥 Trending Now</h2>
              <p className="text-slate-500 mt-1">Most loved by our customers this week</p>
            </div>
            <button onClick={() => onNavigate("plp")} className="text-sm font-bold px-5 py-2.5 rounded-full border-2 transition-all hover:bg-slate-900 hover:text-white" style={{ borderColor: theme.navy, color: theme.navy }}>
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {PRODUCTS.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Virtual Try-On", sub: "Try 1000+ frames from home", cta: "Try Now →", icon: "👁️", bg: "from-sky-900 to-slate-900", accent: theme.teal, page: "virtual-tryon" },
            { title: "Buy 1 Get 1 FREE", sub: "On select eyeglasses. Limited time offer!", cta: "Grab Deal →", icon: "🎁", bg: "from-amber-900 to-orange-900", accent: "#F59E0B", page: "plp" },
          ].map((b) => (
            <div key={b.title} className="relative overflow-hidden rounded-3xl p-8 text-white" style={{ background: `linear-gradient(135deg, ${b.bg.split(" ")[0].replace("from-", "").replace(/\-\d+/, "")}, ${b.bg.split(" ")[1]?.replace("to-", "")})`, minHeight: "200px" }}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${b.accent}22, transparent)` }} />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-20">{b.icon}</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2">{b.title}</h3>
                <p className="text-white/70 mb-6">{b.sub}</p>
                <button onClick={() => onNavigate(b.page)} className="px-6 py-2.5 rounded-full text-sm font-bold text-white border-2 hover:bg-white/10 transition-colors" style={{ borderColor: b.accent }}>
                  {b.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-3xl font-black mb-3">Get Exclusive Deals</h2>
          <p className="text-slate-400 mb-8">Subscribe & save 15% on your first order</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-sky-400 text-sm" />
            <button className="px-6 py-3 rounded-full font-bold text-white text-sm" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="font-black text-xl text-white mb-4">Lens<span style={{ color: theme.teal }}>Kart</span></div>
              <p className="text-sm leading-relaxed mb-4">India's most trusted eyewear destination with 1000+ stores across the country.</p>
              <div className="flex gap-3">
                {["📘", "📸", "🐦", "▶️"].map((s, i) => (
                  <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer hover:bg-white/10 transition-colors">{s}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Products", links: ["Eyeglasses", "Sunglasses", "Contact Lenses", "Kids Eyewear", "Sports Glasses"] },
              { title: "Help", links: ["Track Order", "Return Policy", "Prescription Help", "Frame Guide", "Contact Us"] },
              { title: "Company", links: ["About Us", "Careers", "Franchisee", "Store Locator", "Blog"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => <li key={l} className="text-sm hover:text-white cursor-pointer transition-colors">{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2025 LensKart. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <span className="cursor-pointer hover:text-white">Privacy Policy</span>
              <span className="cursor-pointer hover:text-white">Terms of Service</span>
              <span className="cursor-pointer hover:text-white">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── PRODUCT LISTING PAGE ──────────────────────────────────────────────────────
function PLPPage({ category, onNavigate, onAddToCart, wishlist, onToggleWishlist }) {
  const [filters, setFilters] = useState({ priceMax: 10000, shape: "All", gender: "All", sort: "popular" });
  const [showFilters, setShowFilters] = useState(false);

  const filtered = PRODUCTS
    .filter((p) => !category || category === "All" || p.category === category || p.gender === category)
    .filter((p) => p.price <= filters.priceMax)
    .filter((p) => filters.shape === "All" || p.shape === filters.shape)
    .filter((p) => filters.gender === "All" || p.gender === filters.gender || p.gender === "Unisex")
    .sort((a, b) => filters.sort === "price-low" ? a.price - b.price : filters.sort === "price-high" ? b.price - a.price : filters.sort === "rating" ? b.rating - a.rating : b.reviews - a.reviews);

  return (
    <div className="min-h-screen pt-20" style={{ background: theme.bg }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                <button onClick={() => onNavigate("home")} className="hover:text-sky-500">Home</button>
                <span>/</span>
                <span className="text-slate-700 font-medium">{category || "All Eyewear"}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">{category || "All Eyewear"}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{filtered.length} products found</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white font-medium outline-none" value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white font-medium">
                🔧 Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-24" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 className="font-black text-slate-900 mb-6">Filters</h3>
              {/* Price */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Price Range</label>
                <input type="range" min={500} max={10000} step={100} value={filters.priceMax} onChange={(e) => setFilters((f) => ({ ...f, priceMax: +e.target.value }))} className="w-full accent-sky-500 mb-2" />
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>₹500</span>
                  <span style={{ color: theme.teal }}>{formatPrice(filters.priceMax)}</span>
                </div>
              </div>
              {/* Shape */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Frame Shape</label>
                <div className="flex flex-wrap gap-2">
                  {SHAPES.slice(0, 7).map((s) => (
                    <button key={s} onClick={() => setFilters((f) => ({ ...f, shape: s }))} className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all" style={{ background: filters.shape === s ? theme.teal : "white", color: filters.shape === s ? "white" : theme.muted, borderColor: filters.shape === s ? theme.teal : theme.border }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Gender */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Gender</label>
                {["All", "Men", "Women", "Unisex", "Kids"].map((g) => (
                  <label key={g} className="flex items-center gap-3 py-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all" style={{ borderColor: filters.gender === g ? theme.teal : theme.border }}>
                      {filters.gender === g && <div className="w-2 h-2 rounded-full" style={{ background: theme.teal }} />}
                    </div>
                    <span className="text-sm text-slate-700" onClick={() => setFilters((f) => ({ ...f, gender: g }))}>{g}</span>
                  </label>
                ))}
              </div>
              {/* Frame Material */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Material</label>
                <div className="flex flex-wrap gap-2">
                  {FRAME_MATERIALS.map((m) => (
                    <button key={m} className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 text-slate-600 hover:border-sky-300 transition-all">{m}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-400">Try adjusting your filters</p>
                <button onClick={() => setFilters({ priceMax: 10000, shape: "All", gender: "All", sort: "popular" })} className="mt-4 px-6 py-2.5 rounded-full text-sm font-bold text-white" style={{ background: theme.teal }}>Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL PAGE ───────────────────────────────────────────────────────
function PDPPage({ product, onNavigate, onAddToCart, isWishlisted, onToggleWishlist }) {
  const [selectedLens, setSelectedLens] = useState("Single Vision");
  const [prescriptionMode, setPrescriptionMode] = useState("upload");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return null;

  const lensOptions = [
    { name: "Single Vision", desc: "For distance or reading", price: 0, icon: "👁️" },
    { name: "Progressive", desc: "Near + far vision", price: 1500, icon: "🔭" },
    { name: "Bifocal", desc: "Two focal points", price: 800, icon: "🔍" },
    { name: "Zero Power", desc: "Fashion / Blue light", price: 0, icon: "💻" },
  ];

  const handleAddToCart = () => {
    onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: theme.bg }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-slate-400">
          <button onClick={() => onNavigate("home")} className="hover:text-sky-500">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate("plp", product.category)} className="hover:text-sky-500">{product.category}</button>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white mb-4 relative group" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06)", aspectRatio: "1" }}>
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)" }}>
                <div className="text-9xl group-hover:scale-110 transition-transform duration-500">👓</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm">🔍 Hover to zoom</div>
              </div>
              {/* Wishlist */}
              <button onClick={() => onToggleWishlist(product.id)} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110" style={{ background: isWishlisted ? "#FEE2E2" : "white" }}>
                <svg className={`w-5 h-5 ${isWishlisted ? "text-red-500" : "text-slate-400"}`} fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? "border-sky-400" : "border-transparent"}`} style={{ aspectRatio: "1", background: "#f0f9ff" }}>
                  <div className="w-full h-full flex items-center justify-center text-3xl">👓</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">{product.brand}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <Stars rating={product.rating} />
              <span className="text-sm text-slate-500">{product.rating} · {product.reviews} reviews</span>
              <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: "#DCFCE7", color: "#16A34A" }}>In Stock ✓</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-black" style={{ color: theme.teal }}>{formatPrice(product.price)}</span>
              <div>
                <div className="text-slate-400 line-through text-sm">{formatPrice(product.originalPrice)}</div>
                <div className="text-green-600 font-bold text-sm">{discount(product.originalPrice, product.price)}% OFF</div>
              </div>
            </div>

            {/* Try On CTA */}
            <button onClick={() => onNavigate("virtual-tryon")} className="w-full py-3.5 rounded-2xl font-bold text-white mb-6 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: `linear-gradient(135deg, #7C3AED, #4F46E5)`, boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>
              <span className="text-xl">👁️</span>
              <span>Try On Virtually — FREE</span>
            </button>

            {/* Lens Type Selection */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 mb-3">Select Lens Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {lensOptions.map((l) => (
                  <button key={l.name} onClick={() => setSelectedLens(l.name)} className="p-3 rounded-xl border-2 text-left transition-all" style={{ borderColor: selectedLens === l.name ? theme.teal : theme.border, background: selectedLens === l.name ? theme.tealLight : "white" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{l.icon}</span>
                      <span className="text-sm font-bold text-slate-800">{l.name}</span>
                    </div>
                    <div className="text-xs text-slate-500">{l.desc}</div>
                    <div className="text-xs font-bold mt-1" style={{ color: theme.teal }}>{l.price ? `+${formatPrice(l.price)}` : "Included"}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prescription */}
            <div className="mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">💊 Prescription</h3>
              <div className="flex gap-2 mb-4">
                {["upload", "manual", "saved"].map((m) => (
                  <button key={m} onClick={() => setPrescriptionMode(m)} className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all" style={{ background: prescriptionMode === m ? theme.navy : "white", color: prescriptionMode === m ? "white" : theme.muted, border: `1px solid ${prescriptionMode === m ? theme.navy : theme.border}` }}>
                    {m === "upload" ? "📤 Upload" : m === "manual" ? "✏️ Manual" : "💾 Saved"}
                  </button>
                ))}
              </div>
              {prescriptionMode === "manual" && (
                <div className="grid grid-cols-4 gap-2">
                  {["SPH", "CYL", "AXIS", "ADD"].map((f) => (
                    <div key={f}>
                      <label className="text-xs text-slate-400 mb-1 block font-medium">{f}</label>
                      <input type="number" step="0.25" placeholder="0.00" className="w-full px-2 py-2 rounded-lg border border-slate-200 text-sm text-center font-mono outline-none focus:border-sky-400" />
                    </div>
                  ))}
                </div>
              )}
              {prescriptionMode === "upload" && (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-sky-300 transition-colors">
                  <div className="text-2xl mb-1">📤</div>
                  <div className="text-sm text-slate-500">Drop your prescription or <span className="text-sky-500 font-medium">browse</span></div>
                </div>
              )}
              {prescriptionMode === "saved" && (
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border-2 border-sky-400 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-sky-400" /></div>
                    <div className="text-sm"><div className="font-medium">My Prescription #1</div><div className="text-xs text-slate-400">Saved Jan 15, 2025</div></div>
                  </label>
                </div>
              )}
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 transition-colors">−</button>
                <span className="font-bold text-slate-900 w-6 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2" style={{ background: addedToCart ? "#10B981" : `linear-gradient(135deg, ${theme.teal}, #0284C7)`, boxShadow: `0 8px 24px ${theme.teal}44` }}>
                {addedToCart ? <>✓ Added to Cart!</> : <>🛒 Add to Cart · {formatPrice(product.price * qty)}</>}
              </button>
            </div>

            {/* Specs */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex gap-4 mb-4">
                {["details", "reviews", "shipping"].map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className="text-sm font-bold capitalize pb-2 border-b-2 transition-all" style={{ borderColor: activeTab === t ? theme.teal : "transparent", color: activeTab === t ? theme.teal : theme.muted }}>
                    {t}
                  </button>
                ))}
              </div>
              {activeTab === "details" && (
                <div className="grid grid-cols-2 gap-3">
                  {[["Brand", product.brand], ["Category", product.category], ["Shape", product.shape], ["Gender", product.gender], ["Color", product.colorName], ["Frame Type", "Full Rim"], ["Dimensions", "54-18-140"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">{k}</span>
                      <span className="text-sm font-medium text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {[{ name: "Priya S.", rating: 5, text: "Absolutely love these! The quality is top-notch and delivery was super fast." }, { name: "Rahul M.", rating: 4, text: "Great frames, fits perfectly. The virtual try-on feature is really cool!" }].map((r, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: theme.teal }}>{r.name[0]}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{r.name}</div>
                          <Stars rating={r.rating} />
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-3">
                  {[{ icon: "🚚", text: "Free delivery in 3-5 business days" }, { icon: "⚡", text: "Express delivery available for ₹99" }, { icon: "🔄", text: "14-day hassle-free returns" }, { icon: "💎", text: "1 year lens warranty included" }].map((i) => (
                    <div key={i.text} className="flex items-center gap-3 text-sm text-slate-700"><span>{i.icon}</span>{i.text}</div>
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

// ─── CART PAGE ─────────────────────────────────────────────────────────────────
function CartPage({ cart, onUpdateQty, onRemove, onNavigate }) {
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [step, setStep] = useState("cart");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount2 = couponApplied ? Math.round(subtotal * 0.15) : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount2 + shipping;

  if (orderPlaced) return (
    <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: theme.bg }}>
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl" style={{ background: "#DCFCE7" }}>✅</div>
        <h2 className="text-3xl font-black text-slate-900 mb-3">Order Placed!</h2>
        <p className="text-slate-500 mb-2">Your order <span className="font-bold text-slate-700">#LK-2025-{Math.floor(Math.random()*1000)}</span> has been confirmed.</p>
        <p className="text-slate-400 text-sm mb-8">We'll send you updates via email & WhatsApp 📱</p>
        <button onClick={() => onNavigate("home")} className="px-8 py-3.5 rounded-full font-bold text-white" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>Continue Shopping →</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20" style={{ background: theme.bg }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">🛒 {step === "cart" ? "Your Cart" : step === "address" ? "Delivery Address" : "Payment"}</h1>
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {["cart", "address", "payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: step === s ? theme.teal : i < ["cart", "address", "payment"].indexOf(step) ? "#10B981" : theme.muted }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm" style={{ background: step === s ? theme.teal : i < ["cart", "address", "payment"].indexOf(step) ? "#10B981" : "#E2E8F0", color: step === s || i < ["cart", "address", "payment"].indexOf(step) ? "white" : theme.muted }}>
                  {i < ["cart", "address", "payment"].indexOf(step) ? "✓" : i + 1}
                </div>
                <span className="capitalize">{s}</span>
              </div>
              {i < 2 && <div className="flex-1 h-0.5 w-8" style={{ background: i < ["cart", "address", "payment"].indexOf(step) ? "#10B981" : "#E2E8F0" }} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "cart" && (
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h3>
                    <button onClick={() => onNavigate("plp")} className="px-6 py-2.5 rounded-full text-sm font-bold text-white mt-4" style={{ background: theme.teal }}>Start Shopping</button>
                  </div>
                ) : cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-100 flex gap-5 items-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                    <div className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl flex-shrink-0" style={{ background: "#f0f9ff" }}>👓</div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-400 font-medium mb-0.5">{item.brand}</div>
                      <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                      <div className="text-sm text-slate-500 mb-3">Color: <span className="font-medium">{item.colorName}</span></div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200">
                          <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="text-slate-500 hover:text-slate-900 font-bold">−</button>
                          <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                          <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="text-slate-500 hover:text-slate-900 font-bold">+</button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Remove</button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-slate-900 text-lg">{formatPrice(item.price * item.qty)}</div>
                      <div className="text-xs text-slate-400">{formatPrice(item.price)} each</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === "address" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h3 className="font-bold text-slate-900 mb-6">Delivery Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[["Full Name", "text", "col-span-2"], ["Email", "email", "col-span-2"], ["Phone", "tel", "col-span-1"], ["Pincode", "text", "col-span-1"], ["Address Line 1", "text", "col-span-2"], ["City", "text", "col-span-1"], ["State", "text", "col-span-1"]].map(([label, type, span]) => (
                    <div key={label} className={span}>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{label}</label>
                      <input type={type} placeholder={`Enter ${label}`} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <h3 className="font-bold text-slate-900 mb-6">Payment Method</h3>
                <div className="space-y-3 mb-6">
                  {[{ id: "card", label: "💳 Credit / Debit Card", sub: "Visa, Mastercard, RuPay" }, { id: "upi", label: "📱 UPI", sub: "GPay, PhonePe, Paytm" }, { id: "netbanking", label: "🏦 Net Banking", sub: "All major banks" }, { id: "cod", label: "💵 Cash on Delivery", sub: "Pay when delivered" }].map((m) => (
                    <label key={m.id} onClick={() => setPaymentMethod(m.id)} className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all" style={{ borderColor: paymentMethod === m.id ? theme.teal : theme.border, background: paymentMethod === m.id ? theme.tealLight : "white" }}>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: paymentMethod === m.id ? theme.teal : theme.border }}>
                        {paymentMethod === m.id && <div className="w-3 h-3 rounded-full" style={{ background: theme.teal }} />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{m.label}</div>
                        <div className="text-xs text-slate-400">{m.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {paymentMethod === "card" && (
                  <div className="space-y-4 p-4 rounded-xl bg-slate-50">
                    <input placeholder="Card Number" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 font-mono" />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="MM/YY" className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400" />
                      <input placeholder="CVV" className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-24" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h3 className="font-black text-slate-900 mb-5">Order Summary</h3>
              {cart.slice(0, 2).map((i) => (
                <div key={i.id} className="flex gap-3 mb-3 pb-3 border-b border-slate-50">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl" style={{ background: "#f0f9ff" }}>👓</div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-slate-800 truncate">{i.name}</div>
                    <div className="text-xs text-slate-400">Qty: {i.qty}</div>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{formatPrice(i.price * i.qty)}</div>
                </div>
              ))}
              {cart.length > 2 && <div className="text-xs text-slate-400 mb-3">+{cart.length - 2} more items</div>}

              {/* Coupon */}
              {step === "cart" && (
                <div className="flex gap-2 mb-5">
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400" />
                  <button onClick={() => { if (coupon.toUpperCase() === "SAVE15") setCouponApplied(true); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: theme.teal }}>Apply</button>
                </div>
              )}
              {couponApplied && <div className="text-xs text-green-600 font-bold mb-4 flex items-center gap-1.5">✅ Coupon SAVE15 applied! You save {formatPrice(discount2)}</div>}

              <div className="space-y-3 border-t border-slate-100 pt-4 mb-5">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
                {couponApplied && <div className="flex justify-between text-sm"><span className="text-green-600">Discount (15%)</span><span className="text-green-600 font-medium">−{formatPrice(discount2)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-slate-500">Shipping</span><span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-lg font-black border-t border-slate-100 pt-3"><span>Total</span><span style={{ color: theme.teal }}>{formatPrice(total)}</span></div>
              </div>

              <button
                onClick={() => {
                  if (step === "cart" && cart.length > 0) setStep("address");
                  else if (step === "address") setStep("payment");
                  else if (step === "payment") setOrderPlaced(true);
                }}
                className="w-full py-4 rounded-2xl font-black text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)`, boxShadow: `0 8px 24px ${theme.teal}44` }}
              >
                {step === "cart" ? "Proceed to Address →" : step === "address" ? "Continue to Payment →" : "🔒 Place Order Securely"}
              </button>
              {step === "payment" && <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">🔒 Secured by Razorpay · 256-bit SSL</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VIRTUAL TRY-ON ────────────────────────────────────────────────────────────
function VirtualTryOnPage({ onNavigate }) {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const frames = [
    { name: "Aviator Gold", emoji: "🥽", color: "#C0A882" },
    { name: "Wayfarer Black", emoji: "😎", color: "#1a1a1a" },
    { name: "Cat Eye Red", emoji: "👓", color: "#C41E3A" },
    { name: "Round Silver", emoji: "🔵", color: "#C0C0C0" },
  ];

  const startCamera = async () => {
    setLoading(true);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraOn(true);
      }
    } catch (e) {
      setError("Camera access denied. Please allow camera permission to use Virtual Try-On.");
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="min-h-screen pt-20" style={{ background: "#0F172A" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: "rgba(14,165,233,0.2)", color: theme.teal, border: `1px solid rgba(14,165,233,0.3)` }}>
            👁️ AI-Powered Virtual Try-On
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Try Frames Virtually</h1>
          <p className="text-slate-400 text-lg">See how glasses look on your face before buying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="md:col-span-2">
            <div className="rounded-3xl overflow-hidden relative" style={{ background: "#1E293B", aspectRatio: "4/3", border: "1px solid rgba(255,255,255,0.08)" }}>
              {!cameraOn ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-7xl mb-6 animate-pulse">👁️</div>
                  <h3 className="text-xl font-bold text-white mb-3">Enable Camera</h3>
                  <p className="text-slate-400 text-sm text-center mb-8 max-w-xs">Allow camera access to see glasses overlaid on your face in real-time</p>
                  {error && <p className="text-red-400 text-xs mb-4 text-center max-w-xs">{error}</p>}
                  <button onClick={startCamera} disabled={loading} className="px-8 py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)`, boxShadow: `0 8px 24px ${theme.teal}44` }}>
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "📷"}
                    {loading ? "Starting Camera..." : "Start Camera"}
                  </button>
                </div>
              ) : (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                  {/* Overlay glasses on face */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-[120px] opacity-80" style={{ filter: `drop-shadow(0 4px 12px ${frames[selectedFrame].color}88)`, transform: "translateY(-10%)" }}>
                      {frames[selectedFrame].emoji}
                    </div>
                  </div>
                  {/* Face guide */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 rounded-full pointer-events-none opacity-20" style={{ width: "200px", height: "260px", borderColor: theme.teal, borderStyle: "dashed" }} />
                  <button onClick={stopCamera} className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-red-500/80 backdrop-blur-sm hover:bg-red-500">✕ Stop</button>
                </>
              )}
            </div>
            {cameraOn && (
              <div className="mt-4 flex gap-3 justify-center">
                <div className="px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2" style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Face detected
                </div>
                <div className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: "rgba(14,165,233,0.2)", color: theme.teal, border: `1px solid rgba(14,165,233,0.3)` }}>
                  👓 {frames[selectedFrame].name}
                </div>
              </div>
            )}
          </div>

          {/* Frame Selector */}
          <div>
            <div className="rounded-3xl p-6" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="font-bold text-white mb-5">Choose Frame</h3>
              <div className="space-y-3">
                {frames.map((f, i) => (
                  <button key={f.name} onClick={() => setSelectedFrame(i)} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left" style={{ borderColor: selectedFrame === i ? theme.teal : "rgba(255,255,255,0.06)", background: selectedFrame === i ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.02)" }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl" style={{ background: "rgba(255,255,255,0.05)" }}>{f.emoji}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{f.name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: f.color }} />
                        <span className="text-xs text-slate-400">{f.color}</span>
                      </div>
                    </div>
                    {selectedFrame === i && <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: theme.teal }}>✓</div>}
                  </button>
                ))}
              </div>
              <button onClick={() => onNavigate("plp")} className="w-full mt-6 py-3 rounded-2xl font-bold text-white text-sm transition-all hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>
                🛒 Shop This Frame
              </button>
            </div>
            {/* Info */}
            <div className="mt-4 p-4 rounded-2xl" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.15)" }}>
              <div className="text-xs text-slate-300 space-y-2">
                {["Face detection powered by AI", "Works in real-time using WebRTC", "Try 1000+ frames from any device"].map((t) => (
                  <div key={t} className="flex items-center gap-2"><span className="text-sky-400">✓</span>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ────────────────────────────────────────────────────────────
function DashboardPage({ onNavigate, user }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [wishlist2] = useState(PRODUCTS.slice(0, 3));

  const navItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "orders", label: "My Orders", icon: "📦" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
    { id: "wishlist", label: "Wishlist", icon: "❤️" },
    { id: "addresses", label: "Addresses", icon: "📍" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen pt-20" style={{ background: theme.bg }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            {/* User Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-4 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-3" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>
                {user?.name?.[0] || "U"}
              </div>
              <h3 className="font-black text-slate-900 text-lg">{user?.name || "User"}</h3>
              <p className="text-sm text-slate-400 mt-0.5">{user?.email || "user@email.com"}</p>
              <div className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold inline-block" style={{ background: theme.tealLight, color: theme.teal }}>✓ Verified Member</div>
            </div>
            {/* Nav */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveSection(item.id)} className="w-full flex items-center gap-3 px-5 py-3.5 text-left text-sm font-medium transition-all border-l-2" style={{ borderColor: activeSection === item.id ? theme.teal : "transparent", background: activeSection === item.id ? theme.tealLight : "transparent", color: activeSection === item.id ? theme.teal : theme.muted }}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
              <button onClick={() => onNavigate("home")} className="w-full flex items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-red-400 hover:bg-red-50 transition-colors border-t border-slate-50">
                <span>🚪</span> Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeSection === "overview" && (
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋</h2>
                <div className="grid grid-cols-3 gap-5 mb-8">
                  {[{ label: "Total Orders", value: "3", icon: "📦", color: theme.teal }, { label: "Saved Prescriptions", value: "2", icon: "💊", color: "#8B5CF6" }, { label: "Wishlist Items", value: "6", icon: "❤️", color: "#EF4444" }].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: `${s.color}15` }}>{s.icon}</div>
                      <div className="text-3xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-sm text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <h3 className="font-bold text-slate-900 mb-4">Recent Orders</h3>
                  <div className="space-y-4">
                    {ORDERS.map((o) => (
                      <div key={o.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "#f0f9ff" }}>👓</div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 text-sm">{o.product}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{o.id} · {o.date}</div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${o.statusColor}`}>{o.status}</span>
                        <span className="font-black text-slate-900">{formatPrice(o.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "orders" && (
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">My Orders</h2>
                <div className="space-y-4">
                  {ORDERS.map((o) => (
                    <div key={o.id} className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl" style={{ background: "#f0f9ff" }}>👓</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-slate-900">{o.product}</h3>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${o.statusColor}`}>{o.status}</span>
                          </div>
                          <div className="text-sm text-slate-400 mb-2">{o.id} · Ordered on {o.date}</div>
                          <div className="font-black text-slate-900 text-lg">{formatPrice(o.amount)}</div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50">
                        <button className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-colors">Track Order</button>
                        {o.status === "Delivered" && <button className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-colors">Reorder</button>}
                        {o.status === "Delivered" && <button className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-colors">Download Invoice</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "prescriptions" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-slate-900">My Prescriptions</h2>
                  <button className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: theme.teal }}>+ Add New</button>
                </div>
                <div className="space-y-4">
                  {[{ name: "Prescription #1", date: "Jan 15, 2025", sph: "-1.50", cyl: "-0.25", axis: "180", add: "+0.00" }, { name: "Prescription #2 (Reading)", date: "Nov 10, 2024", sph: "+2.00", cyl: "0.00", axis: "0", add: "+1.25" }].map((p, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-slate-900">{p.name}</h3>
                          <p className="text-sm text-slate-400 mt-0.5">Added {p.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50">Edit</button>
                          <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 border border-red-100 hover:bg-red-50">Delete</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {[["SPH", p.sph], ["CYL", p.cyl], ["AXIS", p.axis], ["ADD", p.add]].map(([k, v]) => (
                          <div key={k} className="p-3 rounded-xl text-center" style={{ background: theme.tealLight }}>
                            <div className="text-xs font-bold text-slate-400 mb-1">{k}</div>
                            <div className="font-black font-mono" style={{ color: theme.teal }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "profile" && (
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Profile Settings</h2>
                <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div className="grid gap-5">
                    {[["Full Name", "text", user?.name || ""], ["Email Address", "email", user?.email || ""], ["Phone Number", "tel", "+91 9876543210"], ["Date of Birth", "date", ""]].map(([label, type, val]) => (
                      <div key={label}>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{label}</label>
                        <input type={type} defaultValue={val} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 px-8 py-3 rounded-xl font-bold text-white text-sm" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({ onNavigate }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "products", label: "Products", icon: "👓" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "coupons", label: "Coupons", icon: "🎟️" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  const stats = [
    { label: "Total Revenue", value: "₹12,45,800", change: "+18.3%", up: true, icon: "💰", color: "#10B981" },
    { label: "Total Orders", value: "3,842", change: "+12.1%", up: true, icon: "📦", color: theme.teal },
    { label: "Active Users", value: "18,290", change: "+24.5%", up: true, icon: "👥", color: "#8B5CF6" },
    { label: "Pending Returns", value: "47", change: "-3.2%", up: false, icon: "🔄", color: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#0F172A" }}>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0F172A" }}>
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="font-black text-xl text-white">Lens<span style={{ color: theme.teal }}>Kart</span></div>
          <div className="text-xs text-slate-400 mt-0.5">Admin Panel</div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all" style={{ background: activeSection === item.id ? "rgba(14,165,233,0.15)" : "transparent", color: activeSection === item.id ? theme.teal : "#94A3B8" }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={() => onNavigate("home")} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
            <span>🚪</span> Exit Admin
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0F172A" }}>
          <div>
            <h1 className="text-xl font-black text-white capitalize">{activeSection}</h1>
            <p className="text-xs text-slate-400">Admin Dashboard · LensKart</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full absolute top-0 right-0 bg-green-400 animate-pulse" />
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>A</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {activeSection === "dashboard" && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-5 mb-8">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl p-5 border" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${s.color}20` }}>{s.icon}</div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.up ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>{s.change}</span>
                    </div>
                    <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Charts placeholder */}
              <div className="grid grid-cols-3 gap-5 mb-8">
                <div className="col-span-2 rounded-2xl p-5 border" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.06)" }}>
                  <h3 className="font-bold text-white mb-4">Revenue Overview</h3>
                  <div className="flex items-end gap-3 h-40">
                    {[60, 75, 45, 90, 65, 80, 70, 95, 55, 85, 72, 100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%`, background: `linear-gradient(to top, ${theme.teal}, ${theme.teal}66)` }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => <span key={m}>{m}</span>)}
                  </div>
                </div>
                <div className="rounded-2xl p-5 border" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.06)" }}>
                  <h3 className="font-bold text-white mb-4">Top Categories</h3>
                  <div className="space-y-4">
                    {[["Eyeglasses", 42, theme.teal], ["Sunglasses", 28, "#8B5CF6"], ["Contact Lenses", 18, "#F59E0B"], ["Kids", 12, "#EF4444"]].map(([cat, pct, color]) => (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-300">{cat}</span>
                          <span className="font-bold" style={{ color }}>{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Recent Orders */}
              <div className="rounded-2xl border overflow-hidden" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <h3 className="font-bold text-white">Recent Orders</h3>
                  <button className="text-xs text-sky-400 font-medium" onClick={() => setActiveSection("orders")}>View All →</button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      {["Order ID", "Customer", "Product", "Amount", "Status"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map((o) => (
                      <tr key={o.id} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                        <td className="px-6 py-4 text-sm font-mono text-sky-400">{o.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">Customer</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{o.product}</td>
                        <td className="px-6 py-4 text-sm font-bold text-white">{formatPrice(o.amount)}</td>
                        <td className="px-6 py-4"><span className={`text-xs font-bold px-3 py-1 rounded-full ${o.statusColor}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Products</h2>
                  <p className="text-slate-400 text-sm mt-0.5">{PRODUCTS.length} products in catalog</p>
                </div>
                <button onClick={() => setShowAddProduct(true)} className="px-5 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>+ Add Product</button>
              </div>

              {showAddProduct && (
                <div className="rounded-2xl p-6 border mb-6" style={{ background: "#1E293B", borderColor: "rgba(14,165,233,0.3)" }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-white">Add New Product</h3>
                    <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {["Product Name", "Brand", "Price (₹)", "Original Price (₹)", "Category", "Frame Shape", "Color", "Gender"].map((f) => (
                      <div key={f}>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{f}</label>
                        <input placeholder={`Enter ${f}`} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button className="px-6 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>Save Product</button>
                    <button onClick={() => setShowAddProduct(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-300 text-sm border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border overflow-hidden" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.06)" }}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      {["Product", "Brand", "Category", "Price", "Stock", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>👓</div>
                            <span className="text-sm font-medium text-white">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{p.brand}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{p.category}</td>
                        <td className="px-6 py-4 text-sm font-bold text-white">{formatPrice(p.price)}</td>
                        <td className="px-6 py-4"><span className="text-xs font-bold px-3 py-1 rounded-full text-green-400 bg-green-400/10">In Stock</span></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs px-3 py-1.5 rounded-lg font-bold text-sky-400 hover:bg-sky-400/10 transition-colors">Edit</button>
                            <button className="text-xs px-3 py-1.5 rounded-lg font-bold text-red-400 hover:bg-red-400/10 transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-6">User Management</h2>
              <div className="rounded-2xl border overflow-hidden" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.06)" }}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      {["User", "Email", "Role", "Orders", "Joined", "Status"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Priya Sharma", email: "priya@email.com", role: "User", orders: 5, joined: "Jan 2024" },
                      { name: "Rahul Mehta", email: "rahul@email.com", role: "User", orders: 3, joined: "Feb 2024" },
                      { name: "Admin User", email: "admin@lenskart.com", role: "Admin", orders: 0, joined: "Dec 2023" },
                    ].map((u, i) => (
                      <tr key={i} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>{u.name[0]}</div>
                            <span className="text-sm font-medium text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{u.email}</td>
                        <td className="px-6 py-4"><span className={`text-xs font-bold px-3 py-1 rounded-full ${u.role === "Admin" ? "text-purple-400 bg-purple-400/10" : "text-slate-300 bg-white/10"}`}>{u.role}</span></td>
                        <td className="px-6 py-4 text-sm text-slate-300">{u.orders}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{u.joined}</td>
                        <td className="px-6 py-4"><span className="text-xs font-bold px-3 py-1 rounded-full text-green-400 bg-green-400/10">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "coupons" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">Coupon System</h2>
                <button className="px-5 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)` }}>+ Create Coupon</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[{ code: "SAVE15", discount: "15% OFF", uses: "234/500", expires: "Mar 31, 2025", active: true }, { code: "FIRST20", discount: "20% OFF", uses: "89/200", expires: "Apr 15, 2025", active: true }, { code: "SUMMER30", discount: "30% OFF", uses: "500/500", expires: "Expired", active: false }].map((c) => (
                  <div key={c.code} className="rounded-2xl p-5 border" style={{ background: "#1E293B", borderColor: c.active ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.active ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>{c.active ? "Active" : "Expired"}</span>
                    </div>
                    <div className="font-black text-2xl text-white mb-1">{c.code}</div>
                    <div className="text-xl font-bold mb-3" style={{ color: theme.teal }}>{c.discount}</div>
                    <div className="space-y-2 text-xs text-slate-400">
                      <div>Uses: {c.uses}</div>
                      <div>Expires: {c.expires}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "analytics" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-6">Analytics</h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl p-6 border" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.06)" }}>
                  <h3 className="font-bold text-white mb-4">Monthly Revenue</h3>
                  <div className="flex items-end gap-2 h-48">
                    {[40, 65, 50, 80, 70, 90, 60, 85, 75, 95, 88, 100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%`, background: `linear-gradient(to top, ${theme.teal}, ${theme.teal}44)` }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-6 border" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.06)" }}>
                  <h3 className="font-bold text-white mb-6">Key Metrics</h3>
                  <div className="space-y-4">
                    {[["Conversion Rate", "3.8%", "+0.4%", true], ["Avg Order Value", "₹2,840", "+₹180", true], ["Cart Abandonment", "68%", "-2.1%", false], ["Customer LTV", "₹8,420", "+12%", true]].map(([k, v, ch, up]) => (
                      <div key={k} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <span className="text-sm text-slate-400">{k}</span>
                        <div className="text-right">
                          <div className="font-black text-white">{v}</div>
                          <div className={`text-xs font-bold ${up ? "text-green-400" : "text-red-400"}`}>{ch}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({ onLogin, onNavigate }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = () => {
    onLogin({ name: form.name || "Demo User", email: form.email || "demo@lenskart.com" });
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0F172A 0%, #164E63 100%)" }}>
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.3)" }}>
          <div className="p-8 pb-0 text-center">
            <div className="font-black text-2xl mb-1">Lens<span style={{ color: theme.teal }}>Kart</span></div>
            <p className="text-slate-400 text-sm mb-6">India's #1 Eyewear Brand</p>
            <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
              {["login", "signup"].map((m) => (
                <button key={m} onClick={() => setMode(m)} className="flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all" style={{ background: mode === m ? "white" : "transparent", color: mode === m ? theme.navy : theme.muted, boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}>
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          </div>
          <div className="px-8 pb-8">
            {mode === "signup" && (
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Enter your name" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 transition-colors" />
              </div>
            )}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Enter your email" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 transition-colors" />
            </div>
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Enter your password" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-400 transition-colors" />
            </div>
            <button onClick={handleSubmit} className="w-full py-4 rounded-2xl font-black text-white mb-4 transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: `linear-gradient(135deg, ${theme.teal}, #0284C7)`, boxShadow: `0 8px 24px ${theme.teal}44` }}>
              {mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
            <button onClick={handleSubmit} className="w-full py-3 rounded-2xl font-bold text-slate-600 border border-slate-200 text-sm mb-4 flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors">
              <span className="text-xl">🇬</span> Continue with Google
            </button>
            {mode === "login" && (
              <div className="text-center">
                <button className="text-sm text-sky-500 font-medium">Forgot password?</button>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-6">
          <button onClick={() => onNavigate("admin")} className="text-sm text-slate-400 hover:text-white transition-colors">
            🔧 Admin Panel →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ─────────────────────────────────────────────────────────────
function WishlistPage({ wishlist, onNavigate, onAddToCart, onToggleWishlist }) {
  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));
  return (
    <div className="min-h-screen pt-20" style={{ background: theme.bg }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">❤️ My Wishlist</h1>
        <p className="text-slate-500 mb-8">{wishlistProducts.length} saved items</p>
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Your wishlist is empty</h3>
            <button onClick={() => onNavigate("plp")} className="px-6 py-2.5 rounded-full text-sm font-bold text-white mt-4" style={{ background: theme.teal }}>Browse Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlistProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} isWishlisted={true} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([1, 3]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const navigate = (p, data = null) => {
    setPage(p);
    setPageData(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✅ ${product.name} added to cart!`);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const isIn = prev.includes(id);
      showToast(isIn ? "❌ Removed from wishlist" : "❤️ Added to wishlist", isIn ? "error" : "success");
      return isIn ? prev.filter((i) => i !== id) : [...prev, id];
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const renderPage = () => {
    const props = { onNavigate: navigate, onAddToCart: addToCart, wishlist, onToggleWishlist: toggleWishlist, user };
    switch (page) {
      case "home": return <HomePage {...props} />;
      case "plp": return <PLPPage {...props} category={pageData} />;
      case "product-detail": return <PDPPage {...props} product={pageData} isWishlisted={pageData && wishlist.includes(pageData.id)} />;
      case "cart": return <CartPage cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} onNavigate={navigate} />;
      case "wishlist": return <WishlistPage {...props} />;
      case "virtual-tryon": return <VirtualTryOnPage onNavigate={navigate} />;
      case "dashboard": return <DashboardPage {...props} />;
      case "admin": return <AdminPanel onNavigate={navigate} />;
      case "login": return <AuthPage onLogin={setUser} onNavigate={navigate} />;
      default: return <HomePage {...props} />;
    }
  };

  const showNav = page !== "admin";

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(-50%) translateX(0); } 50% { transform: translateY(-50%) translateX(-15px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        input[type=range] { height: 4px; }
      `}</style>

      {showNav && <Navbar currentPage={page} onNavigate={navigate} cartCount={cartCount} wishlistCount={wishlist.length} user={user} />}

      <div style={{ animation: "fadeInUp 0.3s ease" }} key={page}>
        {renderPage()}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full font-bold text-sm text-white shadow-2xl" style={{ background: toast.type === "error" ? "#EF4444" : "#0F172A", animation: "fadeInUp 0.3s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* Floating Action Button */}
      {showNav && page !== "virtual-tryon" && (
        <button
          onClick={() => navigate("virtual-tryon")}
          className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full font-bold text-white flex items-center gap-2 shadow-2xl hover:scale-110 transition-all active:scale-95"
          style={{ background: `linear-gradient(135deg, #7C3AED, #4F46E5)`, boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}
        >
          <span className="text-xl">👁️</span>
          <span className="hidden md:inline text-sm">Virtual Try-On</span>
        </button>
      )}
    </div>
  );
}

