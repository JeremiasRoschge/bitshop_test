import { Component } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { Login } from './models/auth-model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent {
  constructor(private authService : AuthService, private router: Router) {}

  login: Login = new Login();

  onSubmit() {
  }

  Authentication(loginData: Login) {
    this.authService.loginEmployee(loginData).subscribe(
      (response) => {
        if (response && response.Token) {
          const token = response.Token;
          sessionStorage.setItem('token', token);
          this.authService.isAuthenticated().subscribe((isAuthenticated) => {
            if (isAuthenticated) {
              this.authService.updateAuthenticationStatus();
              this.router.navigate(['shop']);
            } else {
              console.error('Token no válido.', token);
            }
          });
        } else {
          console.error('La respuesta no contiene un token válido.', response);
  
          // Verificar si hay un mensaje de error personalizado en la respuesta
          if (response && response.error) {
            Swal.fire({
              title: "Error!",
              text: response.error,
              icon: "error"
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Usuario no autorizado, ingrese un PIN correspondiente.",
              icon: "error"
            });
          }
        }
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
