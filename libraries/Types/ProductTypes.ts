interface Category {
  name: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  quantity: number;
  weight: number;
  price: number;
  wholesale_price: number;
  brand: string;
  description: string;
  date_of_manufacture: string;
  date_of_entry: string;
  supplier: string;
  stock_status: string;
  unit_of_measure: number;
  expiration: string;
  minimum_stock_level: number;
  maximum_stock_level: number;
  createdAt: string;
  updatedAt: string;

  Category: Category[];
}
