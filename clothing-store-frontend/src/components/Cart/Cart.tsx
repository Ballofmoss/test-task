import React, { useState, useEffect } from "react";
import { cartApi } from "../../api/cartApi";
import { ordersApi } from "../../api/ordersApi";
import { productsApi } from "../../api/productsApi";
import type { CartItem, Product } from "../../types";
import {
  Button,
  List,
  ListItem,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";

import styles from "./Cart.module.css";

interface CartProps {
  userId: number;
}

const Cart: React.FC<CartProps> = ({ userId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadCart();
  }, [userId]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.getCart(userId);
      const items = response.data;
      setCartItems(items);

      if (items && items.length > 0) {
        const productIds = [...new Set(items.map((item) => item.productId))];
        const productPromises = productIds.map((id) =>
          productsApi.getProductById(id),
        );
        const productResponses = await Promise.all(productPromises);

        const productsMap: Record<number, Product> = {};
        productResponses.forEach((response) => {
          if (response.data) {
            productsMap[response.data.id] = response.data;
          }
        });

        setProducts(productsMap);
      }
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await cartApi.removeFromCart(itemId);
      loadCart();
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Не удалось удалить товар");
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove(itemId);
      return;
    }

    try {
      setUpdating(itemId);
      await cartApi.updateQuantity(itemId, newQuantity);
      await loadCart(); // Перезагружаем корзину
    } catch (error: any) {
      console.error("Ошибка обновления количества:", error);
      alert(error.response?.data?.message || "Не удалось обновить количество");
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckout = async () => {
    try {
      await ordersApi.createOrder(userId);
      alert("Заказ оформлен!");
      loadCart(); // Корзина очистится после заказа
    } catch (error) {
      console.error("Ошибка оформления:", error);
      alert("Ошибка при оформлении");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      return product ? total + product.price * item.quantity : total;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography className={styles.loadingText}>
          Загрузка корзины...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.cartContainer}>
      <Typography variant="h4" className={styles.cartTitle}>
        Корзина покупок
      </Typography>

      {cartItems.length === 0 ? (
        <Paper className={styles.emptyCartContainer}>
          <Typography variant="h5" className={styles.emptyCartTitle}>
            Корзина пуста
          </Typography>
          <Typography className={styles.emptyCartText}>
            Добавьте товары из каталога
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper className={styles.cartItemsList}>
            <List>
              {cartItems.map((item) => {
                const product = products[item.productId];
                const isUpdating = updating === item.id;

                return (
                  <ListItem
                    key={item.id}
                    divider
                    className={styles.cartItem}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleRemove(item.id)}
                        disabled={isUpdating}
                        className={styles.removeButton}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <Box className={styles.productInfo}>
                      <Typography variant="h6" className={styles.productName}>
                        {product?.name || "Загрузка..."}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="div"
                        className={styles.productDetails}
                      >
                        Цена: {product?.price || 0} ₽ • Размер:{" "}
                        {product?.size || "?"} • Цвет: {product?.color || "?"}
                      </Typography>

                      <Box className={styles.quantityControls}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          className={styles.quantityStack}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>

                          <Typography
                            variant="body1"
                            component="div"
                            className={styles.quantityDisplay}
                          >
                            {item.quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={isUpdating}
                          >
                            <Add />
                          </IconButton>
                        </Stack>

                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          component="div"
                          className={styles.itemTotal}
                        >
                          Сумма:{" "}
                          {product
                            ? (product.price * item.quantity).toLocaleString(
                                "ru-RU",
                              )
                            : 0}{" "}
                          ₽
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Paper>

          <Paper className={styles.checkoutContainer}>
            <Stack spacing={2}>
              <Box className={styles.checkoutSummary}>
                <Box className={styles.summaryLeft}>
                  <Typography
                    variant="h6"
                    component="div"
                    className={styles.totalItems}
                  >
                    Товаров: {getTotalItems()} шт.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                    className={styles.itemsCount}
                  >
                    Позиций: {cartItems.length}
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  color="primary"
                  component="div"
                  className={styles.totalPrice}
                >
                  Итого: {calculateTotal().toLocaleString("ru-RU")} ₽
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleCheckout}
                fullWidth
                className={styles.checkoutButton}
              >
                Оформить заказ
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Cart;
