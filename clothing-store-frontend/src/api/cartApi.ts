import apiClient from './apiClient';
import type { CartItem } from '../types';

export const cartApi = {

  getCart: (userId: number) =>
    apiClient.get<CartItem[]>(`/cart/user/${userId}`),
  
  addToCart: (data: Omit<CartItem, 'id'>) =>
    apiClient.post<CartItem>('/cart', data),
  
  removeFromCart: (id: number) =>
    apiClient.delete(`/cart/${id}`),
};