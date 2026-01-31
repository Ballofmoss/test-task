import apiClient from "./apiClient";
import type { CartItem } from "../types";

export const cartApi = {
  getCart: (userId: number) =>
    apiClient.get<CartItem[]>(`/cart/user/${userId}`),

  addToCart: (userId: number, productId: number, quantity: number) => {
    const cartDto = {
      userId: userId,
      productId: productId,
      quantity: quantity,
    };

    return apiClient.post<CartItem[]>("/cart", cartDto);
  },

  updateQuantity: (itemId: number, quantity: number) => {
    return apiClient.put(`/cart/${itemId}`, { Quantity: quantity });
  },

  updateQuantitySimple: (itemId: number, quantity: number) => {
    return apiClient.put(`/cart/${itemId}/quantity`, quantity, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  removeFromCart: (id: number) => apiClient.delete(`/cart/${id}`),
};
