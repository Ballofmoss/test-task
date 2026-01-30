import apiClient from "./apiClient";
import type { LoginData, RegisterData, User } from "../types";

export const authApi = {
  register: (data: RegisterData) =>
    apiClient.post<User>("/auth/register", {
      username: data.username,
      email: data.email,
      passwordHash: data.password,
    }),

  login: (data: LoginData) =>
    apiClient.post<{ token: string; user: User }>("/auth/login", {
      username: data.username,
      password: data.password,
    }),
};
