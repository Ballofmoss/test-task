import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { Button, TextField, Typography, Box } from "@mui/material";

interface RegisterProps {
  onLogin: (user: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // После регистрации сразу логинимся
      const loginResponse = await authApi.login({
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
      onLogin(loginResponse.data.user);
      navigate("/");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setError("Ошибка при регистрации");
    }
  };

  return (
    <Box style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Регистрация
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Имя пользователя"
          fullWidth
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          name="password"
          label="Пароль"
          type="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          name="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          fullWidth
          value={formData.confirmPassword}
          onChange={handleChange}
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
          Зарегистрироваться
        </Button>
      </form>

      <Button onClick={() => navigate("/login")} style={{ marginTop: "10px" }}>
        Уже есть аккаунт? Войти
      </Button>
    </Box>
  );
};

export default Register;
