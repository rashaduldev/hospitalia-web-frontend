export type Privilege = {
  id: number;
  name: string;
  descName: string;
};

export type Role = {
  id: number;
  roleName: string;
  roleType: string;
  description?: string | null;
  imageUrl?: string | null;
  privileges: Privilege[];
};

export type PaginatedRoles = {
  content: Role[];
  page: number;
  limit: number;
  total: number;
  totalElements: number;
  totalPages: number;
};
