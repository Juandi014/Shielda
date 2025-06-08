import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User;

  constructor(public securityService: SecurityService, private router: Router) {
    this.user = { email: '', password: '' };
  }

  login() {
    this.securityService.login(this.user).subscribe({
      next: (data) => {
        this.securityService.saveSession(data);
        this.router.navigateByUrl('/dashboard').then(() => {
          window.location.reload(); // 🔄 fuerza la recarga para evitar overlays visuales
        });
      },
      error: () => {
        Swal.fire('Autenticación Inválida', 'Usuario o contraseña inválido', 'error');
      }
    });
  }

  ngOnInit() {
    // Si ya hay sesión activa, redirigir automáticamente
    if (this.securityService.existSession()) {
      this.router.navigateByUrl('/dashboard');
      return;
    }

    // Maneja la respuesta de Google
    (window as any).handleCredentialResponse = (response: any) => {
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));

      const userData: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        password: '',
        token: token,
        photoUrl: payload.picture
      };

     // Paso nuevo: intentar guardar en tabla de usuarios
fetch('http://127.0.0.1:5000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: userData.name,
    email: userData.email
  })
})
.finally(() => {
  // Guardar sesión local y continuar pase lo que pase
  localStorage.setItem('sesion', JSON.stringify(userData));
  this.securityService.setUser(userData);

  this.router.navigateByUrl('/dashboard').then(() => {
    window.location.reload();
  });
});

    };

    // Inicializar botón de Google
    google.accounts.id.initialize({
      client_id: '759642482587-gur2fcq9tudc0devl6t22uel9ft876bv.apps.googleusercontent.com',
      callback: (response: any) => (window as any).handleCredentialResponse(response)
    });

    // Renderizar botón
    google.accounts.id.renderButton(
      document.querySelector('.g_id_signin'),
      { theme: 'outline', size: 'large' }
    );
  }

  ngOnDestroy() {
    // Nada por limpiar aún
  }
}
