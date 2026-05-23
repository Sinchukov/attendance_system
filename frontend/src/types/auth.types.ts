export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role: "teacher" | "admin";
}

export interface User {
  id: number;
  email: string;
  role: "teacher" | "admin";
}

export interface AuthResponse {
  access_token: string;
  user: User;
}