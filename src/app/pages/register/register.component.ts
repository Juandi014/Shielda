import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User = { name: '', email: '', password: '' };

  constructor(
    private userService: UserService,
    private securityService: SecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔐 Inicializar botón de Google
    google.accounts.id.initialize({
      client_id: '759642482587-gur2fcq9tudc0devl6t22uel9ft876bv.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleRegister(response)
    });

    google.accounts.id.renderButton(
      document.querySelector('.g_id_signin'),
      { theme: 'outline', size: 'large' }
    );

    // 🔐 IMPORTANTE: hace visible la función al atributo `data-callback`
    (window as any).handleGoogleRegister = this.handleGoogleRegister.bind(this);
  }

  register(): void {
    this.userService.create(this.user).subscribe({
      next: () => {
        Swal.fire('Registrado', 'Usuario creado correctamente', 'success');
        this.router.navigate(['/login']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el usuario', 'error');
      }
    });
  }

  handleGoogleRegister(response: any): void {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));

    const userData: User = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      password: '',
      token: token,
      photoUrl: payload.picture
    };

    this.userService.create(userData).subscribe({
      next: () => {
        localStorage.setItem('sesion', JSON.stringify(userData));
        this.securityService.setUser(userData);
        this.router.navigateByUrl('/dashboard').then(() => window.location.reload());
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
      }
    });
  }
}
