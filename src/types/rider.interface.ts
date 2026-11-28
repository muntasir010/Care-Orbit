export type DeliveryStatus =
  | "ASSIGNED"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "FAILED";

export interface Rider {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber: string;
  address?: string | null;
  isAvailable: boolean;
  isDeleted: boolean;
  createdAt?: string;
  _count?: {
    assignments: number;
    riderReviews: number;
  };
}

export interface MedicineInfo {
  id: string;
  name: string;
  image?: string | null;
  strength?: string | null;
}

export interface DeliveryOrderItem {
  id: string;
  quantity: number;
  medicine: MedicineInfo;
}

export interface DeliveryPatient {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
}

export interface DeliveryLocation {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  recordedAt: string;
}

export interface RiderDelivery {
  id: string;
  orderId: string;
  riderId: string;
  status: DeliveryStatus;
  assignedAt: string;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  order: {
    id: string;
    status: string;
    paymentStatus: string;
    totalAmount?: number;
    shippingAddress?: string;
    recipientName?: string;
    phone?: string;
    city?: string;
    items: DeliveryOrderItem[];
    patient: DeliveryPatient;
  };
  locations?: DeliveryLocation[];
}

export interface RiderTrackingResponse {
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: DeliveryStatus | null;
  rider: {
    id: string;
    name: string;
    contactNumber: string;
    profilePhoto?: string | null;
  } | null;
  currentLocation: DeliveryLocation | null;
}

export interface CreateRiderPayload {
  password: string;
  rider: {
    name: string;
    email: string;
    contactNumber: string;
    address?: string;
  };
}

export interface RiderReviewPayload {
  rating: number;
  comment: string;
}