import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Cart from "./components/Cart/Cart";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Login from "./pages/Login/Login";
import AdminPage from "./pages/AdminPage/AdminPage";
import Register from "./pages/Register/Register";
import type { User } from "./types";
import ProductList from "./components/ProductList/ProductList";

const AdminRoute: React.FC<{
  user: User | null;
  children: React.ReactNode;
}> = ({ user, children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  const isAdmin = user.role == 1 || user.role == "1" || user.role == "Admin";
  console.log(isAdmin);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Header user={user} onLogout={handleLogout} />

          <div style={{ padding: "20px" }}>
            <div
              style={{
                position: "fixed",
                top: "80px",
                right: "20px",
                zIndex: 1000,
              }}
            >
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                color="inherit"
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </div>

            <Routes>
              <Route path="/" element={<ProductList user={user} />} />
              <Route
                path="/login"
                element={
                  user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
                }
              />
              <Route
                path="/register"
                element={
                  user ? (
                    <Navigate to="/" />
                  ) : (
                    <Register onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/cart"
                element={
                  user ? <Cart userId={user.id} /> : <Navigate to="/login" />
                }
              />
              <Route />
              <Route
                path="/admin"
                element={
                  <AdminRoute user={user}>
                    <AdminPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
