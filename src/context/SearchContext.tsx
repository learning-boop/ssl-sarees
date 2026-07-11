import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { products, type Product } from "@/data/products";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  results: Product[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSetQuery = useCallback((q: string) => {
    setQuery(q);
    setIsOpen(q.length > 0);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.occasion.some((o) => o.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <SearchContext.Provider
      value={{ query, setQuery: handleSetQuery, results, isOpen, setIsOpen }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
