import apiClient from './apiClient';
import type { Product } from '../types';

export const productsApi = {
  
  getAll: () => apiClient.get<Product[]>('/products'),
  
  create: (product: Omit<Product, 'id' | 'createdAt'>) =>
    apiClient.post<Product>('/products', product),
  
  update: (id: number, product: Partial<Product>) =>
    apiClient.put(`/products/${id}`, product),
  
  delete: (id: number) => apiClient.delete(`/products/${id}`),

  restock: (id: number, quantity: number) =>
    apiClient.put(`/products/${id}/restock`, quantity),
  
  getStockReport: (type?: number, size?: string) => {
    const params = new URLSearchParams();
    if (type !== undefined) params.append('type', type.toString());
    if (size) params.append('size', size);
    return apiClient.get<Product[]>(`/products/stock-report?${params}`);
  },
};