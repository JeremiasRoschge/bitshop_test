import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesUserService {

  private userRoleChange: EventEmitter<string | null> = new EventEmitter();

  getUserRole(): string | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  setUserRole(role: string | null): void {
    this.userRoleChange.emit(role);
  }

  onUserRoleChange(): EventEmitter<string | null> {
    return this.userRoleChange;
  }
}
