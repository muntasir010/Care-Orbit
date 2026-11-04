import type { Medicine } from "./medicine.interface";

export interface CartItem {
  id: string;
  cartId: string;
  medicineId: string;
  quantity: number;
  createdAt: string;
  medicine: Medicine;
}

export interface Cart {
  id: string;
  patientId: string;
  updatedAt: string;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

export interface CartApiResponse {
  success: boolean;
  message: string;
  data: Cart;
}
