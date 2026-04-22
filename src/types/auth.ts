import type { PreservedFormValues } from "@/lib/forms/preserve";

export interface AuthActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  values?: PreservedFormValues;
  redirectTo?: string;
}

export interface BootstrapAccessActionState {
  success: boolean;
  message: string;
}

export interface AppUserProfile {
  id: string;
  fullName: string | null;
  phone: string | null;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}
