import { Product } from "src/app/models/Product";
import { UnitDimensions } from "src/app/models/UnitDimensions";
import { UnitImage } from "src/app/models/UnitImage";
import { Deserializable } from './deserializable.model'

export class OrderItem  implements Deserializable {
  id: number;
  date: string;
  unit_name_en: string;
  unit_name_ar: string;
  unit_dimensions: UnitDimensions;
  unit_weight?: any;
  unit_price: string;
  unit_discount?: any;
  unit_special_offer?: any;
  unit_image: UnitImage;
  unit_color?: any;
  unit_size?: any;
  subtracted: number;
  brand_name_en: string;
  brand_name_ar: string;
  purchased_with_points: boolean;
  points: number;
  tax: string;
  total: string;
  subtotal: string;
  discount_total: string;
  special_offer_total: string;
  quantity: number;
  notes?: any;
  order_id: number;
  product_id: number;
  seller_id: number;
  deleted_at?: any;
  created_at?: any;
  updated_at?: any;
  product: Product;
  deserialize(input: any) {
      Object.assign(this, input);
      this.product = new Product().deserialize(input.product);

      return this;
    }
}