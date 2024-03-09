import {User} from './user'
import { OrderItem } from './OrderItem'
import { Delivery } from  './Delivery'
import { Deserializable } from './deserializable.model'
import { BillingAddress } from './BillingAddress';
import { Payment } from './Payment'
import { DeliveryOption } from './DeliveryOption'
import { Warehouse } from 'src/app/models/Warehouse';

export class Order  implements Deserializable {
  id: number;
  date: string;
  number: string;
  state: string;
  total: string;
  subtotal: string;
  tax: string;
  currency: string;
  total_quantity: number;
  notes?: any;
  discount_total: string;
  coupon_total: string;
  deliverable: boolean;
  delivery_assign_date: string;
  delivered_date?: any;
  delivery_method: string;
  delivery_total: string;
  delivery_time?: any;
  delivery_distance?: any;
  post_process: number;
  post_url?: any;
  payment_state: string;
  tap_token?: any;
  tap_id?: any;
  shipping_state?: any;
  shipped_date?: any;
  shipping_total: string;
  user_id: number;
  delivery_id: number;
  billing_address_id: number;
  shipping_address_id?: any;
  seller_id?: any;
  payment_id: number;
  delivery_option_id: number;
  coupon_id?: any;
  deleted_at?: any;
  created_at: Date;
  updated_at: Date;
  formatted_total: number;
  formatted_subtotal: number;
  user: User;
  delivery: Delivery;
  coupon?: any;
  billing_address: BillingAddress;
  address :  BillingAddress;
  warehouse : Warehouse ;
  shipping_address?: any;
  seller?: any;
  payment: Payment;
  delivery_option: DeliveryOption;
  order_items: OrderItem[];
    deserialize(input: any) {
        Object.assign(this, input);
        // this.restaurant = new Restaurant().deserialize(input.restaurant);
        this.order_items = input.order_items.map(car => new OrderItem().deserialize(car));
        this.user = new User().deserialize(input.user);

        return this;
      }
}
