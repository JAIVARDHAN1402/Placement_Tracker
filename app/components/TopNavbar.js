"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { usePlacementStore } from "@/app/lib/usePlacementStore";

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout, hydrated } = usePlacementStore();

  // Hide navbar on these pages
  const hideOnPages = ["/", "/login", "/signup", "/admin/login", "/admin"];
  const shouldHide = hideOnPages.includes(pathname);

  if (!hydrated || shouldHide || !currentUser) {
    return null;
  }

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
          <Link href={currentUser?.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center space-x-2 font-bold text-lg hover:opacity-80">
            <span className="text-2xl">📌</span>
            <span>Placement System</span>
          </Link>

          {/* Nav Items */}
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

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-sm">
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
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg font-medium transition border-l-4 ${
                isActive(item.href)
                  ? "border-l-white bg-teal-500 text-white"
                  : "border-l-transparent hover:bg-teal-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
