export class DeliveryOption {
    id: number;
    type: string;
    name_ar: string;
    name_en: string;
    estimated_hours: number;
    cost: number;
    deleted: number;
    deleted_at?: any;
    created_at?: any;
    updated_at?: any;
    pickup: boolean;
    delivery: boolean;
}
