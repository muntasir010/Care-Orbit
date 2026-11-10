
export interface MedicineCategory {
  id: string;
  name: string;
  slug?: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  description?: string | null;
  strength?: string | null;
  dosageForm: string;
  packSize?: string | null;
  price: number;
  discountPercent: number;
  stock: number;
  image?: string | null;
  isActive: boolean;
  categoryId: string;
  category?: MedicineCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicineListResponse {
  success: boolean;
  message: string;
  data: Medicine[] | {
    data: Medicine[];
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  };
}

export interface MedicineCategoryResponse {
  success: boolean;
  message: string;
  data: MedicineCategory[];
}
