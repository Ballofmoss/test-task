import apiClient from './apiClient';
import type { Order } from '../types';

export const ordersApi = {

  createOrder: (userId: number) =>
    apiClient.post<Order>('/orders', null, { params: { userId } }),
  
  getUserOrders: (userId: number) =>
    apiClient.get<Order[]>(`/orders/user/${userId}`),
};