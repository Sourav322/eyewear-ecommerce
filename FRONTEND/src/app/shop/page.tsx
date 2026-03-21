// src/app/shop/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL;

const SHAPES = [
  "All", "Aviator", "Wayfarer", "Round",
  "Rectangle", "Cat Eye", "Geometric", "Browline",
];

const MATERIALS = ["All", "Metal", "Acetate", "TR90", "Titanium"];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1, pages: 1, total: 0,
  });

  const [filters, setFilters] = useState({
    priceMax:  10000,
    shape:     "All",
    gender:    "All",
    material:  "All",
    sort:      "createdAt",
    page:      1,
  });

  const category = searchParams.get("category") || "";
  const search   = searchParams.get("search")   || "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        limit:    12,
        page:     filters.page,
        sort:     filters.sort,
        maxPrice: filters.priceMax,
      };
      if (category)                   params.category = category;
      if (search)                     params.search   = search;
      if (filters.shape !== "All")    params.shape    = filters.shape;
      if (filters.gender !== "All")   params.gender   = filters.gender;
      if (filters.material !== "All") params.material = filters.material;

      const { data } = await axios.get(
        `${API}/products`, { params }
      );
      setProducts(data.products || []);
      setPagination(
        data.pagination || { page: 1, pages: 1, total: 0 }
      );
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetFilters = () => {
    setFilters({
      priceMax: 10000,
      shape:    "All",
      gender:   "All",
      material: "All",
      sort:     "createdAt",
      page:     1,
    });
  };

  const title = category
    ? category
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : search
    ? `Results for "${search}"`
    : "All Eyewear";

  return (
    <div
      className="pt-20 min-h-screen"
      style={{ background: "#F8FAFC" }}
    >
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center
                        justify-between flex-wrap gap-3">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm
                            text-slate-400 mb-1">
              <a href="/" className="hover:text-sky-500">Home</a>
              <span>/</span>
              <span className="text-slate-700 font-medium">
                {title}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {title}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {pagination.total} products found
            </p>
          </div>

          {/* Sort + Filter Toggle */}
          <div className="flex items-center gap-3">
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  sort: e.target.value,
                  page: 1,
                }))
              }
              className="px-4 py-2 rounded-xl border border-slate-200
                         text-sm bg-white font-medium outline-none
                         cursor-pointer"
            >
              <option value="createdAt">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2
                         rounded-xl border border-slate-200 text-sm
                         bg-white font-medium"
            >
              🔧 {showFilters ? "Hide" : "Filters"}
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* ── SIDEBAR FILTERS ──────────────────────────────── */}
          <aside
            className={`
              ${showFilters ? "block" : "hidden"} md:block
              w-64 flex-shrink-0
            `}
          >
            <div
              className="bg-white rounded-2xl p-6 border
                         border-slate-100 sticky top-24"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-sky-500
                             hover:text-sky-700 transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400
                                  uppercase tracking-wider mb-3 block">
                  Price Range
                </label>
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={100}
                  value={filters.priceMax}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      priceMax: +e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm
                                font-medium text-slate-700">
                  <span>₹500</span>
                  <span
                    className="font-bold"
                    style={{ color: "#0EA5E9" }}
                  >
                    ₹{filters.priceMax.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Frame Shape */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400
                                  uppercase tracking-wider mb-3 block">
                  Frame Shape
                </label>
                <div className="flex flex-wrap gap-2">
                  {SHAPES.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          shape: s,
                          page: 1,
                        }))
                      }
                      className="px-3 py-1.5 rounded-full text-xs
                                 font-medium border transition-all"
                      style={{
                        background:
                          filters.shape === s ? "#0EA5E9" : "white",
                        color:
                          filters.shape === s ? "white" : "#64748B",
                        borderColor:
                          filters.shape === s ? "#0EA5E9" : "#E2E8F0",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400
                                  uppercase tracking-wider mb-3 block">
                  Gender
                </label>
                {["All", "Men", "Women", "Unisex", "Kids"].map((g) => (
                  <label
                    key={g}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        gender: g,
                        page: 1,
                      }))
                    }
                    className="flex items-center gap-3 py-2
                               cursor-pointer"
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2
                                 flex items-center justify-center
                                 transition-all flex-shrink-0"
                      style={{
                        borderColor:
                          filters.gender === g
                            ? "#0EA5E9"
                            : "#E2E8F0",
                      }}
                    >
                      {filters.gender === g && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: "#0EA5E9" }}
                        />
                      )}
                    </div>
                    <span className="text-sm text-slate-700">{g}</span>
                  </label>
                ))}
              </div>

              {/* Frame Material */}
              <div>
                <label className="text-xs font-bold text-slate-400
                                  uppercase tracking-wider mb-3 block">
                  Material
                </label>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          material: m,
                          page: 1,
                        }))
                      }
                      className="px-3 py-1.5 rounded-full text-xs
                                 font-medium border transition-all"
                      style={{
                        background:
                          filters.material === m ? "#0EA5E9" : "white",
                        color:
                          filters.material === m ? "white" : "#64748B",
                        borderColor:
                          filters.material === m
                            ? "#0EA5E9"
                            : "#E2E8F0",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── PRODUCT GRID ─────────────────────────────────── */}
          <div className="flex-1">
            {loading ? (
              /* Skeleton */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(12)].map((_, i) => (
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
                      <div className="skeleton h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div
                className="text-center py-20 bg-white rounded-2xl
                           border border-slate-100"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  No products found
                </h3>
                <p className="text-slate-400 mb-6">
                  Try adjusting your filters
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full text-sm
                             font-bold text-white"
                  style={{ background: "#0EA5E9" }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Products */}
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-5"
                >
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10
                                  flex-wrap">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            page: i + 1,
                          }))
                        }
                        className="w-10 h-10 rounded-xl text-sm
                                   font-bold transition-all border"
                        style={{
                          background:
                            filters.page === i + 1
                              ? "#0EA5E9"
                              : "white",
                          color:
                            filters.page === i + 1
                              ? "white"
                              : "#64748B",
                          borderColor:
                            filters.page === i + 1
                              ? "#0EA5E9"
                              : "#E2E8F0",
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
            }
