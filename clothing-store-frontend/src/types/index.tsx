export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  color: string;
  size: string;
  type: number; 
  quantity: number;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "0" | "1";
  balance: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
