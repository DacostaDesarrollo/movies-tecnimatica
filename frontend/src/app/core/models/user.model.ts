export interface User {
  name: string
  email: string,
  token: string,
  createdAt?: Date
}

export interface RegisterRequest {
  name:string,
  email: string,
  password: string,
}

export interface LoginRequest {
  email: string,
  password: string
}

export interface AuthResponse {
  message: string,
  name:string,
  email: string,
  token: string,
  createdAt?: string
}

export interface ErrorResponse {
  error: string,
  details?: string
}
