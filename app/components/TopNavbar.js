"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout, hydrated } = usePlacementStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Hide navbar on these pages
  const hideOnPages = ["/", "/login", "/signup", "/admin/login", "/admin"];
  const shouldHide = hideOnPages.includes(pathname);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!hydrated || shouldHide || !currentUser) return null;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const navItems =
    currentUser?.role === "admin"
      ? [
          { label: "Admin Panel", href: "/admin" },
          { label: "Companies", href: "/companies" },
        ]
      : [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Companies", href: "/companies" },
          { label: "My Applications", href: "/my-application" },
        ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            href={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
            className="flex items-center space-x-2 font-bold text-lg hover:opacity-80"
          >
            <span className="text-2xl">📌</span>
            <span>Placement System</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition border-b-2 ${
                  isActive(item.href)
                    ? "border-b-white text-white bg-teal-500"
                    : "border-b-transparent hover:bg-teal-500"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop User + Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-right">
              <p className="font-semibold">{currentUser?.name}</p>
              <p className="text-teal-100 text-xs capitalize">{currentUser?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile 3-dot Menu Button */}
          <div className="md:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-teal-500 transition focus:outline-none"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                {/* User info header */}
                <div className="px-4 py-3 bg-teal-50 border-b border-teal-100">
                  <p className="font-semibold text-teal-800 text-sm">{currentUser?.name}</p>
                  <p className="text-xs text-teal-500 capitalize">{currentUser?.role}</p>
                </div>

                {/* Nav links */}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium border-l-4 transition hover:bg-teal-50 ${
                      isActive(item.href)
                        ? "border-l-teal-500 text-teal-700 bg-teal-50"
                        : "border-l-transparent text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}