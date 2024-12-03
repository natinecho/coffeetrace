interface Destination {
  time: string;
  color: string;
  content: string;
  latitude: number;
  longitude: number;
}

interface RecentTransactionsProps {
  id: Destination[];
}

interface UserData {
  name: string;
  email: string;
  role: string;
}

// types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Add the role property
}

export interface Product {
  id: string;
  farmer_id: string;
  farmer_name: string;
  product_name: string;
  description: string;
  price: string;
  quantity: string;
  origin: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  rating: number;
}

export type { Destination, RecentTransactionsProps, UserData };
