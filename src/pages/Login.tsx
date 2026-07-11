import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-16 flex items-start justify-center" data-testid="login-page">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-black/5 p-8">
        <h1 className="text-2xl font-serif text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground font-poppins mb-6">Sign in to your account</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3 font-poppins" data-testid="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="login-form">
          <div>
            <label className="block text-sm font-poppins text-foreground mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-maroon/30"
              data-testid="login-email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-poppins text-foreground mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-maroon/30"
              data-testid="login-password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-maroon text-white rounded-full py-3 text-sm font-semibold font-poppins disabled:opacity-60"
            data-testid="login-submit"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-muted-foreground font-poppins mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-maroon font-semibold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
