import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, User, Search, Heart, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useSearchStore } from "@/store/search";
import { useUserStore } from "@/store/user";
import AuthDialog from "./AuthDialog";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(document.documentElement.classList.contains('dark'));
  };
  const favoriteItems = useFavoritesStore((state) => state.items);
  const { query, setQuery, results } = useSearchStore();
  const { user, isAuthenticated } = useUserStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "uk" : "en");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-black dark:text-white">
              Store
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/products">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 w-24 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-base font-medium"
                >
                  {t("nav.products")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value, t)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={t("common.search")}
                  className="pl-8 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-colors"
                />
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              </form>

              {isSearchFocused && query && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 mt-1 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 p-2 max-h-96 overflow-y-auto transition-colors">
                  {results.map((product) => {
                    const productName = t(`products.items.${product.id}.name`);
                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        onClick={() => setIsSearchFocused(false)}
                      >
                        <img
                          src={product.images[0]}
                          alt={productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-black dark:text-white">{productName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ${product.price}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <img src={`/flags/${i18n.language}.svg`}
              alt={i18n.language}
              className="w-6 h-6"
              />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Link to="/favorites" className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <Heart className="h-6 w-6" />
              </Button>
              {favoriteItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {favoriteItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ShoppingCart className="h-6 w-6" />
              </Button>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="p-2 h-10 px-4 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  <User className="h-5 w-5 mr-2" />
                  {user?.firstName || t("nav.profile")}
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setIsAuthOpen(true)} className="p-2 h-10 px-4 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                <User className="h-5 w-5 mr-2" />
                {t("nav.signin")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
};

export default Navbar;