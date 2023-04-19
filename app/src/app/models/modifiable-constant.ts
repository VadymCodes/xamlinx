export class ModifiableConstant<T = number> {
  id: number;
  const_name: string;
  const_value: T;
  created_at: string;
  deleted_at: string;
  is_modifiable_by_admin: boolean;
  updated_at: string;

  constructor(
    id: number,
    const_name: string,
    const_value: T,
    created_at: string,
    deleted_at: string,
    is_modifiable_by_admin: boolean,
    updated_at: string
  ) {
    this.id = id;
    this.const_name = const_name;
    this.const_value = const_value;
    this.created_at = created_at;
    this.deleted_at = deleted_at;
    this.is_modifiable_by_admin = is_modifiable_by_admin;
    this.updated_at = updated_at;
  }
}
