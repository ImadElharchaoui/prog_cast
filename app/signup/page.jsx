"use client";

import { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaKey, FaUserAlt, FaEnvelope } from "react-icons/fa";

const RegisterPage = () => {
  
  const route = useRouter();
  
  if(Cookies.get("userID")){
    route.push("/profile")
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Reset previous error and success messages
    setError("");
    setSuccess("");

    // Basic validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // Simple email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password strength check (at least 6 characters)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("/api/v1/user/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(`Registration failed: ${errorMessage}`);
        return;
      }

      setSuccess("Registration successful! Please log in.");
      const data = await response.json()
      console.log(data)
      Cookies.set("userID", data.userID, {expires: 7})
      route.push('/')
      
    } catch (error) {
      setError("An unexpected error occurred.");
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
        <form className="flex flex-col items-center space-y-6 w-full" onSubmit={handleRegister}>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <div className="w-full">
            <label className="block mb-2 text-text font-medium">Username</label>
            <div className="relative w-full">
              <FaUserAlt
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary rounded-md bg-gray-50 focus:outline-none focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary rounded-md bg-gray-50 focus:outline-none focus:border-primary transition-colors duration-200"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary rounded-md bg-gray-50 focus:outline-none focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <Link href={'/login'} className="w-1/2 text-right text-secondary hover:underline">
              Have an Account?
            </Link>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md shadow-md hover:bg-green-500 transition-all duration-200"
            >
              REGISTER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
