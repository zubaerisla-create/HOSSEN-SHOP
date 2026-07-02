export interface Product {
  id: string;
  name: string;
  rating: number;
  ratingCount: number;
  price: number;
  unit: string;
  originalPrice?: number;
  discount?: number; // e.g., 7 for 7% OFF
  image: string;
  isFlashDeal?: boolean;
  flashLabel?: string;
  flashDiscount?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Feature {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'delivery' | 'organic' | 'delivery-time' | 'secure-pay';
}
