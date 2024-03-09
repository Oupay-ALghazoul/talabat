import { Deserializable } from "../content/orders/models/deserializable.model";
import { Permission } from "./Permission";

export class Role implements Deserializable{
  id: number;
  type?: any;
  name_en: string;
  name_ar: string;
  deleted_at?: any;
  created_at: Date;
  updated_at: Date;
  permissions: Permission[];
    deserialize(input: any) {
      Object.assign(this, input);
      this.permissions = input.permissions.map(car => new Permission().deserialize(car));
      return this;
  }
}