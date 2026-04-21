export interface SavedAddressRecord {
  id: string;
  label: string | null;
  contactName: string;
  companyName: string | null;
  phone: string | null;
  email: string | null;
  line1: string;
  line2: string | null;
  city: string;
  stateRegion: string | null;
  postalCode: string | null;
  country: string;
  addressType: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormInput {
  label?: string;
  contactName: string;
  companyName?: string;
  phone?: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  stateRegion?: string;
  postalCode?: string;
  country: string;
}
