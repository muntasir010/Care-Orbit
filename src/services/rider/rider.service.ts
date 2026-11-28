import { serverFetch } from "@/lib/server-fetch";

export const getAllRiders = async () => {
  return await serverFetch.get("/rider");
};

export const getSingleRider = async (id: string) => {
  return await serverFetch.get(`/rider/${id}`);
};

export const getMyDeliveries = async () => {
  return await serverFetch.get("/rider/my-deliveries");
};

export const getOrderTracking = async (orderId: string) => {
  return await serverFetch.get(`/medicine-order/${orderId}/tracking`);
};
