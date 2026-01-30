import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Person, Logout } from "@mui/icons-material";
import { Button } from "@mui/material";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none", fontSize: "20px" }}
        >
          Магазин Одежды
        </Link>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {user ? (
          <>
            <span>Привет, {user.username}!</span>
            {user.role === "Admin" && (
              <Link to="/admin">
                <Button variant="contained" color="secondary" size="small">
                  Админ
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<ShoppingCart />}
              >
                Корзина
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<Logout />}
              onClick={onLogout}
            >
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Person />}
              >
                Войти
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outlined" color="inherit" size="small">
                Регистрация
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
