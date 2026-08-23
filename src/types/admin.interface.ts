export interface IAdmin {
    id?: string;
    email: string;
    name: string;
    profilePhoto?: string | null;
    contactNumber: string;
    isDeleted: boolean;
    sortKey: string | null;
    createdAt: string;
    updatedAt: string;
}