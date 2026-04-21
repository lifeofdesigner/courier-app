import type { ReactNode } from "react";

export type ComponentSize = "sm" | "md" | "lg";

export type StatusTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type FooterColumn = {
  title: string;
  items: NavItem[];
};

export type FormFieldBaseProps = {
  label?: string;
  helperText?: string;
  error?: string;
};

export type PageAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

export type WithChildren<T = object> = T & {
  children?: ReactNode;
};
