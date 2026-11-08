export interface Apartment {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  features: string[];
  isActive: boolean;
}
