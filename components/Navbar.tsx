"use client";

import React, { useState } from "react";
import Container from "./Container";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, isLoading, isLoggedIn, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        logout();
        setIsMenuOpen(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="relative bg-[#18181B] py-4 w-full px-3">
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-red-600 text-2xl font-semibold">
            Next Movie
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 text-white">
            <li>
              <Link href="/">Home</Link>
            </li>

            <li>
              <Link href="/about">About</Link>
            </li>

            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link href="/my-bookings">My Bookings</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/login">Login</Link>
                    </li>
                    <li>
                      <Link href="/register">Signup</Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          {/* Welcome */}
          <div className="hidden md:block text-white">
            {isLoggedIn && <p>Welcome {user?.name}</p>}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white text-2xl"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 top-full z-50 w-full bg-[#18181B] px-6 py-5 shadow-lg md:hidden">
            <ul className="flex flex-col gap-5 text-white">
              <li>
                <Link href="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>

              <li>
                <Link href="/about" onClick={closeMenu}>
                  About
                </Link>
              </li>

              {!isLoading && (
                <>
                  {isLoggedIn ? (
                    <>
                      <li className="text-gray-300">Welcome {user?.name}</li>

                      <li>
                        <Link href="/my-bookings" onClick={closeMenu}>
                          My Bookings
                        </Link>
                      </li>

                      <li>
                        <button onClick={handleLogout}>Logout</button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/login" onClick={closeMenu}>
                          Login
                        </Link>
                      </li>

                      <li>
                        <Link href="/register" onClick={closeMenu}>
                          Signup
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </div>
        )}
      </Container>
    </nav>
  );
}

export default Navbar;
