import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { Button, TextField, Typography, Box } from "@mui/material";

import styles from "./Register.module.css";

interface RegisterProps {
  onLogin: (user: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    <Box className={styles.registerContainer}>
      <Typography variant="h4" className={styles.registerTitle}>
        Регистрация
      </Typography>

      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <TextField
          name="username"
          label="Имя пользователя"
          fullWidth
          value={formData.username}
          onChange={handleChange}
          className={styles.formField}
          required
        />

        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          className={styles.formField}
          required
        />

        <TextField
          name="password"
          label="Пароль"
          type="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          className={styles.formField}
          required
        />

        <TextField
          name="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          fullWidth
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.formField}
          required
        />

        {error && (
          <Typography color="error" className={styles.errorMessage}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className={styles.submitButton}
        >
          Зарегистрироваться
        </Button>
      </form>

      <Button
        onClick={() => navigate("/login")}
        className={styles.loginLinkButton}
        color="inherit"
      >
        Уже есть аккаунт? Войти
      </Button>
    </Box>
  );
};

export default Register;
