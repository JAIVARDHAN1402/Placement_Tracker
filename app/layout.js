import { Geist, Geist_Mono } from "next/font/google";
import TopNavbar from "./components/TopNavbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Placement Management & Analytics System",
  description: "Modern placement tracking for students and admins with analytics, company management, and application workflows.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <TopNavbar />
        {children}
      </body>
    </html>
  );
}
