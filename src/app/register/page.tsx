"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "../components/Notification";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      setUploading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      showNotification("Registration successful! Please log in.", "success");
      router.push("/login");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Registration failed",
        "error"
      );
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-2 rounded-md font-medium transition ${
              uploading
                ? "bg-blue-700 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-gray-400 mt-5">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-400 transition"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}