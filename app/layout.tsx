import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ignacio's Playground",
  description: "A playground to experiment with different technologies",
};

const navItems = [
  { name: "Infinity", path: "/infinity" },
  { name: "Interactive Dots", path: "/interactive-dots" },
  { name: "Jump", path: "/jump" },
  { name: "Cars", path: "/cars" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
        <div className="grid grid-cols-10">
          <div className="hidden sm:block sm:col-span-3 lg:col-span-2 max-h-screen">
            <nav className="z-50 left-0 top-0 h-full w-full bg-black p-4 font-mono text-green-500">
              <div className="relative h-full">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.15), rgba(0, 255, 0, 0.15) 1px, transparent 1px, transparent 2px)",
                    backgroundSize: "100% 2px",
                  }}
                />
                <div
                  className="relative z-10 flex flex-col justify-between h-screen p-1 overflow-y-auto"
                  style={{ maxHeight: "calc(100% - 5px)" }}
                >
                  <div>
                    <h1 className="text-xl ml-2 pt-2 mb-4">
                      <a
                        href="https://www.luisignacio.cc/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Ignacio&apos;s
                      </a>{" "}
                      Playground
                    </h1>
                    <ul className="space-y-2">
                      {navItems.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.path}
                            className="block hover:bg-green-900 hover:text-green-300 p-2 transition-colors"
                          >
                            {`> ${item.name}`}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-center opacity-70 max-w-xs">
                    This is a playground for experimentation. It&apos;s a place
                    where I can play with different technologies, ideas and
                    concepts. The code is available on{" "}
                    <a
                      href="https://github.com/luisignaciocc/three-js"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      GitHub
                    </a>
                    <br />
                    <br />
                  </p>
                </div>
              </div>
            </nav>
          </div>
          <div className="relative col-span-10 sm:col-span-7 lg:col-span-8">
            {children}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
