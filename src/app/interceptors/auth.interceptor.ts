import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private securityService: SecurityService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const theUser = this.securityService.activeUserSession;
    const token = theUser["token"];

    // 🚫 Ignorar login o validación de token
    if (request.url.includes('/login') || request.url.includes('/token-validation')) {
      console.log("🔓 No se pone token");
      return next.handle(request);
    }

    // ✅ Aumentar contador según la entidad afectada
    this.incrementEntityCounter(request.url);

    // ✅ Adjuntar token a la solicitud
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authRequest).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          Swal.fire({
            title: 'No está autorizado para esta operación',
            icon: 'error',
            timer: 5000
          });
          this.router.navigateByUrl('/dashboard');
        } else if (err.status === 400) {
          Swal.fire({
            title: 'Existe un error, contacte al administrador',
            icon: 'error',
            timer: 5000
          });
        }
        return new Observable<never>();
      })
    );
  }

  // 🧮 Incrementa el contador en localStorage según URL
  incrementEntityCounter(url: string): void {
    if (url.includes('/users')) {
      this.incrementCounter('users');
    }
    if (url.includes('/roles')) {
      this.incrementCounter('roles');
    }
    if (url.includes('/permissions')) {
      this.incrementCounter('permissions');
    }
  }

  incrementCounter(key: string): void {
    const current = Number(localStorage.getItem(`count_${key}`)) || 0;
    localStorage.setItem(`count_${key}`, (current + 1).toString());
    console.log(`📊 ${key} counter: ${current + 1}`);
  }
}
