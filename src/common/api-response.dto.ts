export class ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;

  constructor(success: boolean, message?: string, data?: T, errors?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}