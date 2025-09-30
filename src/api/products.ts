import { api } from "./client";
import type { Product } from "@/types/product";

export const listProducts = async () => {
  const { data } = await api.get<Product[]>("/products");
  return data;
};
export const getProduct = async (id: number) => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};
export const createProduct = async (payload: Omit<Product, "id">) => {
  const { data } = await api.post<Product>("/products", payload);
  return data;
};
export const updateProduct = async (id: number, payload: Partial<Product>) => {
  const { data } = await api.put<Product>(`/products/${id}`, payload);
  return data;
};
export const deleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`);
  return id;
};
