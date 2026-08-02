import {
  useState,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Bot,
  CloudSun,
  Leaf,
  LogOut,
  Menu,
  Sprout,
  Store,
  User,
  Wheat,
  X,
} from "lucide-react";

const navigationItems = [
  {
    name: "Weather",
    path: "/weather",
    icon: CloudSun,
  },
  {
    name: "Market Prices",
    path: "/market",
    icon: Store,
  },
  {
    name: "Crop Recommendation",
    path: "/crop",
    icon: Wheat,
  },
  {
    name: "Disease Detection",
    path: "/disease",
    icon: Leaf,
  },
  {
    name: "AI Assistant",
    path: "/chatbot",
    icon: Bot,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

function DashboardNavbar() {
  const navigate =
    useNavigate();

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "authToken"
    );

    sessionStorage.clear();

    setMobileMenuOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  const closeMobileMenu =
    () => {
      setMobileMenuOpen(false);
    };

  const getDesktopLinkClass =
    ({ isActive }) => {
      const baseClass =
        "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition duration-200";

      return isActive
        ? `${baseClass} bg-green-100 text-green-700 shadow-sm`
        : `${baseClass} text-gray-600 hover:bg-green-50 hover:text-green-700`;
    };

  const getMobileLinkClass =
    ({ isActive }) => {
      const baseClass =
        "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition duration-200";

      return isActive
        ? `${baseClass} bg-green-100 text-green-700`
        : `${baseClass} text-gray-700 hover:bg-green-50 hover:text-green-700`;
    };

  return (
    <nav className="sticky top-0 z-50 border-b border-green-100 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link
            to="/dashboard"
            onClick={
              closeMobileMenu
            }
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-lg transition duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Sprout
                size={27}
                strokeWidth={2.4}
              />
            </div>

            <div>
              <p className="text-xl font-black tracking-tight text-green-800 sm:text-2xl">
                AgriSense
              </p>

              <p className="hidden text-xs font-medium text-gray-500 sm:block">
                Smart Farming Assistant
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navigationItems.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <NavLink
                    key={
                      item.path
                    }
                    to={
                      item.path
                    }
                    className={
                      getDesktopLinkClass
                    }
                  >
                    <Icon
                      size={18}
                    />

                    <span>
                      {item.name}
                    </span>
                  </NavLink>
                );
              }
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={
                handleLogout
              }
              className="hidden items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg sm:flex"
            >
              <LogOut
                size={18}
              />

              Logout
            </button>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (
                    previousState
                  ) =>
                    !previousState
                )
              }
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={
                mobileMenuOpen
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-700 transition hover:bg-green-100 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X
                  size={24}
                />
              ) : (
                <Menu
                  size={24}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-green-100 bg-white px-4 py-4 shadow-xl lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            <NavLink
              to="/dashboard"
              onClick={
                closeMobileMenu
              }
              className={
                getMobileLinkClass
              }
            >
              <Sprout
                size={20}
              />

              Dashboard
            </NavLink>

            {navigationItems.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <NavLink
                    key={
                      item.path
                    }
                    to={
                      item.path
                    }
                    onClick={
                      closeMobileMenu
                    }
                    className={
                      getMobileLinkClass
                    }
                  >
                    <Icon
                      size={20}
                    />

                    <span>
                      {item.name}
                    </span>
                  </NavLink>
                );
              }
            )}

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600"
            >
              <LogOut
                size={20}
              />

              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default DashboardNavbar;