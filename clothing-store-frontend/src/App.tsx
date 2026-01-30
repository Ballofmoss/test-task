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

import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./components/Cart";
import AdminPanel from "./components/AdminPanel";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import Register from "./pages/Register";
import type { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Загружаем пользователя из localStorage при запуске
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
              <Route path="/" element={<Home userId={user?.id} />} />
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
              {/* <Route
                path="/admin"
                element={
                  user?.role === "Admin" ? <AdminPanel /> : <Navigate to="/" />
                }
              /> */}
              <Route
                path="/admin"
                element={
                  // Проверяем, что пользователь авторизован и админ
                  // user?.role === "1" ?  : <Navigate to="/login" />
                  <AdminPage />
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
