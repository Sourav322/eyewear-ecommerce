// src/app/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

type Section =
  | "overview"
  | "orders"
  | "prescriptions"
  | "addresses"
  | "wishlist"
  | "profile";

const NAV_ITEMS = [
  { id: "overview",      label: "Overview",      icon: "🏠" },
  { id: "orders",        label: "My Orders",     icon: "📦" },
  { id: "prescriptions", label: "Prescriptions", icon: "💊" },
  { id: "wishlist",      label: "Wishlist",      icon: "❤️" },
  { id: "addresses",     label: "Addresses",     icon: "📍" },
  { id: "profile",       label: "Profile",       icon: "👤" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  DELIVERED:  "text-green-600 bg-green-50",
  SHIPPED:    "text-blue-600 bg-blue-50",
  PROCESSING: "text-amber-600 bg-amber-50",
  CONFIRMED:  "text-sky-600 bg-sky-50",
  PENDING:    "text-orange-600 bg-orange-50",
  CANCELLED:  "text-red-600 bg-red-50",
};

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [section, setSection]             = useState<Section>("overview");
  const [orders, setOrders]               = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [addresses, setAddresses]         = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showRxForm, setShowRxForm]       = useState(false);
  const [showAddrForm, setShowAddrForm]   = useState(false);

  const [profileForm, setProfileForm] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: "",
  });

  const [rxForm, setRxForm] = useState({
    name: "",
    rightSPH: "", rightCYL: "", rightAXIS: "", rightADD: "",
    leftSPH:  "", leftCYL:  "", leftAXIS:  "", leftADD:  "",
  });

  const [addrForm, setAddrForm] = useState({
    name: "", phone: "", line1: "", line2: "",
    city: "", state: "", pincode: "", isDefault: false,
  });

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) router.push("/auth");
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoadingOrders(true);
    axios.get(`${API}/orders/my`, { headers })
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [token]);

  useEffect(() => {
    if (!token || section !== "prescriptions") return;
    axios.get(`${API}/prescriptions`, { headers })
      .then(({ data }) => setPrescriptions(data.prescriptions || []))
      .catch(() => {});
  }, [token, section]);

  useEffect(() => {
    if (!token || section !== "addresses") return;
    axios.get(`${API}/users/addresses`, { headers })
      .then(({ data }) => setAddresses(data.addresses || []))
      .catch(() => {});
  }, [token, section]);

  const savePrescription = async () => {
    try {
      await axios.post(`${API}/prescriptions`, rxForm, { headers });
      toast.success("Prescription saved!");
      setShowRxForm(false);
      const { data } = await axios.get(`${API}/prescriptions`, { headers });
      setPrescriptions(data.prescriptions || []);
    } catch {
      toast.error("Failed to save");
    }
  };

  const deletePrescription = async (id: string) => {
    if (!confirm("Delete this prescription?")) return;
    try {
      await axios.delete(`${API}/prescriptions/${id}`, { headers });
      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const saveAddress = async () => {
    try {
      await axios.post(`${API}/users/addresses`, addrForm, { headers });
      toast.success("Address saved!");
      setShowAddrForm(false);
      const { data } = await axios.get(`${API}/users/addresses`, { headers });
      setAddresses(data.addresses || []);
    } catch {
      toast.error("Failed to save address");
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put(`${API}/users/profile`, profileForm, { headers });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update");
    }
  };

  const cancelOrder = async (id: string) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await axios.put(`${API}/orders/${id}/cancel`, {}, { headers });
      setOrders((prev) =>
        prev.map((o) => o.id === id ? { ...o, status: "CANCELLED" } : o)
      );
      toast.success("Order cancelled");
    } catch {
      toast.error("Cannot cancel");
    }
  };

  if (!user) return null;

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const delivered  = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="pt-20 min-h-screen" style={{ background: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-8 flex-col md:flex-row">

          {/* ── SIDEBAR ───────────────────────────────────────── */}
          <div className="w-full md:w-72 flex-shrink-0">
            {/* User Card */}
            <div
              className="bg-white rounded-2xl p-6 border border-slate-100
                         mb-4 text-center"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center
                           justify-center text-3xl font-black text-white
                           mx-auto mb-3"
                style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)" }}
              >
                {user.name[0].toUpperCase()}
              </div>
              <h3 className="font-black text-slate-900 text-lg">{user.name}</h3>
              <p className="text-sm text-slate-400 mt-0.5 truncate">{user.email}</p>
              <div
                className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold inline-block"
                style={{ background: "#E0F2FE", color: "#0EA5E9" }}
              >
                ✓ Verified Member
              </div>
            </div>

            {/* Nav */}
            <div
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5
                             text-left text-sm font-medium transition-all
                             border-l-2 hover:bg-slate-50"
                  style={{
                    borderColor: section === item.id ? "#0EA5E9" : "transparent",
                    background:  section === item.id ? "#F0F9FF" : "transparent",
                    color:       section === item.id ? "#0EA5E9" : "#64748B",
                  }}
                >
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
              {["ADMIN","SUPER_ADMIN"].includes(user.role) && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm
                             font-medium text-purple-600 hover:bg-purple-50
                             transition-colors border-t border-slate-50"
                >
                  <span>🔧</span> Admin Panel
                </Link>
              )}
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="w-full flex items-center gap-3 px-5 py-3.5
                           text-sm font-medium text-red-400 hover:bg-red-50
                           transition-colors border-t border-slate-50"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>

          {/* ── CONTENT ───────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* OVERVIEW */}
            {section === "overview" && (
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Welcome back, {user.name.split(" ")[0]}! 👋
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                  {[
                    { label: "Total Orders", value: orders.length,  icon: "📦", color: "#0EA5E9" },
                    { label: "Delivered",    value: delivered,       icon: "✅", color: "#10B981" },
                    { label: "Total Spent",  value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: "💰", color: "#8B5CF6", small: true },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-white rounded-2xl p-5 border border-slate-100"
                      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl mb-3"
                        style={{ background: `${s.color}18` }}>{s.icon}</div>
                      <div className="font-black mb-0.5"
                        style={{ color: s.color, fontSize: (s as any).small ? "18px" : "28px" }}>
                        {s.value}
                      </div>
                      <div className="text-sm text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div
                  className="bg-white rounded-2xl border border-slate-100"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                    <h3 className="font-bold text-slate-900">Recent Orders</h3>
                    <button onClick={() => setSection("orders")}
                      className="text-sm text-sky-500 font-medium hover:text-sky-700">
                      View All →
                    </button>
                  </div>
                  {loadingOrders ? (
                    <div className="p-6 space-y-3">
                      {[1,2,3].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-5xl mb-3">📦</div>
                      <p className="text-slate-500 font-medium mb-4">No orders yet</p>
                      <Link href="/shop"
                        className="inline-block px-5 py-2.5 rounded-full text-sm font-bold text-white"
                        style={{ background: "#0EA5E9" }}>
                        Start Shopping
                      </Link>
                    </div>
                  ) : orders.slice(0, 5).map((o) => (
                    <div key={o.id}
                      className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-b-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: "#f0f9ff" }}>👓</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate">
                          {o.items?.[0]?.product?.name || "Order"}
                          {o.items?.length > 1 && ` +${o.items.length - 1} more`}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          #{o.orderNumber} · {new Date(o.createdAt).toLocaleDateString("en-IN")}
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[o.status] || "text-slate-600 bg-slate-50"}`}>
                        {o.status}
                      </span>
                      <span className="font-black text-slate-900 flex-shrink-0">
                        ₹{o.total?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ORDERS */}
            {section === "orders" && (
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">My Orders</h2>
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[1,2,3].map((i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No orders yet</h3>
                    <Link href="/shop"
                      className="inline-block mt-4 px-6 py-2.5 rounded-full text-sm font-bold text-white"
                      style={{ background: "#0EA5E9" }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o.id}
                        className="bg-white rounded-2xl p-6 border border-slate-100"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl flex-shrink-0"
                            style={{ background: "#f0f9ff" }}>👓</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-slate-900 truncate">
                                {o.items?.[0]?.product?.name || "Order"}
                                {o.items?.length > 1 && ` +${o.items.length - 1} more`}
                              </h3>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[o.status] || "text-slate-600 bg-slate-50"}`}>
                                {o.status}
                              </span>
                            </div>
                            <div className="text-sm text-slate-400 mt-1">
                              #{o.orderNumber} · {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                            </div>
                            <div className="font-black text-slate-900 text-lg mt-1">
                              ₹{o.total?.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50 flex-wrap">
                          <button className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-colors">
                            Track Order
                          </button>
                          {o.status === "DELIVERED" && (
                            <>
                              <button className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-colors">
                                Reorder
                              </button>
                              <button className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-colors">
                                Download Invoice
                              </button>
                            </>
                          )}
                          {["PENDING","CONFIRMED"].includes(o.status) && (
                            <button onClick={() => cancelOrder(o.id)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 border border-red-100 hover:bg-red-50 transition-colors">
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PRESCRIPTIONS */}
            {section === "prescriptions" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-slate-900">My Prescriptions</h2>
                  <button onClick={() => setShowRxForm(!showRxForm)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: "#0EA5E9" }}>
                    + Add New
                  </button>
                </div>

                {showRxForm && (
                  <div className="bg-white rounded-2xl p-6 border border-sky-200 mb-6"
                    style={{ boxShadow: "0 2px 12px rgba(14,165,233,0.1)" }}>
                    <h3 className="font-bold text-slate-900 mb-4">New Prescription</h3>
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Name</label>
                      <input value={rxForm.name}
                        onChange={(e) => setRxForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. My Prescription 2025"
                        className="input-base" />
                    </div>
                    {[
                      { label: "Right Eye (OD)", fields: [["SPH","rightSPH"],["CYL","rightCYL"],["AXIS","rightAXIS"],["ADD","rightADD"]] },
                      { label: "Left Eye (OS)",  fields: [["SPH","leftSPH"], ["CYL","leftCYL"], ["AXIS","leftAXIS"], ["ADD","leftADD"]] },
                    ].map((eye) => (
                      <div key={eye.label} className="mb-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{eye.label}</label>
                        <div className="grid grid-cols-4 gap-2">
                          {eye.fields.map(([label, key]) => (
                            <div key={key}>
                              <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                              <input type="number" step="0.25" placeholder="0.00"
                                value={(rxForm as any)[key]}
                                onChange={(e) => setRxForm((f) => ({ ...f, [key]: e.target.value }))}
                                className="w-full px-2 py-2 rounded-lg border border-slate-200 text-sm text-center font-mono outline-none focus:border-sky-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 mt-4">
                      <button onClick={savePrescription}
                        className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                        style={{ background: "#0EA5E9" }}>Save Prescription</button>
                      <button onClick={() => setShowRxForm(false)}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-500 text-sm border border-slate-200 hover:bg-slate-50">Cancel</button>
                    </div>
                  </div>
                )}

                {prescriptions.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                    <div className="text-5xl mb-3">💊</div>
                    <p className="text-slate-500 font-medium">No prescriptions saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((p) => (
                      <div key={p.id}
                        className="bg-white rounded-2xl p-6 border border-slate-100"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-slate-900">{p.name || "Prescription"}</h3>
                            <p className="text-sm text-slate-400 mt-0.5">
                              Added {new Date(p.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <button onClick={() => deletePrescription(p.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 border border-red-100 hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "RIGHT EYE (OD)", fields: [["SPH",p.rightSPH],["CYL",p.rightCYL],["AXIS",p.rightAXIS],["ADD",p.rightADD]] },
                            { label: "LEFT EYE (OS)",  fields: [["SPH",p.leftSPH], ["CYL",p.leftCYL], ["AXIS",p.leftAXIS], ["ADD",p.leftADD]] },
                          ].map((eye) => (
                            <div key={eye.label}>
                              <p className="text-xs font-bold text-slate-400 mb-2">{eye.label}</p>
                              <div className="grid grid-cols-4 gap-1">
                                {eye.fields.map(([k, v]) => (
                                  <div key={String(k)} className="p-2 rounded-xl text-center" style={{ background: "#E0F2FE" }}>
                                    <div className="text-xs text-slate-400">{k}</div>
                                    <div className="font-black font-mono text-sm" style={{ color: "#0EA5E9" }}>{v ?? "—"}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES */}
            {section === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-slate-900">My Addresses</h2>
                  <button onClick={() => setShowAddrForm(!showAddrForm)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: "#0EA5E9" }}>
                    + Add Address
                  </button>
                </div>

                {showAddrForm && (
                  <div className="bg-white rounded-2xl p-6 border border-sky-200 mb-6">
                    <h3 className="font-bold text-slate-900 mb-4">New Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: "name",    label: "Full Name",    span: true  },
                        { key: "phone",   label: "Phone",        span: false },
                        { key: "pincode", label: "Pincode",      span: false },
                        { key: "line1",   label: "Address Line 1", span: true },
                        { key: "line2",   label: "Address Line 2 (Optional)", span: true },
                        { key: "city",    label: "City",         span: false },
                        { key: "state",   label: "State",        span: false },
                      ].map(({ key, label, span }) => (
                        <div key={key} className={span ? "sm:col-span-2" : ""}>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{label}</label>
                          <input value={(addrForm as any)[key]}
                            onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))}
                            placeholder={`Enter ${label}`}
                            className="input-base" />
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 mt-4 cursor-pointer">
                      <input type="checkbox" checked={addrForm.isDefault}
                        onChange={(e) => setAddrForm((f) => ({ ...f, isDefault: e.target.checked }))}
                        className="accent-sky-500" />
                      <span className="text-sm text-slate-600 font-medium">Set as default address</span>
                    </label>
                    <div className="flex gap-3 mt-5">
                      <button onClick={saveAddress}
                        className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                        style={{ background: "#0EA5E9" }}>Save Address</button>
                      <button onClick={() => setShowAddrForm(false)}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-500 text-sm border border-slate-200">Cancel</button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                    <div className="text-5xl mb-3">📍</div>
                    <p className="text-slate-500 font-medium">No addresses saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((a) => (
                      <div key={a.id}
                        className="bg-white rounded-2xl p-5 border-2 transition-all"
                        style={{ borderColor: a.isDefault ? "#0EA5E9" : "#E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                        <div className="flex items-start justify-between">
                          <div>
                            {a.isDefault && (
                              <span className="text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block"
                                style={{ background: "#E0F2FE", color: "#0EA5E9" }}>✓ Default</span>
                            )}
                            <h3 className="font-bold text-slate-900">{a.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">
                              {a.line1}{a.line2 && `, ${a.line2}`}
                            </p>
                            <p className="text-sm text-slate-500">{a.city}, {a.state} — {a.pincode}</p>
                            <p className="text-sm text-slate-500">📱 {a.phone}</p>
                          </div>
                          <button className="text-xs text-red-400 font-bold hover:text-red-600">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE */}
            {section === "profile" && (
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Profile Settings</h2>
                <div className="bg-white rounded-2xl p-6 border border-slate-100"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white"
                      style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)" }}>
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{user.name}</h3>
                      <p className="text-sm text-slate-400">
                        Member since {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-5">
                    {[
                      { key: "name",  label: "Full Name",      type: "text",  placeholder: "Enter your name"  },
                      { key: "email", label: "Email Address",  type: "email", placeholder: "Enter your email" },
                      { key: "phone", label: "Phone Number",   type: "tel",   placeholder: "+91 98765 43210"  },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key}>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{label}</label>
                        <input type={type}
                          value={(profileForm as any)[key]}
                          onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="input-base" />
                      </div>
                    ))}
                  </div>
                  <button onClick={updateProfile}
                    className="mt-6 px-8 py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: "#0EA5E9" }}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* WISHLIST */}
            {section === "wishlist" && (
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">My Wishlist</h2>
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                  <div className="text-5xl mb-3">❤️</div>
                  <p className="text-slate-500 font-medium mb-4">View your saved items</p>
                  <Link href="/wishlist"
                    className="inline-block px-6 py-2.5 rounded-full text-sm font-bold text-white"
                    style={{ background: "#0EA5E9" }}>
                    Go to Wishlist →
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

