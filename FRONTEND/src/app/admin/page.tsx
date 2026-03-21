// src/app/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

type AdminSection =
  | "dashboard"
  | "products"
  | "orders"
  | "users"
  | "coupons"
  | "analytics";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "products",  label: "Products",  icon: "👓" },
  { id: "orders",    label: "Orders",    icon: "📦" },
  { id: "users",     label: "Users",     icon: "👥" },
  { id: "coupons",   label: "Coupons",   icon: "🎟️" },
  { id: "analytics", label: "Analytics", icon: "📈" },
] as const;

const STATUS_OPTIONS = [
  "PENDING", "CONFIRMED", "PROCESSING",
  "SHIPPED", "DELIVERED", "CANCELLED",
];

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export default function AdminPage() {
  const { user, token, isAdmin } = useAuth();
  const router = useRouter();

  const [section, setSection]       = useState<AdminSection>("dashboard");
  const [stats, setStats]           = useState<any>(null);
  const [products, setProducts]     = useState<any[]>([]);
  const [orders, setOrders]         = useState<any[]>([]);
  const [users, setUsers]           = useState<any[]>([]);
  const [coupons, setCoupons]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", brand: "", price: "",
    originalPrice: "", sku: "", categoryId: "",
    gender: "", frameShape: "",
  });

  const headers = { Authorization: `Bearer ${token}` };

  // ── GUARD ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!token)   { router.push("/auth"); return; }
    if (!isAdmin) { router.push("/");    return; }
    fetchStats();
    fetchProducts();
  }, [token, isAdmin]);

  // ── FETCHERS ──────────────────────────────────────────────────
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/stats`, { headers });
      setStats(data.stats);
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products?limit=50`, { headers });
      setProducts(data.products || []);
    } catch {} finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders/admin/all`, { headers });
      setOrders(data.orders || []);
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/users`, { headers });
      setUsers(data.users || []);
    } catch {}
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get(`${API}/coupons/admin`, { headers });
      setCoupons(data.coupons || []);
    } catch {}
  };

  // ── SECTION CHANGE ────────────────────────────────────────────
  const changeSection = (s: AdminSection) => {
    setSection(s);
    if (s === "orders")  fetchOrders();
    if (s === "users")   fetchUsers();
    if (s === "coupons") fetchCoupons();
  };

  // ── HANDLERS ──────────────────────────────────────────────────
  const addProduct = async () => {
    try {
      await axios.post(
        `${API}/products`,
        {
          ...newProduct,
          price:         parseFloat(newProduct.price),
          originalPrice: parseFloat(newProduct.originalPrice),
          stock:         10,
        },
        { headers }
      );
      toast.success("✅ Product added!");
      setShowAddProduct(false);
      setNewProduct({ name:"",brand:"",price:"",originalPrice:"",sku:"",categoryId:"",gender:"",frameShape:"" });
      fetchProducts();
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed to add product");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await axios.put(
        `${API}/orders/admin/${id}/status`,
        { status },
        { headers }
      );
      setOrders((prev) =>
        prev.map((o) => o.id === id ? { ...o, status } : o)
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const toggleUser = async (id: string) => {
    try {
      const { data } = await axios.put(
        `${API}/admin/users/${id}/toggle`, {}, { headers }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, isActive: data.user.isActive } : u
        )
      );
    } catch {}
  };

  const createCoupon = async () => {
    const code = prompt("Coupon code (e.g. SAVE20):");
    if (!code) return;
    const disc = prompt("Discount % (e.g. 20):");
    if (!disc) return;
    try {
      await axios.post(
        `${API}/coupons/admin`,
        {
          code:          code.toUpperCase(),
          discountType:  "PERCENTAGE",
          discountValue: parseFloat(disc),
          isActive:      true,
        },
        { headers }
      );
      toast.success("Coupon created!");
      fetchCoupons();
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed");
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await axios.delete(`${API}/coupons/admin/${id}`, { headers });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coupon deleted");
    } catch {}
  };

  if (!user) return null;

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen" style={{ background: "#0F172A" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <div
        className="w-64 flex-shrink-0 fixed left-0 top-0 bottom-0
                   z-40 flex flex-col border-r"
        style={{
          background:  "#0F172A",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="p-6 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="font-black text-xl text-white">
            Lens<span style={{ color: "#0EA5E9" }}>Kart</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Admin Panel
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => changeSection(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5
                         rounded-xl text-left text-sm font-medium
                         transition-all"
              style={{
                background:
                  section === item.id
                    ? "rgba(14,165,233,0.15)"
                    : "transparent",
                color:
                  section === item.id ? "#0EA5E9" : "#94A3B8",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Exit */}
        <div
          className="p-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-4 py-2.5
                       rounded-xl text-sm font-medium text-red-400
                       hover:bg-red-500/10 transition-colors"
          >
            🚪 Exit Admin
          </button>
        </div>
      </div>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <div className="flex-1 ml-64 overflow-auto">

        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-8 py-4
                     border-b sticky top-0 z-30"
          style={{
            background:  "#0F172A",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <h1 className="text-xl font-black text-white capitalize">
              {section}
            </h1>
            <p className="text-xs text-slate-500">
              LensKart Admin · {user.name}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center
                       justify-center font-black text-white text-sm"
            style={{
              background:
                "linear-gradient(135deg, #0EA5E9, #0284C7)",
            }}
          >
            {user.name[0].toUpperCase()}
          </div>
        </div>

        <div className="p-8">

          {/* ══════════════ DASHBOARD ══════════════ */}
          {section === "dashboard" && (
            <div>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                  {
                    label: "Total Revenue",
                    value: stats
                      ? `₹${(stats.totalRevenue / 100000).toFixed(1)}L`
                      : "—",
                    icon:  "💰",
                    color: "#10B981",
                  },
                  {
                    label: "Total Orders",
                    value: stats?.totalOrders  ?? "—",
                    icon:  "📦",
                    color: "#0EA5E9",
                  },
                  {
                    label: "Users",
                    value: stats?.totalUsers   ?? "—",
                    icon:  "👥",
                    color: "#8B5CF6",
                  },
                  {
                    label: "Products",
                    value: stats?.totalProducts ?? "—",
                    icon:  "👓",
                    color: "#F59E0B",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-5 border"
                    style={{
                      background:  "#1E293B",
                      borderColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center
                                 justify-center text-xl mb-3"
                      style={{ background: `${s.color}20` }}
                    >
                      {s.icon}
                    </div>
                    <div
                      className="text-2xl font-black text-white mb-0.5"
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-slate-400">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <div
                className="rounded-2xl p-6 border mb-6"
                style={{
                  background:  "#1E293B",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h3 className="font-bold text-white mb-4">
                  Revenue — Last 12 Months
                </h3>
                <div className="flex items-end gap-2 h-40">
                  {[40,60,45,80,65,90,55,75,85,70,95,100].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-lg cursor-pointer
                                   hover:opacity-80 transition-opacity"
                        style={{
                          height: `${h}%`,
                          background:
                            "linear-gradient(to top, #0EA5E9, rgba(14,165,233,0.4))",
                        }}
                      />
                    )
                  )}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  {MONTHS.map((m) => <span key={m}>{m}</span>)}
                </div>
              </div>

              {/* Recent Orders Table */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  background:  "#1E293B",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="flex items-center justify-between px-6
                             py-4 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <h3 className="font-bold text-white">Recent Orders</h3>
                  <button
                    onClick={() => changeSection("orders")}
                    className="text-xs text-sky-400 font-medium"
                  >
                    View All →
                  </button>
                </div>
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((o: any) => (
                    <div
                      key={o.id}
                      className="flex items-center gap-4 px-6 py-3
                                 border-b hover:bg-white/5 transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    >
                      <span className="text-sm font-mono text-sky-400">
                        #{o.orderNumber}
                      </span>
                      <span className="text-sm text-slate-300 flex-1">
                        {o.user?.name}
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-bold
                                   text-amber-400 bg-amber-400/10"
                      >
                        {o.status}
                      </span>
                      <span className="text-sm font-bold text-white">
                        ₹{o.total?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-10 text-center text-slate-500 text-sm">
                    No orders yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════ PRODUCTS ══════════════ */}
          {section === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Products
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">
                    {products.length} products in catalog
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="px-5 py-2.5 rounded-xl font-bold
                             text-white text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg,#0EA5E9,#0284C7)",
                  }}
                >
                  + Add Product
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <div
                  className="rounded-2xl p-6 border mb-6"
                  style={{
                    background:  "#1E293B",
                    borderColor: "rgba(14,165,233,0.3)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-white">
                      Add New Product
                    </h3>
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="text-slate-400 hover:text-white text-xl"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Product Name",       "name"],
                      ["Brand",              "brand"],
                      ["Price (₹)",          "price"],
                      ["Original Price (₹)", "originalPrice"],
                      ["SKU",                "sku"],
                      ["Gender",             "gender"],
                      ["Frame Shape",        "frameShape"],
                    ].map(([label, key]) => (
                      <div key={key}>
                        <label
                          className="text-xs font-bold text-slate-400
                                     uppercase tracking-wider mb-2 block"
                        >
                          {label}
                        </label>
                        <input
                          placeholder={`Enter ${label}`}
                          value={(newProduct as any)[key]}
                          onChange={(e) =>
                            setNewProduct((p) => ({
                              ...p,
                              [key]: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-xl text-sm
                                     outline-none"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border:     "1px solid rgba(255,255,255,0.08)",
                            color:      "white",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={addProduct}
                      className="px-6 py-2.5 rounded-xl font-bold
                                 text-white text-sm"
                      style={{
                        background:
                          "linear-gradient(135deg,#0EA5E9,#0284C7)",
                      }}
                    >
                      Save Product
                    </button>
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="px-6 py-2.5 rounded-xl font-bold
                                 text-slate-300 text-sm border"
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  background:  "#1E293B",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr
                      className="border-b"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      {["Product","Brand","Price","Stock","Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs
                                       font-bold text-slate-400
                                       uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          {[...Array(5)].map((_, j) => (
                            <td key={j} className="px-6 py-4">
                              <div
                                className="h-4 rounded"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center
                                     text-slate-500 text-sm"
                        >
                          No products found
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b hover:bg-white/5
                                     transition-colors"
                          style={{
                            borderColor: "rgba(255,255,255,0.04)",
                          }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex
                                           items-center justify-center
                                           text-2xl flex-shrink-0"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                              >
                                👓
                              </div>
                              <span
                                className="text-sm font-medium text-white
                                           truncate max-w-[160px]"
                              >
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {p.brand}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-white">
                            ₹{p.price?.toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                p.stock > 0
                                  ? "text-green-400 bg-green-400/10"
                                  : "text-red-400 bg-red-400/10"
                              }`}
                            >
                              {p.stock > 0
                                ? `${p.stock} in stock`
                                : "Out of stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                className="text-xs px-3 py-1.5 rounded-lg
                                           font-bold text-sky-400
                                           hover:bg-sky-400/10 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="text-xs px-3 py-1.5 rounded-lg
                                           font-bold text-red-400
                                           hover:bg-red-400/10 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════ ORDERS ══════════════ */}
          {section === "orders" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-6">
                All Orders
              </h2>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  background:  "#1E293B",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr
                      className="border-b"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      {["Order","Customer","Amount","Status","Action"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs
                                       font-bold text-slate-400
                                       uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center
                                     text-slate-500 text-sm"
                        >
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr
                          key={o.id}
                          className="border-b hover:bg-white/5 transition-colors"
                          style={{ borderColor: "rgba(255,255,255,0.04)" }}
                        >
                          <td className="px-6 py-4 font-mono text-sky-400 text-sm">
                            #{o.orderNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {o.user?.name}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-white">
                            ₹{o.total?.toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="text-xs font-bold px-3 py-1
                                         rounded-full text-amber-400
                                         bg-amber-400/10"
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={o.status}
                              onChange={(e) =>
                                updateOrderStatus(o.id, e.target.value)
                              }
                              className="text-xs px-2 py-1.5 rounded-lg outline-none cursor-pointer"
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                color:      "white",
                                border:     "1px solid rgba(255,255,255,0.1)",
                              }}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════ USERS ══════════════ */}
          {section === "users" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-6">
                User Management
              </h2>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  background:  "#1E293B",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr
                      className="border-b"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      {["User","Email","Role","Orders","Status","Action"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs
                                       font-bold text-slate-400
                                       uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-10 text-center
                                     text-slate-500 text-sm"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr
                          key={u.id}
                          className="border-b hover:bg-white/5 transition-colors"
                          style={{ borderColor: "rgba(255,255,255,0.04)" }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex
                                           items-center justify-center
                                           font-bold text-sm text-white
                                           flex-shrink-0"
                                style={{
                                  background:
                                    "linear-gradient(135deg,#0EA5E9,#0284C7)",
                                }}
                              >
                                {u.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-white truncate max-w-[120px]">
                                {u.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 truncate max-w-[160px]">
                            {u.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                                  ? "text-purple-400 bg-purple-400/10"
                                  : "text-slate-300 bg-white/10"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {u._count?.orders ?? 0}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                u.isActive
                                  ? "text-green-400 bg-green-400/10"
                                  : "text-red-400 bg-red-400/10"
                              }`}
                            >
                              {u.isActive ? "Active" : "Suspended"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleUser(u.id)}
                              className={`text-xs px-3 py-1.5 rounded-lg
                                          font-bold transition-colors ${
                                u.isActive
                                  ? "text-red-400 hover:bg-red-400/10"
                                  : "text-green-400 hover:bg-green-400/10"
                              }`}
                            >
                              {u.isActive ? "Suspend" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════ COUPONS ══════════════ */}
          {section === "coupons" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">
                  Coupons
                </h2>
                <button
                  onClick={createCoupon}
                  className="px-5 py-2.5 rounded-xl font-bold
                             text-white text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg,#0EA5E9,#0284C7)",
                  }}
                >
                  + Create Coupon
                </button>
              </div>

              {coupons.length === 0 ? (
                <div
                  className="text-center py-16 rounded-2xl border"
                  style={{
                    background:  "#1E293B",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="text-5xl mb-3">🎟️</div>
                  <p className="text-slate-500">No coupons yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-2xl p-5 border"
                      style={{
                        background:  "#1E293B",
                        borderColor: c.isActive
                          ? "rgba(14,165,233,0.3)"
                          : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            c.isActive
                              ? "text-green-400 bg-green-400/10"
                              : "text-red-400 bg-red-400/10"
                          }`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => deleteCoupon(c.id)}
                          className="text-xs text-red-400 hover:text-red-300 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="font-black text-2xl text-white mb-1">
                        {c.code}
                      </div>
                      <div
                        className="text-xl font-bold mb-3"
                        style={{ color: "#0EA5E9" }}
                      >
                        {c.discountType === "PERCENTAGE"
                          ? `${c.discountValue}% OFF`
                          : `₹${c.discountValue} OFF`}
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>
                          Uses: {c.usedCount}
                          {c.maxUses ? `/${c.maxUses}` : ""}
                        </div>
                        <div>Min order: ₹{c.minOrderValue}</div>
                        {c.expiresAt && (
                          <div>
                            Expires:{" "}
                            {new Date(c.expiresAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ ANALYTICS ══════════════ */}
          {section === "analytics" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-6">
                Analytics
              </h2>
              <div className="grid md:grid-cols-2 gap-6">

                {/* Revenue Chart */}
                <div
                  className="rounded-2xl p-6 border"
                  style={{
                    background:  "#1E293B",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <h3 className="font-bold text-white mb-4">
                    Monthly Revenue
                  </h3>
                  <div className="flex items-end gap-2 h-48">
                    {[40,65,50,80,70,90,60,85,75,95,88,100].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-lg hover:opacity-80 transition-opacity"
                          style={{
                            height: `${h}%`,
                            background:
                              "linear-gradient(to top, #0EA5E9, rgba(14,165,233,0.4))",
                          }}
                        />
                      )
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    {MONTHS.map((m) => <span key={m}>{m}</span>)}
                  </div>
                </div>

                {/* Key Metrics */}
                <div
                  className="rounded-2xl p-6 border"
                  style={{
                    background:  "#1E293B",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <h3 className="font-bold text-white mb-5">
                    Key Metrics
                  </h3>
                  <div className="space-y-4">
                    {[
                      ["Conversion Rate",  "3.8%",   "+0.4%",  true ],
                      ["Avg Order Value",  "₹2,840", "+₹180",  true ],
                      ["Cart Abandonment", "68%",    "-2.1%",  false],
                      ["Customer LTV",     "₹8,420", "+12%",   true ],
                    ].map(([k, v, ch, up]) => (
                      <div
                        key={String(k)}
                        className="flex items-center justify-between py-3 border-b"
                        style={{ borderColor: "rgba(255,255,255,0.06)" }}
                      >
                        <span className="text-sm text-slate-400">
                          {k}
                        </span>
                        <div className="text-right">
                          <div className="font-black text-white">
                            {v}
                          </div>
                          <div
                            className={`text-xs font-bold ${
                              up ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {ch}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Breakdown */}
                <div
                  className="rounded-2xl p-6 border md:col-span-2"
                  style={{
                    background:  "#1E293B",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <h3 className="font-bold text-white mb-5">
                    Sales by Category
                  </h3>
                  <div className="space-y-4">
                    {[
                      ["Eyeglasses",      42, "#0EA5E9"],
                      ["Sunglasses",      28, "#8B5CF6"],
                      ["Contact Lenses",  18, "#F59E0B"],
                      ["Kids",            12, "#EF4444"],
                    ].map(([cat, pct, color]) => (
                      <div key={String(cat)}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-300">{cat}</span>
                          <span className="font-bold" style={{ color: String(color) }}>
                            {pct}%
                          </span>
                        </div>
                        <div
                          className="h-2.5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width:      `${pct}%`,
                              background: String(color),
                            }}
                          />
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

