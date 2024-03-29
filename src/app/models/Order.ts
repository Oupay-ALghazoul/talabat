import { User } from './User' ;
import { DeliveryOption } from './DeliveryOption' ;
import { Payment } from './Payment' ;
import { OrderItem } from './OrderItem' ;
import { BillingAddress } from './BillingAddress'

export class Order {
    id: number;
    date: string;
    number: string;
    state: string;
    total: string;
    subtotal: string;
    tax: string;
    currency: string;
    total_quantity: number;
    notes: string;
    discount_total: string;
    coupon_total: string;
    delivery_assign_date?: any;
    delivered_date?: any;
    delivery_method: string;
    delivery_total: string;
    delivery_time?: any;
    payment_state: string;
    tap_token?: any;
    tap_id?: any;
    shipping_state?: any;
    shipped_date?: any;
    shipping_total: string;
    user_id: number;
    delivery_id?: any;
    billing_address_id: number;
    shipping_address_id?: any;
    seller_id?: any;
    payment_id: number;
    delivery_option_id: number;
    coupon_id?: any;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    user: User;
    delivery?: any;
    coupon?: any;
    billing_address: BillingAddress;
    shipping_address?: any;
    seller?: any;
    payment: Payment;
    delivery_option: DeliveryOption;
    order_items: OrderItem[];
}