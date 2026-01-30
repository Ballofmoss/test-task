import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { Button, TextField, Typography, Box } from "@mui/material";

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authApi.login({ username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin(response.data.user);
      navigate("/");
    } catch (error) {
      console.error("Ошибка входа:", error);
      setError("Неверное имя пользователя или пароль");
    }
  };

  return (
    <Box style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Вход
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Имя пользователя"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />

        {error && <Typography color="error">{error}</Typography>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Войти
        </Button>
      </form>

      <Button
        onClick={() => navigate("/register")}
        style={{ marginTop: "10px" }}
      >
        Нет аккаунта? Зарегистрироваться
      </Button>
    </Box>
  );
};

export default Login;
