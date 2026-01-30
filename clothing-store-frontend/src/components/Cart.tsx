import React, { useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { ordersApi } from '../api/ordersApi';
import { productsApi } from '../api/productsApi';
import type { CartItem, Product } from '../types';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface CartProps {
  userId: number;
}

const Cart: React.FC<CartProps> = ({ userId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, [userId]);

  const loadCart = async () => {
    try {
      const response = await cartApi.getCart(userId);
      const items = response.data;
      setCartItems(items);
      
      // Загружаем информацию о товарах
      const productIds = items.map(item => item.productId);
      const productPromises = productIds.map(id => productsApi.getProductById(id));
      const productResponses = await Promise.all(productPromises);
      
      const productsMap: Record<number, Product> = {};
      productResponses.forEach(response => {
        productsMap[response.data.id] = response.data;
      });
      
      setProducts(productsMap);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await cartApi.removeFromCart(itemId);
      loadCart();
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      await ordersApi.createOrder(userId);
      alert('Заказ оформлен!');
      loadCart(); // Корзина очистится после заказа
    } catch (error) {
      console.error('Ошибка оформления:', error);
      alert('Ошибка при оформлении');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      return product ? total + (product.price * item.quantity) : total;
    }, 0);
  };

  if (loading) return <Typography>Загрузка корзины...</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Корзина</Typography>
      
      {cartItems.length === 0 ? (
        <Typography>Корзина пуста</Typography>
      ) : (
        <>
          <List>
            {cartItems.map(item => {
              const product = products[item.productId];
              return (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={product?.name || 'Загрузка...'}
                    secondary={`Количество: ${item.quantity} | ${product ? `${product.price * item.quantity} ₽` : ''}`}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleRemove(item.id)}
                  >
                    Удалить
                  </Button>
                </ListItem>
              );
            })}
          </List>
          
          <Typography variant="h6" gutterBottom>
            Итого: {calculateTotal()} ₽
          </Typography>
          
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleCheckout}
          >
            Оформить заказ
          </Button>
        </>
      )}
    </div>
  );
};

export default Cart;