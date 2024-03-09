export class AppPreference {
    id: number;
    orders: boolean;
    promotions: boolean;
    others: boolean;
    emails: boolean;
    image_quality: string;
    user_id: number;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
}
