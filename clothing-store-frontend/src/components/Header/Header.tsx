import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Person,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import type { User } from "../../types";

import styles from "./Header.module.css";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const isAdmin = user?.role === 1 || user?.role === "1";

  return (
    <header className={styles.header}>
      <div>
        <Link to="/" className={styles.logoLink}>
          Магазин Одежды
        </Link>
      </div>

      <div className={styles.controls}>
        {user ? (
          <>
            <span className={styles.userGreeting}>
              Привет, {user.username}!
              {isAdmin && <span className={styles.adminBadge}></span>}
            </span>

            {isAdmin && (
              <Link to="/admin" className={styles.linkButton}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<AdminPanelSettings />}
                  className={styles.adminButton}
                >
                  Админ панель
                </Button>
              </Link>
            )}

            <Link to="/cart" className={styles.linkButton}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<ShoppingCart />}
                className={styles.cartButton}
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
              className={styles.logoutButton}
            >
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.linkButton}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Person />}
                className={styles.loginButton}
              >
                Войти
              </Button>
            </Link>
            <Link to="/register" className={styles.linkButton}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                className={styles.registerButton}
              >
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
