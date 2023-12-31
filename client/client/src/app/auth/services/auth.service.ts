import { Injectable } from '@angular/core';
import { Login } from "../models/auth-model";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, switchMap, map } from "rxjs/operators";
import { Router } from '@angular/router';
import {ServicesUserService} from "../../services-user/services-user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly headers: HttpHeaders;
  constructor(private http: HttpClient, private router: Router, private userService: ServicesUserService) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      '__RequestVerificationSource': 'SrcRefM',
      '__RequestVerificationToken': 'Pe:Po',
    });
  }

  private loggedInUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  loggedInUser$: Observable<any> = this.loggedInUserSubject.asObservable();

  private validateToken(token: string) {
    console.log('Token enviado en la solicitud de validación:', token);
    return this.http.get<any>(`${this.url}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  url:string = "https://dev1.bitsion.com:61092/api/api";

  loginEmployee(loginData: any): Observable<any> {
    return this.http.post<Login>(`${this.url}/auth/login`, loginData, { headers: this.headers }).pipe(
      tap((response) => {
        console.log('Respuesta del servidor al iniciar sesión:', response);
        sessionStorage.setItem('token', response.Token);
        sessionStorage.setItem('user', JSON.stringify(response.User));
        this.userService.setUserRole(JSON.stringify(response.User));
        const user = sessionStorage.getItem('user')
        console.log(user)
        this.loggedInUserSubject.next(response.User);
        this.updateAuthenticationStatus();
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión:', error);
        return of(null);
      })
    );
  }


  isAdmin(): boolean {
    const user = sessionStorage.getItem('user');
    const isAdmin = user ? JSON.parse(user).role === 'Admin' : false;
    console.log('isAdmin:', isAdmin);
    return isAdmin;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.loggedInUserSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    const token = sessionStorage.getItem('token');
    if (token) {
      return this.validateToken(token).pipe(
        map((response) => {
          if (response && response.Valid) {
            this.updateAuthenticationStatus();
            return true;
          } else {
            console.error('AuthService - Token no válido. Método isAuthenticated', token);
            return false;
          }
        }),
        catchError(() => of(false))
      );
    } else {
      console.log('AuthService - No hay token almacenado');
      return of(false); // El usuario no está autenticado
    }
  }
  updateAuthenticationStatus() {
    this.isAuthenticatedSubject.next(true);
  }
}
