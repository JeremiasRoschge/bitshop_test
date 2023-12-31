export interface User {
  cuil: number;
  nombre_completo: string;
  pin: string;
  role: string;
}

export class Login {
  pin: string = "";
  Token: string = "";
  User: User | null = null;
  role: string = "Empleado"

}
