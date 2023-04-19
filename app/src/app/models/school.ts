import { Country } from "./country";

export class School {
  id: number;
  school_name: string;
  school_abbreviation: string[];
  school_url: string;
  school_city: string;
  school_state: string;
  country_id: number;
  offer_email: boolean | undefined;
  country: Country | undefined;

  constructor(
    id: number,
    school_name: string,
    school_abbreviation: string[],
    school_url: string,
    school_city: string,
    school_state: string,
    country_id: number
  ) {
    this.id = id;
    this.school_name = school_name;
    this.school_abbreviation = school_abbreviation;
    this.school_url = school_url;
    this.school_city = school_city;
    this.school_state = school_state;
    this.country_id = country_id;
  }
}
