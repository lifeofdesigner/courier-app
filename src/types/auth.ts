export interface AuthActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  redirectTo?: string;
}

export interface AppUserProfile {
  id: string;
  fullName: string | null;
  phone: string | null;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}
