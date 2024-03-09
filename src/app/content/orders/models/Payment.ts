
export interface Payment {
    id: number;
    type: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    instructions_en: string;
    instructions_ar: string;
    publishable_key?: any;
    secret_key?: any;
    activated: boolean;
    deleted: number;
    deleted_at?: any;
    created_at?: any;
    updated_at: Date;
}