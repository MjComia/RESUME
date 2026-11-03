"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, Terminal, X } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { PROFILE_DATA } from "@/data/seed";

const NAV_ITEMS = [
  { label: "Overview", href: "/#overview" },
  { label: "Profile", href: "/#profile" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/#blog" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const { theme, toggleTheme } = usePortfolio();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Coordinate Brand Mark */}
        <Link
          href="/#overview"
          className="inline-flex items-center gap-2.5 font-mono text-sm font-semibold text-ink hover:text-code transition-colors"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-xs bg-elevated border border-hairline text-code">
            <Terminal className="w-3.5 h-3.5" />
          </span>
          <span>{PROFILE_DATA.handle}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-xs bg-data/10 border border-data/30 text-[10px] text-data font-normal">
            dev + data
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-xs font-mono text-xs text-muted hover:text-ink hover:bg-elevated/70 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle + Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs bg-panel border border-hairline font-mono text-xs text-muted hover:text-ink hover:border-code/50 transition-colors"
            aria-label={
              theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-data" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-code" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xs bg-panel border border-hairline text-muted hover:text-ink"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-hairline bg-panel px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-xs font-mono text-xs text-muted hover:text-ink hover:bg-elevated"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

