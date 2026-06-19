import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Grid2x2, LayoutGrid, X } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

const CATEGORIES = ["All", "Silk", "Banarasi", "Kanjivaram", "Cotton", "Designer", "Wedding"];
const FABRICS = ["All Fabrics", "Pure Silk", "Brocade Silk", "Georgette", "Cotton", "Tussar Silk", "Net", "Chanderi", "Organza"];
const OCCASIONS = ["All Occasions", "Wedding", "Festival", "Party", "Office", "Casual", "Bridal"];
const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Popular", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const PAGE_SIZE = 12;

export default function Collections() {
  const [searchQuery] = useSearch();
  const params = new URLSearchParams(searchQuery);
  const initCategory = params.get("category") || "All";
  const initFilter = params.get("filter") || "";

  const [category, setCategory] = useState(initCategory);
  const [fabric, setFabric] = useState("All Fabrics");
  const [occasion, setOccasion] = useState("All Occasions");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  const filtered = useMemo(() => {
    let list = [...products];
    if (initFilter === "new") list = list.filter((p) => p.isNewArrival);
    if (initFilter === "bestseller") list = list.filter((p) => p.isBestSeller);
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (fabric !== "All Fabrics") list = list.filter((p) => p.fabric.toLowerCase().includes(fabric.toLowerCase()));
    if (occasion !== "All Occasions") list = list.filter((p) => p.occasion.includes(occasion));
    list = list.filter((p) => p.discountedPrice >= priceRange[0] && p.discountedPrice <= priceRange[1]);

    if (sortBy === "price_asc") list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    else if (sortBy === "price_desc") list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    else if (sortBy === "popular") list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [category, fabric, occasion, priceRange, sortBy, initFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setCategory("All");
    setFabric("All Fabrics");
    setOccasion("All Occasions");
    setPriceRange([0, 30000]);
    setSortBy("latest");
    setPage(1);
  };

  const hasFilters = category !== "All" || fabric !== "All Fabrics" || occasion !== "All Occasions";

  return (
    <div className="min-h-screen bg-ivory pt-24" data-testid="page-collections">
      {/* Header */}
      <div className="bg-beige border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs text-gold uppercase tracking-[0.3em] font-poppins mb-1">Explore</p>
            <h1 className="text-3xl sm:text-4xl font-serif text-foreground">
              {initFilter === "new" ? "New Arrivals" : initFilter === "bestseller" ? "Best Sellers" : category !== "All" ? `${category} Sarees` : "All Collections"}
            </h1>
            <p className="text-sm text-muted-foreground font-poppins mt-1">
              {filtered.length} sarees found
            </p>
          </motion.div>

          {/* Category Quick Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 mt-5 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold font-poppins border transition-all ${
                  category === cat
                    ? "bg-maroon text-white border-maroon"
                    : "bg-white border-border text-foreground hover:border-maroon hover:text-maroon"
                }`}
                data-testid={`filter-category-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2 text-sm font-poppins hover:border-maroon transition-colors"
              data-testid="toggle-filters"
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasFilters && (
                <span className="bg-maroon text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">!</span>
              )}
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-maroon font-poppins hover:underline"
                data-testid="clear-filters"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-1">
              <button onClick={() => setGridCols(4)} className={`p-1.5 rounded-lg transition-colors ${gridCols === 4 ? "bg-maroon text-white" : "text-muted-foreground hover:text-maroon"}`} data-testid="grid-4">
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setGridCols(2)} className={`p-1.5 rounded-lg transition-colors ${gridCols === 2 ? "bg-maroon text-white" : "text-muted-foreground hover:text-maroon"}`} data-testid="grid-2">
                <Grid2x2 size={16} />
              </button>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="appearance-none bg-white border border-border rounded-xl px-4 py-2 pr-8 text-sm font-poppins outline-none focus:border-maroon cursor-pointer"
                data-testid="sort-select"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl border border-border p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Fabric */}
                <div>
                  <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider mb-2 block">Fabric</label>
                  <div className="flex flex-wrap gap-1.5">
                    {FABRICS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFabric(f)}
                        className={`px-3 py-1 rounded-full text-xs font-poppins border transition-all ${
                          fabric === f ? "bg-maroon text-white border-maroon" : "border-border text-foreground hover:border-maroon"
                        }`}
                        data-testid={`filter-fabric-${f.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Occasion */}
                <div>
                  <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider mb-2 block">Occasion</label>
                  <div className="flex flex-wrap gap-1.5">
                    {OCCASIONS.map((o) => (
                      <button
                        key={o}
                        onClick={() => setOccasion(o)}
                        className={`px-3 py-1 rounded-full text-xs font-poppins border transition-all ${
                          occasion === o ? "bg-maroon text-white border-maroon" : "border-border text-foreground hover:border-maroon"
                        }`}
                        data-testid={`filter-occasion-${o.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price Range */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground font-poppins uppercase tracking-wider mb-2 block">
                    Price Range: ₹{priceRange[0].toLocaleString()} — ₹{priceRange[1].toLocaleString()}
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="range"
                      min={0}
                      max={30000}
                      step={500}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="flex-1 accent-maroon"
                      data-testid="price-range-slider"
                    />
                  </div>
                  <div className="flex gap-3 mt-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="w-28 bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-poppins outline-none focus:border-maroon"
                      data-testid="price-min-input"
                    />
                    <span className="text-muted-foreground text-sm self-center">—</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="w-28 bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-poppins outline-none focus:border-maroon"
                      data-testid="price-max-input"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-foreground mb-2">No sarees found</p>
            <p className="text-sm text-muted-foreground font-poppins mb-4">Try adjusting your filters</p>
            <button onClick={clearFilters} className="bg-maroon text-white rounded-full px-6 py-2.5 text-sm font-poppins font-semibold" data-testid="no-results-clear">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${gridCols === 4 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}>
            {paginated.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-border text-sm font-poppins disabled:opacity-40 hover:border-maroon hover:text-maroon transition-colors"
              data-testid="pagination-prev"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-poppins font-semibold transition-colors ${
                  page === i + 1 ? "bg-maroon text-white" : "border border-border hover:border-maroon hover:text-maroon"
                }`}
                data-testid={`pagination-page-${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-border text-sm font-poppins disabled:opacity-40 hover:border-maroon hover:text-maroon transition-colors"
              data-testid="pagination-next"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
