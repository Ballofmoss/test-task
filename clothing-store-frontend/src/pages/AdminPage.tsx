import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productsApi } from "../api/productsApi";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Состояние формы
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    price: "",
    color: "",
    size: "M",
    type: "0",
    quantity: "",
  });

  // Обработчик изменения полей формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Проверка обязательных полей
      if (
        !formData.name ||
        !formData.barcode ||
        !formData.price ||
        !formData.quantity
      ) {
        setMessage({ type: "error", text: "Заполните все обязательные поля" });
        setLoading(false);
        return;
      }

      // Подготовка данных для отправки
      const productData = {
        name: formData.name,
        barcode: formData.barcode,
        price: parseFloat(formData.price),
        color: formData.color,
        size: formData.size,
        type: parseInt(formData.type),
        quantity: parseInt(formData.quantity),
      };

      // Отправка запроса на бэкенд
      await productsApi.create(productData);

      // Успешное создание
      setMessage({ type: "success", text: "Товар успешно создан!" });

      // Очистка формы
      setFormData({
        name: "",
        barcode: "",
        price: "",
        color: "",
        size: "M",
        type: "0",
        quantity: "",
      });
    } catch (error: any) {
      // Обработка ошибок
      const errorMessage =
        error.response?.data?.message || "Ошибка при создании товара";
      setMessage({ type: "error", text: errorMessage });
      console.error("Ошибка создания товара:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Создание товара
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        Заполните форму для добавления нового товара в магазин
      </Typography>

      {/* Сообщения об ошибках/успехе */}
      {message && (
        <Alert
          severity={message.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Форма создания товара */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* Название товара */}
        <TextField
          fullWidth
          label="Название товара *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
        />

        {/* Штрихкод */}
        <TextField
          fullWidth
          label="Штрихкод *"
          name="barcode"
          value={formData.barcode}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
        />

        {/* Цена */}
        <TextField
          fullWidth
          label="Цена (₽) *"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
          inputProps={{ min: 0, step: 0.01 }}
        />

        {/* Цвет */}
        <TextField
          fullWidth
          label="Цвет"
          name="color"
          value={formData.color}
          onChange={handleChange}
          margin="normal"
          disabled={loading}
        />

        {/* Размер */}
        <Select
          fullWidth
          name="size"
          value={formData.size}
          onChange={handleChange}
          margin="dense"
          disabled={loading}
          sx={{ mt: 2, mb: 1 }}
        >
          <MenuItem value="XS">XS</MenuItem>
          <MenuItem value="S">S</MenuItem>
          <MenuItem value="M">M</MenuItem>
          <MenuItem value="L">L</MenuItem>
          <MenuItem value="XL">XL</MenuItem>
          <MenuItem value="XXL">XXL</MenuItem>
        </Select>

        {/* Тип товара */}
        <Select
          fullWidth
          name="type"
          value={formData.type}
          onChange={handleChange}
          margin="dense"
          disabled={loading}
          sx={{ mt: 1, mb: 2 }}
        >
          <MenuItem value="0">Свитер</MenuItem>
          <MenuItem value="1">Брюки</MenuItem>
          <MenuItem value="2">Шорты</MenuItem>
          <MenuItem value="3">Футболка</MenuItem>
          <MenuItem value="4">Куртка</MenuItem>
        </Select>

        {/* Количество */}
        <TextField
          fullWidth
          label="Количество *"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
          inputProps={{ min: 0 }}
        />

        {/* Кнопки */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? "Создание..." : "Создать товар"}
          </Button>

          <Button variant="outlined" onClick={() => navigate("/")} fullWidth>
            На главную
          </Button>
        </Box>
      </Box>

      {/* Информация о полях */}
      <Box sx={{ mt: 4, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          * - обязательные поля
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminPage;
