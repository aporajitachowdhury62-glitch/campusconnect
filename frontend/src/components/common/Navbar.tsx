import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Store, Compass, Menu, X, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { students, shopkeepers } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    {
      path: '/dashboard',
      label: 'Explore Dashboard',
      icon: Compass,
      badge: `${shopkeepers.length} Gigs • ${students.length} Students`,
    },
    {
      path: '/student-signup',
      label: 'Student Sign-up',
      icon: GraduationCap,
      accent: 'amber',
    },
    {
      path: '/shopkeeper-signup',
      label: 'Shopkeeper Sign-up',
      icon: Store,
      accent: 'teal',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-paper-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-marigold-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-marigold-500 to-marigold-700 flex items-center justify-center text-white shadow-md shadow-marigold-600/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-xl sm:text-2xl text-ink-900 tracking-tight">
                  Campus<span className="text-marigold-600">Connect</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-tealdeep-50 text-tealdeep-700 border border-tealdeep-200">
                  Hyperlocal
                </span>
              </div>
              <p className="text-xs text-ink-500 -mt-0.5 hidden sm:block">
                Campus gigs & neighborhood shop work
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-ink-900 shadow-sm border border-paper-border'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-paper-200/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active
                        ? link.path.includes('student')
                          ? 'text-marigold-600'
                          : link.path.includes('shopkeeper')
                          ? 'text-tealdeep-700'
                          : 'text-marigold-600'
                        : 'text-ink-400'
                    }`}
                  />
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-marigold-600 rounded-full" />
                  )}
                  {link.badge && (
                    <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-paper-200 text-ink-600 border border-paper-border">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-ink-700 hover:bg-paper-200 focus:outline-none focus:ring-2 focus:ring-marigold-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-paper-border bg-[#FAF7F2] px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl font-medium text-sm transition-colors ${
                  active
                    ? 'bg-white text-ink-900 font-semibold border border-paper-border shadow-sm'
                    : 'text-ink-700 hover:bg-paper-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      active ? 'text-marigold-600' : 'text-ink-400'
                    }`}
                  />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-paper-200 text-ink-600">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
