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
  shippingDistrict: string;
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

export interface MedicineOrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;

  medicine?: {
    id: string;
    name: string;
    image?: string | null;
    strength?: string | null;
    dosageForm?: string;
  };
}

export interface MedicineOrder {
  id: string;
  orderNumber: string;

  patientId?: string;

  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: MedicinePaymentMethod;

  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;

  shippingName: string;
  shippingPhone: string;
  shippingDistrict: string;
  shippingAddress: string;

  note?: string | null;
  transactionId?: string | null;

  createdAt: string;
  updatedAt?: string;

  items: MedicineOrderItem[];

  patient?: {
    id: string;
    name: string;
    email: string;
  };
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
