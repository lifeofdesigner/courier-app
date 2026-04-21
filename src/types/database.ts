export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          booking_id: string | null;
          tracking_number: string;
          reference_code: string | null;
          service_type: string;
          package_type: string | null;
          origin_country: string;
          origin_city: string;
          destination_country: string;
          destination_city: string;
          recipient_name: string;
          recipient_phone: string | null;
          sender_name: string | null;
          weight_kg: number;
          declared_value: number;
          currency: string;
          status: string;
          label_url: string | null;
          label_generated_at: string | null;
          estimated_delivery_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      tracking_events: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      pricing_rules: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      quotes: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      addresses: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string | null;
          quote_id: string | null;
          pickup_address_id: string | null;
          delivery_address_id: string | null;
          sender_name: string;
          sender_email: string;
          sender_phone: string | null;
          recipient_name: string;
          recipient_email: string | null;
          recipient_phone: string | null;
          service_type: string;
          package_type: string | null;
          weight_kg: number;
          declared_value: number;
          pickup_date: string;
          pickup_window: string | null;
          special_instructions: string | null;
          status: string;
          payment_status:
            | "unpaid"
            | "checkout_created"
            | "paid"
            | "payment_failed"
            | "refunded";
          payment_provider: string | null;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          amount_due: number;
          amount_paid: number;
          currency: string;
          label_url: string | null;
          label_generated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      cms_content: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      site_settings: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
