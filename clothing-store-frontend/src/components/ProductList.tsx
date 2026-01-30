import React, { useState, useEffect } from "react";
import { productsApi } from "../api/productsApi";
import { cartApi } from "../api/cartApi";
import type { Product } from "../types";
import { Button, Card, CardContent, Typography } from "@mui/material";

interface ProductListProps {
  userId?: number;
}

const ProductList: React.FC<ProductListProps> = ({ userId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");
  const [filterSize, setFilterSize] = useState<string>("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      alert("Не удалось загрузить товары");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!userId) {
      alert("Войдите в систему");
      return;
    }

    try {
      await cartApi.addToCart({
        userId,
        productId,
        quantity: 1,
      });
      alert("Товар добавлен в корзину");
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
      alert("Не удалось добавить товар");
    }
  };

  const getTypeName = (type: number) => {
    const types = ["Свитер", "Брюки", "Шорты", "Футболка", "Куртка"];
    return types[type] || "Неизвестно";
  };

  const filteredProducts = products.filter((product) => {
    if (filterType && product.type.toString() !== filterType) return false;
    if (filterSize && product.size !== filterSize) return false;
    return true;
  });

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Все типы</option>
          <option value="0">Свитеры</option>
          <option value="1">Брюки</option>
          <option value="2">Шорты</option>
          <option value="3">Футболки</option>
          <option value="4">Куртки</option>
        </select>

        <select
          value={filterSize}
          onChange={(e) => setFilterSize(e.target.value)}
        >
          <option value="">Все размеры</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography color="textSecondary">
                Тип: {getTypeName(product.type)}
              </Typography>
              <Typography color="textSecondary">
                Размер: {product.size}
              </Typography>
              <Typography color="textSecondary">
                Цвет: {product.color}
              </Typography>
              <Typography variant="h6" color="primary">
                {product.price} ₽
              </Typography>
              <Typography color={product.quantity > 0 ? "green" : "error"}>
                В наличии: {product.quantity} шт.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleAddToCart(product.id)}
                disabled={product.quantity === 0 || !userId}
                style={{ marginTop: "10px" }}
              >
                {product.quantity > 0 ? "В корзину" : "Нет в наличии"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
