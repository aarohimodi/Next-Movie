"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const handleRegister = async (data: RegisterFormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.message);

        return;
      }
      alert(result.message);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#080b16] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111626] p-6 shadow-2xl sm:p-9">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xl font-bold"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-xl">
            ▶
          </span>
          <span>
            Next <span className="text-red-400">Movie</span>
          </span>
        </Link>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Join the show. Book your next movie night.
        </p>

        {/* Register Form */}
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(handleRegister)}
        >
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              {...register("name", {
                required: "Name is Required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                validate: (value) => !!value.trim() || "Name cannot be empty",
              })}
              className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 outline-none transition placeholder:text-gray-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is Required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 outline-none transition placeholder:text-gray-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                autoComplete="new-password"
                placeholder="Create a strong password"
                minLength={8}
                required
                className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 pr-20 outline-none transition placeholder:text-gray-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
              />
              {errors.password && <p>{errors.password.message}</p>}

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Use a long, unique password that you haven't used elsewhere.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-red-500 py-3.5 font-semibold transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-[#111626]"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-7 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-red-400 hover:text-red-300"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </main>
  );
}
