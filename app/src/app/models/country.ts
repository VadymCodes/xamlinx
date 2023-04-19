export class Country {
  id: number;
  country_name: string;
  currency: string | undefined;
  code: string | undefined;

  constructor(
    id: number,
    country_name: string,
  ) {
    this.id = id;
    this.country_name = country_name;
  }
}
