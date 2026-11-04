import { serverFetch } from "@/lib/server-fetch";
import { Medicine, MedicineCategory } from "@/types/medicine.interface";

export const getAllMedicines = async (
  queryString = "",
): Promise<Medicine[]> => {
  try {
    const response = await serverFetch.get(
      `/medicines${queryString ? `?${queryString}` : ""}`,
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Medicine API failed:", result);
      return [];
    }

    if (Array.isArray(result.data)) {
      return result.data;
    }

    if (Array.isArray(result.data?.data)) {
      return result.data.data;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch medicines:", error);
    return [];
  }
};

export const getMedicineById = async (
  id: string,
): Promise<Medicine | null> => {
  try {
    const medicineId = id.trim();

    const response = await serverFetch.get(
      `/medicines/${medicineId}`,
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Medicine API Error:", result);
      return null;
    }

    return result.data ?? null;
  } catch (error) {
    console.error("Medicine Details Fetch Error:", error);
    return null;
  }
};

export const getMedicineCategories = async (): Promise<MedicineCategory[]> => {
  try {
    const response = await serverFetch.get("/medicines/categories");

    const result = await response.json();

    if (!response.ok || !result.success) {
      return [];
    }

    if (Array.isArray(result.data)) {
      return result.data;
    }

    if (Array.isArray(result.data?.data)) {
      return result.data.data;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};
