import React, { useState, useEffect } from "react";
import { productsApi } from "../../api/productsApi";
import { cartApi } from "../../api/cartApi";
import type { Product, User } from "../../types";
import { Button, Card, CardContent, Typography } from "@mui/material";

import styles from "./ProductList.module.css";

interface ProductListProps {
  user?: User | null;
}

const ProductList: React.FC<ProductListProps> = ({ user }) => {
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
    if (!user) {
      alert("Войдите в систему");
      return;
    }

    try {
      await cartApi.addToCart(user.id, productId, 1);
      alert("Товар добавлен в корзину");
    } catch (error: any) {
      console.error("Ошибка добавления в корзину:", error);

      try {
        await cartApi.addToCartSimple(user.id, productId, 1);
        alert("Товар добавлен в корзину (через simple)");
      } catch (error2) {
        alert(
          "Не удалось добавить товар: " +
            (error.response?.data?.message || error.message),
        );
      }
    }
  };

  const getTypeName = (type: number) => {
    const types = ["Свитер", "Брюки", "Шорты", "Футболка", "Куртка"];
    return types[type] || "Неизвестно";
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { text: "Нет в наличии", className: styles.outOfStock };
    if (quantity < 5)
      return {
        text: `Осталось мало: ${quantity} шт.`,
        className: styles.lowStock,
      };
    return { text: `В наличии: ${quantity} шт.`, className: styles.inStock };
  };

  const filteredProducts = products.filter((product) => {
    if (filterType && product.type.toString() !== filterType) return false;
    if (filterSize && product.size !== filterSize) return false;
    return true;
  });

  if (loading)
    return <div className={styles.loadingContainer}>Загрузка...</div>;

  return (
    <div className={styles.productListContainer}>
      <div className={styles.filterContainer}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.filterSelect}
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
          className={styles.filterSelect}
        >
          <option value="">Все размеры</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.quantity);

          return (
            <Card key={product.id} className={styles.productCard}>
              <CardContent className={styles.productCardContent}>
                <Typography variant="h6" className={styles.productName}>
                  {product.name}
                </Typography>

                <Typography className={styles.productDetails}>
                  Тип: {getTypeName(product.type)}
                </Typography>

                <Typography className={styles.productDetails}>
                  Размер: {product.size}
                </Typography>

                <Typography className={styles.productDetails}>
                  Цвет: {product.color}
                </Typography>

                <Typography variant="h6" className={styles.productPrice}>
                  {product.price} ₽
                </Typography>

                <Typography
                  className={`${styles.stockStatus} ${stockStatus.className}`}
                >
                  {stockStatus.text}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.quantity === 0 || !user}
                  className={styles.addToCartButton}
                >
                  {product.quantity > 0 ? "В корзину" : "Нет в наличии"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
