import type { Product } from "@/data/products";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

function getToken(): string | null {
  return localStorage.getItem("ssl_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      // Don't set Content-Type for FormData — the browser sets it
      // automatically (including the required multipart boundary).
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}

// ---- Auth ----
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ user: AuthUser }>("/auth/me"),
};

// ---- Upload ----
export const uploadApi = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return request<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
    });
  },
};

// ---- Cart ----
export interface CartItemDTO {
  product: Product;
  quantity: number;
}

export const cartApi = {
  get: () => request<{ items: CartItemDTO[] }>("/cart"),

  add: (productId: string, quantity = 1) =>
    request<{ items: CartItemDTO[] }>("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  setQuantity: (productId: string, quantity: number) =>
    request<{ items: CartItemDTO[] }>(`/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  remove: (productId: string) =>
    request<{ items: CartItemDTO[] }>(`/cart/${productId}`, { method: "DELETE" }),

  clear: () => request<{ items: CartItemDTO[] }>("/cart", { method: "DELETE" }),
};

// ---- Wishlist ----
export const wishlistApi = {
  get: () => request<{ items: Product[] }>("/wishlist"),

  add: (productId: string) =>
    request<{ items: Product[] }>(`/wishlist/${productId}`, { method: "POST" }),

  remove: (productId: string) =>
    request<{ items: Product[] }>(`/wishlist/${productId}`, { method: "DELETE" }),
};

// ---- Products ----
export const productsApi = {
  list: (category?: string) =>
    request<Product[]>(`/products${category ? `?category=${encodeURIComponent(category)}` : ""}`),

  get: (id: string) => request<Product>(`/products/${id}`),

  create: (product: Omit<Product, "id">) =>
    request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id: string, product: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  remove: (id: string) =>
    request<{ message: string }>(`/products/${id}`, { method: "DELETE" }),
};

// ---- Orders ----
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItemDTO {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItemDTO[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderInput {
  customer: OrderDTO["customer"];
  items: OrderItemDTO[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

export const ordersApi = {
  create: (order: CreateOrderInput) =>
    request<{ order: OrderDTO }>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  my: () => request<{ orders: OrderDTO[] }>("/orders/my"),

  listAll: () => request<{ orders: OrderDTO[] }>("/orders"),

  updateStatus: (id: string, status: OrderStatus) =>
    request<{ order: OrderDTO }>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};
