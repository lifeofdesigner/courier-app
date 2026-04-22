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
          transport_mode: "air" | "road" | "freight";
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
        Insert: {
          id?: string;
          user_id?: string | null;
          booking_id?: string | null;
          tracking_number: string;
          reference_code?: string | null;
          service_type: string;
          package_type?: string | null;
          transport_mode?: "air" | "road" | "freight";
          origin_country: string;
          origin_city: string;
          destination_country: string;
          destination_city: string;
          recipient_name: string;
          recipient_phone?: string | null;
          sender_name?: string | null;
          weight_kg?: number;
          declared_value?: number;
          currency?: string;
          status?: string;
          label_url?: string | null;
          label_generated_at?: string | null;
          estimated_delivery_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          booking_id?: string | null;
          tracking_number?: string;
          reference_code?: string | null;
          service_type?: string;
          package_type?: string | null;
          transport_mode?: "air" | "road" | "freight";
          origin_country?: string;
          origin_city?: string;
          destination_country?: string;
          destination_city?: string;
          recipient_name?: string;
          recipient_phone?: string | null;
          sender_name?: string | null;
          weight_kg?: number;
          declared_value?: number;
          currency?: string;
          status?: string;
          label_url?: string | null;
          label_generated_at?: string | null;
          estimated_delivery_date?: string | null;
          updated_at?: string;
        };
      };
      tracking_events: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          label: string;
          description: string | null;
          location_name: string | null;
          event_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          label: string;
          description?: string | null;
          location_name?: string | null;
          event_time: string;
          created_at?: string;
        };
        Update: {
          status?: string;
          label?: string;
          description?: string | null;
          location_name?: string | null;
          event_time?: string;
        };
      };
      pricing_rules: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      quotes: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string | null;
          email: string | null;
          origin_country: string;
          origin_city: string;
          destination_country: string;
          destination_city: string;
          service_type: string;
          package_type: string | null;
          transport_mode: "air" | "road" | "freight";
          weight_kg: number;
          declared_value: number;
          currency: string;
          subtotal: number;
          fuel_surcharge: number;
          remote_area_surcharge: number;
          total: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name?: string | null;
          email?: string | null;
          origin_country: string;
          origin_city: string;
          destination_country: string;
          destination_city: string;
          service_type: string;
          package_type?: string | null;
          transport_mode?: "air" | "road" | "freight";
          weight_kg: number;
          declared_value?: number;
          currency?: string;
          subtotal: number;
          fuel_surcharge: number;
          remote_area_surcharge: number;
          total: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string | null;
          full_name?: string | null;
          email?: string | null;
          origin_country?: string;
          origin_city?: string;
          destination_country?: string;
          destination_city?: string;
          service_type?: string;
          package_type?: string | null;
          transport_mode?: "air" | "road" | "freight";
          weight_kg?: number;
          declared_value?: number;
          currency?: string;
          subtotal?: number;
          fuel_surcharge?: number;
          remote_area_surcharge?: number;
          total?: number;
          status?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string | null;
          label: string | null;
          contact_name: string;
          company_name: string | null;
          phone: string | null;
          email: string | null;
          line_1: string;
          line_2: string | null;
          city: string;
          state_region: string | null;
          postal_code: string | null;
          country: string;
          address_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          label?: string | null;
          contact_name: string;
          company_name?: string | null;
          phone?: string | null;
          email?: string | null;
          line_1: string;
          line_2?: string | null;
          city: string;
          state_region?: string | null;
          postal_code?: string | null;
          country: string;
          address_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          label?: string | null;
          contact_name?: string;
          company_name?: string | null;
          phone?: string | null;
          email?: string | null;
          line_1?: string;
          line_2?: string | null;
          city?: string;
          state_region?: string | null;
          postal_code?: string | null;
          country?: string;
          address_type?: string;
          updated_at?: string;
        };
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
          transport_mode: "air" | "road" | "freight";
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
        Insert: {
          id?: string;
          user_id?: string | null;
          quote_id?: string | null;
          pickup_address_id?: string | null;
          delivery_address_id?: string | null;
          sender_name: string;
          sender_email: string;
          sender_phone?: string | null;
          recipient_name: string;
          recipient_email?: string | null;
          recipient_phone?: string | null;
          service_type: string;
          transport_mode?: "air" | "road" | "freight";
          package_type?: string | null;
          weight_kg: number;
          declared_value?: number;
          pickup_date: string;
          pickup_window?: string | null;
          special_instructions?: string | null;
          status?: string;
          payment_status?:
            | "unpaid"
            | "checkout_created"
            | "paid"
            | "payment_failed"
            | "refunded";
          payment_provider?: string | null;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          amount_due?: number;
          amount_paid?: number;
          currency?: string;
          label_url?: string | null;
          label_generated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          quote_id?: string | null;
          pickup_address_id?: string | null;
          delivery_address_id?: string | null;
          sender_name?: string;
          sender_email?: string;
          sender_phone?: string | null;
          recipient_name?: string;
          recipient_email?: string | null;
          recipient_phone?: string | null;
          service_type?: string;
          transport_mode?: "air" | "road" | "freight";
          package_type?: string | null;
          weight_kg?: number;
          declared_value?: number;
          pickup_date?: string;
          pickup_window?: string | null;
          special_instructions?: string | null;
          status?: string;
          payment_status?:
            | "unpaid"
            | "checkout_created"
            | "paid"
            | "payment_failed"
            | "refunded";
          payment_provider?: string | null;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          amount_due?: number;
          amount_paid?: number;
          currency?: string;
          label_url?: string | null;
          label_generated_at?: string | null;
          updated_at?: string;
        };
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
