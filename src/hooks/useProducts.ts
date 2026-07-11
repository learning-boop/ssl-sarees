import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { products as staticProducts } from "@/data/products";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
    placeholderData: staticProducts,   // ← was initialData
    staleTime: 30_000,
  });
}