"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {

  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  if (session) {
    router.replace("/"); // Redirect to login if not authenticated
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent auto-redirect
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  const handleGitHubLogin = async () => {
    await signIn("github");
  };



  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

      {/* Show error message if login fails */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <div className="text-center my-4">OR</div>

      {/* GitHub Login Button */}
      <button
        onClick={handleGitHubLogin}
        className="w-full flex items-center justify-center bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="white">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.09-.744.083-.73.083-.73 1.205.086 1.84 1.24 1.84 1.24 1.07 1.83 2.805 1.3 3.49.99.107-.775.418-1.3.76-1.6-2.665-.3-5.467-1.33-5.467-5.93 0-1.31.47-2.38 1.235-3.22-.135-.3-.54-1.52.105-3.17 0 0 1.005-.32 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.295-1.55 3.3-1.23 3.3-1.23.645 1.65.24 2.87.105 3.17.765.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.82 1.1.82 2.22 0 1.6-.015 2.88-.015 3.27 0 .32.22.69.825.575C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12z"/>
        </svg>
        Login with GitHub
      </button>

      <p className="text-center mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
}