import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathjaxService {

  constructor() { }
  nativeGlobal() { return window }
}