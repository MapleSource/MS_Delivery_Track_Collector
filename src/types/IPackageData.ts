export interface PackageData {
  sender_name: string;
  sender_address: string;
  sender_phone: string;
  sender_email: string;

  recipient_name: string;
  recipient_address: string;
  recipient_zip: string;
  recipient_colony: string;
  recipient_city: string;
  recipient_state: string;
  recipient_country: string;
  recipient_reference: string;
  recipient_email: string;
  recipient_phone: string;

  package_weight: number;
  package_dimensions: string;
  order_id: string;
  package_id: string;

  package_created_at: string;
  package_updated_at: string;
  package_status: string;
  package_notes: string | null;
  package_lat: number | null;
  package_long: number | null;
  package_distance: number;

  package_custom_id: string;
  package_custom_id_name: string;
}
