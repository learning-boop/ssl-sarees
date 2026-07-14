import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, X, Upload, Loader2, LayoutDashboard, Package, ShoppingBag, LogOut, IndianRupee, Clock, CheckCircle2, Eye } from "lucide-react";
import { productsApi, uploadApi, ordersApi, type OrderDTO, type OrderStatus } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CATEGORIES = ["Silk", "Banarasi", "Kanjivaram", "Cotton", "Designer", "Wedding"] as const;

interface ProductFormValues {
  name: string;
  category: (typeof CATEGORIES)[number];
  fabric: string;
  color: string;
  price: number;
  discountedPrice: number;
  discount: number;
  description: string;
  occasion: string; // comma-separated in the form, split into array on submit
  images: string; // comma-separated URLs in the form, split into array on submit
  specifications: string; // "Key: Value" per line in the form
  shippingCharge: number;
  stockQuantity: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  inStock: boolean;
}

function productToForm(p?: Product): ProductFormValues {
  return {
    name: p?.name || "",
    category: (p?.category as ProductFormValues["category"]) || "Silk",
    fabric: p?.fabric || "",
    color: p?.color || "",
    price: p?.price ?? 0,
    discountedPrice: p?.discountedPrice ?? 0,
    discount: p?.discount ?? 0,
    description: p?.description || "",
    occasion: p?.occasion?.join(", ") || "",
    images: p?.images?.join(", ") || "",
    specifications: p?.specifications
      ? Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`).join("\n")
      : "",
    shippingCharge: p?.shippingCharge ?? 199,
    stockQuantity: p?.stockQuantity ?? 10,
    isNewArrival: p?.isNewArrival ?? false,
    isBestSeller: p?.isBestSeller ?? false,
    isTrending: p?.isTrending ?? false,
    inStock: p?.inStock ?? true,
  };
}

function formToPayload(values: ProductFormValues) {
  const specifications: Record<string, string> = {};
  values.specifications
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(":");
      if (key && rest.length) specifications[key.trim()] = rest.join(":").trim();
    });

  return {
    name: values.name,
    category: values.category,
    fabric: values.fabric,
    color: values.color,
    price: Number(values.price),
    discountedPrice: Number(values.discountedPrice),
    discount: Number(values.discount),
    description: values.description,
    occasion: values.occasion.split(",").map((s) => s.trim()).filter(Boolean),
    images: values.images.split(",").map((s) => s.trim()).filter(Boolean),
    specifications,
    shippingCharge: Number(values.shippingCharge),
    stockQuantity: Number(values.stockQuantity),
    isNewArrival: values.isNewArrival,
    isBestSeller: values.isBestSeller,
    isTrending: values.isTrending,
    inStock: values.inStock,
    rating: 0,
    reviews: 0,
  };
}

function ProductFormDialog({
  open,
  onOpenChange,
  editingProduct,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
}) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormValues>({
    values: productToForm(editingProduct || undefined),
  });

  // Images are managed as a real list (populated by uploads), kept in
  // sync with the hidden "images" form field so formToPayload still works.
  const [imageList, setImageList] = useState<string[]>(editingProduct?.images || []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const initial = editingProduct?.images || [];
    setImageList(initial);
    setValue("images", initial.join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct, open]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const { url } = await uploadApi.image(file);
        uploaded.push(url);
      }
      const next = [...imageList, ...uploaded];
      setImageList(next);
      setValue("images", next.join(", "));
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file later
    }
  };

  const removeImage = (url: string) => {
    const next = imageList.filter((img) => img !== url);
    setImageList(next);
    setValue("images", next.join(", "));
  };

  const createMutation = useMutation({
    mutationFn: (values: ProductFormValues) => productsApi.create(formToPayload(values) as Omit<Product, "id">),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: ProductFormValues) =>
      productsApi.update(editingProduct!.id, formToPayload(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
  });

  const submitting = createMutation.isPending || updateMutation.isPending;
  const errorMessage = (createMutation.error as Error)?.message || (updateMutation.error as Error)?.message;

  const onSubmit = (values: ProductFormValues) => {
    if (editingProduct) updateMutation.mutate(values);
    else createMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3 font-poppins" data-testid="product-form-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-poppins text-sm" data-testid="product-form">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-foreground">Name</label>
              <input className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-name-input"
                {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-foreground">Category</label>
              <select className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-category-select"
                {...register("category", { required: true })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-foreground">Fabric</label>
              <input className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-fabric-input"
                {...register("fabric", { required: "Fabric is required" })} />
            </div>
            <div>
              <label className="block mb-1 text-foreground">Color</label>
              <input className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-color-input"
                {...register("color", { required: "Color is required" })} />
            </div>
            <div>
              <label className="block mb-1 text-foreground">Price (₹)</label>
              <input type="number" step="0.01" className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-price-input"
                {...register("price", { required: true, valueAsNumber: true, min: 0 })} />
            </div>
            <div>
              <label className="block mb-1 text-foreground">Discounted Price (₹)</label>
              <input type="number" step="0.01" className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-discounted-price-input"
                {...register("discountedPrice", { required: true, valueAsNumber: true, min: 0 })} />
            </div>
            <div>
              <label className="block mb-1 text-foreground">Discount (%)</label>
              <input type="number" className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-discount-input"
                {...register("discount", { valueAsNumber: true, min: 0, max: 100 })} />
            </div>
            <div>
              <label className="block mb-1 text-foreground">Shipping Charge (₹)</label>
              <input type="number" className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-shipping-input"
                {...register("shippingCharge", { required: true, valueAsNumber: true, min: 0 })} />
              <p className="text-[11px] text-muted-foreground mt-1">0 = free shipping for this product</p>
            </div>
            <div>
              <label className="block mb-1 text-foreground">Stock Quantity</label>
              <input type="number" className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-stock-input"
                {...register("stockQuantity", { required: true, valueAsNumber: true, min: 0 })} />
              <p className="text-[11px] text-muted-foreground mt-1">Reduces automatically with each order</p>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-foreground">Occasions (comma-separated)</label>
            <input className="w-full rounded-lg border border-black/10 px-3 py-2" placeholder="Wedding, Festival, Party" data-testid="product-occasion-input"
              {...register("occasion")} />
          </div>

          <div>
            <label className="block mb-1 text-foreground">Product Images</label>

            {imageList.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {imageList.map((url) => (
                  <div key={url} className="relative w-20 h-24 rounded-lg overflow-hidden border border-black/10">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-red-600"
                      data-testid={`remove-image-${url}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-black/20 text-sm cursor-pointer hover:border-maroon hover:text-maroon transition-colors">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading..." : "Upload Image(s)"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
                data-testid="product-image-file-input"
              />
            </label>

            {/* Hidden field so react-hook-form still tracks/validates images */}
            <input type="hidden" {...register("images", { required: "At least one image is required" })} />
            {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
            {errors.images && <p className="text-xs text-red-600 mt-1">{errors.images.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-foreground">Description</label>
            <textarea rows={3} className="w-full rounded-lg border border-black/10 px-3 py-2" data-testid="product-description-input"
              {...register("description")} />
          </div>

          <div>
            <label className="block mb-1 text-foreground">Specifications (one "Key: Value" per line)</label>
            <textarea rows={3} className="w-full rounded-lg border border-black/10 px-3 py-2 font-mono text-xs"
              placeholder={"Length: 6.3m\nBlouse: Included\nWash Care: Dry Clean"} data-testid="product-specifications-input"
              {...register("specifications")} />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" data-testid="product-new-arrival-checkbox" {...register("isNewArrival")} /> New Arrival
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" data-testid="product-best-seller-checkbox" {...register("isBestSeller")} /> Best Seller
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" data-testid="product-trending-checkbox" {...register("isTrending")} /> Trending
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" data-testid="product-in-stock-checkbox" {...register("inStock")} /> In Stock
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold border border-black/10">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-maroon text-white disabled:opacity-60"
              data-testid="product-form-submit">
              {submitting ? "Saving..." : editingProduct ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ---------- Orders hooks ----------

function useOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => ordersApi.listAll().then((r) => r.orders),
  });
}

// ---------- Dashboard (stats) section ----------

function StatCard({ label, value, sub, Icon, iconClass, accent }: { label: string; value: string; sub?: string; Icon: any; iconClass: string; accent: string }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-black/5 p-5 flex items-start gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${iconClass}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground font-poppins uppercase tracking-widest">{label}</p>
        <p className="text-[26px] leading-8 font-bold font-poppins text-foreground mt-1">{value}</p>
        {sub && <p className="text-xs text-muted-foreground font-poppins mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function DashboardSection({ onViewOrder }: { onViewOrder: (o: OrderDTO) => void }) {
  const { data: orders = [], isLoading } = useOrders();

  const active = orders.filter((o) => o.status !== "cancelled");
  const delivered = orders.filter((o) => o.status === "delivered");
  const inProgress = orders.filter((o) => ["pending", "confirmed", "shipped"].includes(o.status));
  const revenue = active.reduce((sum, o) => sum + o.total, 0);
  const deliveredRevenue = delivered.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Orders Received" value={String(orders.length)} sub={`${inProgress.length} in progress`} Icon={ShoppingBag} iconClass="bg-gradient-to-br from-maroon to-red-900 text-white" accent="bg-gradient-to-r from-maroon to-red-800" />
        <StatCard label="Delivered" value={String(delivered.length)} sub={orders.length ? `${Math.round((delivered.length / orders.length) * 100)}% of all orders` : undefined} Icon={CheckCircle2} iconClass="bg-gradient-to-br from-emerald-500 to-green-700 text-white" accent="bg-gradient-to-r from-emerald-400 to-green-600" />
        <StatCard label="Pending / Shipping" value={String(inProgress.length)} sub="awaiting delivery" Icon={Clock} iconClass="bg-gradient-to-br from-amber-400 to-orange-600 text-white" accent="bg-gradient-to-r from-amber-400 to-orange-500" />
        <StatCard label="Total Income" value={formatINR(revenue)} sub={`${formatINR(deliveredRevenue)} from delivered`} Icon={IndianRupee} iconClass="bg-gradient-to-br from-yellow-400 to-amber-600 text-white" accent="bg-gradient-to-r from-gold to-amber-500" />
      </div>

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-black/5">
          <h3 className="font-serif text-lg text-foreground">Recent Orders</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading orders...</TableCell></TableRow>
            )}
            {!isLoading && orders.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No orders yet. They will appear here as customers check out.</TableCell></TableRow>
            )}
            {orders.slice(0, 6).map((o) => (
              <TableRow key={o.id} className="hover:bg-beige/40 transition-colors">
                <TableCell className="font-poppins text-sm font-semibold">{o.orderNumber}</TableCell>
                <TableCell className="font-poppins text-sm">{o.customer.firstName} {o.customer.lastName}</TableCell>
                <TableCell className="font-poppins text-sm">{formatDate(o.createdAt)}</TableCell>
                <TableCell className="font-poppins text-sm font-semibold">{formatINR(o.total)}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full font-poppins capitalize ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                </TableCell>
                <TableCell className="text-right">
                  <button onClick={() => onViewOrder(o)} className="p-2 text-foreground hover:text-maroon" data-testid={`view-order-${o.orderNumber}`}>
                    <Eye size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ---------- Orders section ----------

function OrdersSection({ onViewOrder }: { onViewOrder: (o: OrderDTO) => void }) {
  const { data: orders = [], isLoading } = useOrders();
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => ordersApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
        <h3 className="font-serif text-lg text-foreground">All Orders</h3>
        <span className="text-xs text-muted-foreground font-poppins">{orders.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading orders...</TableCell></TableRow>
            )}
            {!isLoading && orders.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No orders yet.</TableCell></TableRow>
            )}
            {orders.map((o) => (
              <TableRow key={o.id} data-testid={`order-row-${o.orderNumber}`} className="hover:bg-beige/40 transition-colors">
                <TableCell className="font-poppins text-sm font-semibold whitespace-nowrap">{o.orderNumber}</TableCell>
                <TableCell className="font-poppins text-sm">
                  <div>{o.customer.firstName} {o.customer.lastName}</div>
                  <div className="text-xs text-muted-foreground">{o.customer.phone}</div>
                </TableCell>
                <TableCell className="font-poppins text-sm whitespace-nowrap">{formatDate(o.createdAt)}</TableCell>
                <TableCell className="font-poppins text-sm">{o.items.reduce((n, i) => n + i.quantity, 0)}</TableCell>
                <TableCell className="font-poppins text-sm uppercase">{o.paymentMethod}</TableCell>
                <TableCell className="font-poppins text-sm font-semibold whitespace-nowrap">{formatINR(o.total)}</TableCell>
                <TableCell>
                  <select
                    value={o.status}
                    onChange={(e) => statusMutation.mutate({ id: o.id, status: e.target.value as OrderStatus })}
                    className={`text-xs font-semibold rounded-full px-2.5 py-1.5 font-poppins capitalize border-0 outline-none cursor-pointer ${STATUS_STYLES[o.status]}`}
                    data-testid={`order-status-${o.orderNumber}`}
                  >
                    {ORDER_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <button onClick={() => onViewOrder(o)} className="p-2 text-foreground hover:text-maroon">
                    <Eye size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ---------- Order details dialog ----------

function OrderDetailsDialog({ order, onClose }: { order: OrderDTO | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  // Track status locally so the dropdown updates instantly inside the
  // dialog; the tables refresh via query invalidation.
  const [status, setStatus] = useState<OrderStatus>("pending");
  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const statusMutation = useMutation({
    mutationFn: (next: OrderStatus) => ordersApi.updateStatus(order!.id, next),
    onSuccess: ({ order: updated }) => {
      setStatus(updated.status);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif">Order {order.orderNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 font-poppins text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <select
                    value={status}
                    onChange={(e) => statusMutation.mutate(e.target.value as OrderStatus)}
                    disabled={statusMutation.isPending}
                    className={`text-xs font-semibold rounded-full px-3 py-1.5 capitalize border-0 outline-none cursor-pointer disabled:opacity-60 ${STATUS_STYLES[status]}`}
                    data-testid="order-details-status"
                  >
                    {ORDER_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                  {statusMutation.isPending && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
                  {statusMutation.isSuccess && !statusMutation.isPending && (
                    <span className="text-xs text-green-700">Saved ✓</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)} · {order.paymentMethod.toUpperCase()}</span>
              </div>

              <div className="rounded-xl border border-black/5 divide-y divide-black/5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    {item.image && <img src={item.image} alt="" className="w-10 h-12 object-cover rounded" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatINR(item.price)} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-beige/60 p-4 space-y-1.5">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatINR(order.discount)}</span></div>
                )}
                <div className="flex justify-between font-bold text-base pt-1.5 border-t border-black/10"><span>Total</span><span className="text-maroon">{formatINR(order.total)}</span></div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Deliver To</p>
                <p className="text-foreground font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                <p className="text-muted-foreground">{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                <p className="text-muted-foreground mt-1">{order.customer.phone} · {order.customer.email}</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- Products section (existing product management) ----------

function ProductsSection() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteTarget(null);
    },
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => { setEditingProduct(null); setDialogOpen(true); }}
          className="flex items-center gap-2 bg-maroon text-white rounded-full px-5 py-2.5 text-sm font-semibold font-poppins"
          data-testid="add-product-button">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading products...</TableCell></TableRow>
            )}
            {!isLoading && products.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products yet. Add your first one.</TableCell></TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.id} data-testid={`product-row-${product.id}`} className="hover:bg-beige/40 transition-colors">
                <TableCell className="flex items-center gap-3">
                  <img src={product.images[0]} alt={product.name} className="w-10 h-12 object-cover rounded" />
                  <span className="font-poppins">{product.name}</span>
                </TableCell>
                <TableCell className="font-poppins text-sm">{product.category}</TableCell>
                <TableCell className="font-poppins text-sm">₹{product.discountedPrice.toLocaleString("en-IN")}</TableCell>
                <TableCell className="font-poppins text-sm">
                  {(product.shippingCharge ?? 199) === 0 ? (
                    <span className="text-green-700">FREE</span>
                  ) : (
                    <>₹{(product.shippingCharge ?? 199).toLocaleString("en-IN")}</>
                  )}
                </TableCell>
                <TableCell className="font-poppins text-sm">
                  {!product.inStock || (product.stockQuantity ?? 0) === 0 ? (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  ) : (product.stockQuantity ?? 0) <= 5 ? (
                    <span className="text-amber-600 font-semibold">{product.stockQuantity} left</span>
                  ) : (
                    <span className="text-green-700">{product.stockQuantity ?? "—"} in stock</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <button onClick={() => { setEditingProduct(product); setDialogOpen(true); }} className="p-2 text-foreground hover:text-maroon" data-testid={`edit-product-${product.id}`}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteTarget(product)} className="p-2 text-foreground hover:text-red-600" data-testid={`delete-product-${product.id}`}>
                    <Trash2 size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editingProduct={editingProduct} />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Delete product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground font-poppins">
            This will permanently remove "{deleteTarget?.name}". This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 rounded-full text-sm font-semibold border border-black/10">
              Cancel
            </button>
            <button
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-red-600 text-white disabled:opacity-60"
              data-testid="confirm-delete-product"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------- Main dashboard shell with sidebar ----------

type AdminTab = "dashboard" | "orders" | "products";

const NAV_ITEMS: { id: AdminTab; label: string; Icon: any }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "orders", label: "Orders", Icon: Package },
  { id: "products", label: "Products", Icon: ShoppingBag },
];

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Overview of your store's performance" },
  orders: { title: "Orders", subtitle: "Manage customer orders and delivery status" },
  products: { title: "Products", subtitle: "Add, edit and manage your saree catalog" },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [viewingOrder, setViewingOrder] = useState<OrderDTO | null>(null);

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-black/5 p-3 lg:sticky lg:top-24 shadow-sm">
              <div className="hidden lg:flex items-center gap-3 px-3 py-4 mb-2 border-b border-black/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon to-red-900 text-white flex items-center justify-center font-serif text-lg shadow-sm flex-shrink-0">
                  {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-base text-maroon leading-tight">SSL Sarees</p>
                  <p className="text-[11px] text-muted-foreground font-poppins truncate">{user?.email}</p>
                </div>
              </div>
              <nav className="flex lg:flex-col gap-1">
                {NAV_ITEMS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-poppins font-medium transition-colors flex-1 lg:flex-none justify-center lg:justify-start ${
                      tab === id ? "bg-gradient-to-r from-maroon to-red-900 text-white shadow-md" : "text-foreground hover:bg-beige"
                    }`}
                    data-testid={`admin-nav-${id}`}
                  >
                    <Icon size={17} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-poppins font-medium text-red-600 hover:bg-red-50 transition-colors lg:mt-2 flex-1 lg:flex-none justify-center lg:justify-start"
                  data-testid="admin-signout"
                >
                  <LogOut size={17} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-3xl font-serif text-foreground">{TAB_TITLES[tab].title}</h1>
              <p className="text-sm text-muted-foreground font-poppins mt-1">{TAB_TITLES[tab].subtitle}</p>
            </div>

            {tab === "dashboard" && <DashboardSection onViewOrder={setViewingOrder} />}
            {tab === "orders" && <OrdersSection onViewOrder={setViewingOrder} />}
            {tab === "products" && <ProductsSection />}
          </main>
        </div>
      </div>

      <OrderDetailsDialog order={viewingOrder} onClose={() => setViewingOrder(null)} />
    </div>
  );
}
