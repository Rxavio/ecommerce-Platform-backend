export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse {
  pageNumber: number;
  pageSize: number;
  totalSize: number;
  data: T[];
}
