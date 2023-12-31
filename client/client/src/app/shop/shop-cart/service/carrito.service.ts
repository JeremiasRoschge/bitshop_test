// carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private isMenuOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  get isMenuOpen$(): Observable<boolean> {
    return this.isMenuOpenSubject.asObservable();
  }

  toggleMenu() {
    this.isMenuOpenSubject.next(!this.isMenuOpenSubject.value);
  }
}
