export class Setting<T> {
  id: string;
  name: string;
  value: T;

  constructor(id: string, name: string, value: T) {
    this.id = id;
    this.name = name;
    this.value = value;
  }
}
