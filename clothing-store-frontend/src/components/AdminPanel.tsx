import React, { useState } from "react";
import { productsApi } from "../api/productsApi";
import type { Product } from "../types";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"add" | "report">("add");
  const [message, setMessage] = useState("");

  // Форма добавления товара
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    price: "",
    color: "",
    size: "M",
    type: "0",
    quantity: "",
  });

  // Отчет
  const [reportType, setReportType] = useState<string>("");
  const [reportSize, setReportSize] = useState<string>("");
  const [reportData, setReportData] = useState<Product[]>([]);

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        barcode: newProduct.barcode,
        price: parseFloat(newProduct.price),
        color: newProduct.color,
        size: newProduct.size,
        type: parseInt(newProduct.type),
        quantity: parseInt(newProduct.quantity),
      };

      await productsApi.create(productData);
      setMessage("Товар успешно добавлен!");

      // Сброс формы
      setNewProduct({
        name: "",
        barcode: "",
        price: "",
        color: "",
        size: "M",
        type: "0",
        quantity: "",
      });
    } catch (error) {
      console.error("Ошибка:", error);
      setMessage("Ошибка при добавлении товара");
    }
  };

  const handleGenerateReport = async () => {
    try {
      const type = reportType ? parseInt(reportType) : undefined;
      const response = await productsApi.getStockReport(
        type,
        reportSize || undefined,
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при загрузке отчета");
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Панель администратора
      </Typography>

      <div style={{ marginBottom: "20px" }}>
        <Button
          variant={activeTab === "add" ? "contained" : "outlined"}
          onClick={() => setActiveTab("add")}
        >
          Добавить товар
        </Button>
        <Button
          variant={activeTab === "report" ? "contained" : "outlined"}
          onClick={() => setActiveTab("report")}
          style={{ marginLeft: "10px" }}
        >
          Отчет по остаткам
        </Button>
      </div>

      {activeTab === "add" ? (
        <Box component="form" style={{ maxWidth: "400px" }}>
          <TextField
            label="Название"
            fullWidth
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Штрихкод"
            fullWidth
            value={newProduct.barcode}
            onChange={(e) =>
              setNewProduct({ ...newProduct, barcode: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Цена"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Цвет"
            fullWidth
            value={newProduct.color}
            onChange={(e) =>
              setNewProduct({ ...newProduct, color: e.target.value })
            }
            margin="normal"
          />
          <Select
            value={newProduct.size}
            onChange={(e) =>
              setNewProduct({ ...newProduct, size: e.target.value })
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="XS">XS</MenuItem>
            <MenuItem value="S">S</MenuItem>
            <MenuItem value="M">M</MenuItem>
            <MenuItem value="L">L</MenuItem>
            <MenuItem value="XL">XL</MenuItem>
          </Select>
          <Select
            value={newProduct.type}
            onChange={(e) =>
              setNewProduct({ ...newProduct, type: e.target.value })
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="0">Свитер</MenuItem>
            <MenuItem value="1">Брюки</MenuItem>
            <MenuItem value="2">Шорты</MenuItem>
            <MenuItem value="3">Футболка</MenuItem>
            <MenuItem value="4">Куртка</MenuItem>
          </Select>
          <TextField
            label="Количество"
            type="number"
            fullWidth
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: e.target.value })
            }
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
            style={{ marginTop: "20px" }}
          >
            Добавить товар
          </Button>

          {message && (
            <Typography color="primary" style={{ marginTop: "10px" }}>
              {message}
            </Typography>
          )}
        </Box>
      ) : (
        <div>
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Все типы</MenuItem>
              <MenuItem value="0">Свитеры</MenuItem>
              <MenuItem value="1">Брюки</MenuItem>
              <MenuItem value="2">Шорты</MenuItem>
              <MenuItem value="3">Футболки</MenuItem>
              <MenuItem value="4">Куртки</MenuItem>
            </Select>

            <Select
              value={reportSize}
              onChange={(e) => setReportSize(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Все размеры</MenuItem>
              <MenuItem value="XS">XS</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
            </Select>

            <Button variant="contained" onClick={handleGenerateReport}>
              Сформировать отчет
            </Button>
          </div>

          {reportData.length > 0 && (
            <div>
              <Typography variant="h6">Результаты:</Typography>
              {reportData.map((product) => (
                <div
                  key={product.id}
                  style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
                >
                  <Typography>
                    {product.name} - {product.size} - {product.color}
                  </Typography>
                  <Typography>Количество: {product.quantity} шт.</Typography>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
