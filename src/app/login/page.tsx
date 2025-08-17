"use client";

import { signIn, useSession } from "next-auth/react";
import { useState ,useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/"); 
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Login</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-300">
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
            <label htmlFor="password" className="block mb-1 font-medium text-gray-300">
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Login
          </button>
        </form>

        <div className="text-center text-gray-400 my-5">OR</div>

        <button
          onClick={handleGitHubLogin}
          className="w-full flex items-center justify-center bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="white">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.09-.744.083-.73.083-.73 1.205.086 1.84 1.24 1.84 1.24 1.07 1.83 2.805 1.3 3.49.99.107-.775.418-1.3.76-1.6-2.665-.3-5.467-1.33-5.467-5.93 0-1.31.47-2.38 1.235-3.22-.135-.3-.54-1.52.105-3.17 0 0 1.005-.32 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.295-1.55 3.3-1.23 3.3-1.23.645 1.65.24 2.87.105 3.17.765.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.82 1.1.82 2.22 0 1.6-.015 2.88-.015 3.27 0 .32.22.69.825.575C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12z"/>
          </svg>
          Login with GitHub
        </button>

        <p className="text-center text-gray-400 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}