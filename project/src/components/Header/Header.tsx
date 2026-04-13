import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSearchQuery } from "../../store/shopSlice";
import "./Header.css";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery } = useAppSelector((state) => state.shop);
  const cartCount = useAppSelector((state) => state.cart.items.length);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [value, setValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSearchClick = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      return;
    }

    if (!value.trim()) {
      setIsSearchOpen(false);
      return;
    }

    dispatch(setSearchQuery(value.trim()));
    navigate(`/catalog?q=${encodeURIComponent(value.trim())}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) {
      setIsSearchOpen(false);
      return;
    }
    dispatch(setSearchQuery(value.trim()));
    navigate(`/catalog?q=${encodeURIComponent(value.trim())}`);
  };

  const activePath = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <header className="container">
      <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <Link className="navbar-brand" to="/">
              <img src="/img/header-logo.png" alt="Bosa Noga" />
            </Link>
            <div className="collapse navbar-collapse" id="navbarMain">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className={`nav-link ${activePath("/")}`} to="/">
                    Главная
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activePath("/catalog")}`}
                    to="/catalog"
                  >
                    Каталог
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activePath("/about")}`}
                    to="/about"
                  >
                    О магазине
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${activePath("/contacts")}`}
                    to="/contacts"
                  >
                    Контакты
                  </Link>
                </li>
              </ul>
              <div className="header-controls">
                <div className="header-controls-pics">
                  <button
                    type="button"
                    className="header-controls-pic header-controls-search"
                    onClick={handleSearchClick}
                  />
                  <button
                    type="button"
                    className="header-controls-pic header-controls-cart"
                    onClick={() => navigate("/cart")}
                  >
                    {cartCount ? (
                      <span className="header-controls-cart-full">
                        {cartCount}
                      </span>
                    ) : null}
                  </button>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className={`header-controls-search-form${isSearchOpen ? "" : " invisible"}`}
                >
                  <input
                    ref={inputRef}
                    className="form-control"
                    placeholder="Поиск"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                  <button
                    type="button"
                    className="header-controls-search-close"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    ×
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
