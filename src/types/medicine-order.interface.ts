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

export type MedicinePaymentMethod = "ONLINE" | "COD";

export interface CheckoutCartMedicine {
  id: string;
  name: string;
  image?: string | null;
  price: number;
  discountPercent: number;
  stock: number;
}

export interface CheckoutCartItem {
  id: string;
  medicineId: string;
  quantity: number;
  medicine: CheckoutCartMedicine;
}

export interface CheckoutCart {
  id: string;
  items: CheckoutCartItem[];
  subtotal: number;
  totalItems: number;
}

export interface CreateMedicineOrderPayload {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: MedicinePaymentMethod;
  items: MedicineOrderItemPayload[];
}

export interface CheckoutPayload {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: MedicinePaymentMethod;
}

export interface MedicineOrderItemPayload {
  medicineId: string;
  quantity: number;
}

export interface MedicineOrder {
  id: string;
  orderNumber?: string;
  status: string;
  paymentStatus: string;
  paymentMethod: MedicinePaymentMethod;
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  createdAt: string;
}
