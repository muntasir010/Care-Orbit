import { serverFetch } from "@/lib/server-fetch";
import { Medicine, MedicineCategory } from "@/types/medicine.interface";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getAllMedicines = async (
  queryString = "",
): Promise<Medicine[]> => {
  try {
    const response = await serverFetch.get(
      `/medicine${queryString ? `?${queryString}` : ""}`,
    );

    const result: ApiResponse<Medicine[] | { data: Medicine[] }> =
      await response.json();

    if (!result.success) return [];

    if (Array.isArray(result.data)) {
      return result.data;
    }

    return result.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch medicines:", error);
    return [];
  }
};

export const getMedicineById = async (id: string): Promise<Medicine | null> => {
  try {
    const response = await serverFetch.get(`/medicine/${id}`);
    const result: ApiResponse<Medicine> = await response.json();

    if (!result.success) return null;

    return result.data;
  } catch (error) {
    console.error("Failed to fetch medicine:", error);
    return null;
  }
};

export const getMedicineCategories = async () => {
  try {
    const response = await serverFetch.get("/medicine/categories");
    const result: ApiResponse<MedicineCategory[]> = await response.json();

    return result.success ? result.data : [];
  } catch (error) {
    console.error("Failed to fetch medicine categories:", error);
    return [];
  }
};
