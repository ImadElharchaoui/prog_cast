"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaKey, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  if(Cookies.get("userID")){
    router.push("/")
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple form validation
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    try {
      const response = await fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
      }

      const data = await response.json();
      Cookies.set("userID", data.userID, { expires: 7 });  // Store userID in cookies

      setSuccess("Login successful! Redirecting...");
      router.push("/");  // Redirect to home page

    } catch (error) {
      setError("An error occurred while logging in.");
    }
  };

  return (
    <div className="absolute top-0 left-0 z-50 w-screen h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/images/icons/Logo.png"
            alt="logo"
            className="h-20 w-20 object-contain mb-4"
          />
          <h1 className="text-primary font-bold text-3xl">PROGRAM CASTING</h1>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <form className="flex flex-col items-center space-y-6 w-full" onSubmit={handleLogin}>
          <div className="w-full">
            <label className="block mb-2 text-text font-medium">Email</label>
            <div className="relative w-full">
              <FaEnvelope
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border border-secondary rounded-md bg-gray-50 focus:outline-none focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full">
            <label className="block mb-2 text-text font-medium">Password</label>
            <div className="relative w-full">
              <FaKey
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 border border-secondary rounded-md bg-gray-50 focus:outline-none focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <Link href={'/signup'} className="w-1/2">
              Create Account
            </Link>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md shadow-md hover:bg-green-500 transition-all"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
