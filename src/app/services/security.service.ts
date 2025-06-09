import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private baseUrl = 'http://127.0.0.1:5000';  // URL del backend
  private sessionKey = 'sesion';
  private theUser = new BehaviorSubject<User>(new User());

  constructor(private http: HttpClient) {
    this.verifyActualSession();
  }

  /**
   * Login tradicional con email y password
   */
  login(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, user);
  }

  /**
   * Login con Google OAuth (si lo usas)
   */
  loginWithGoogle(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login/google`, { token });
  }

  /**
   * Guarda la sesión y actualiza el observable
   */
  saveSession(user: User): void {
    const sessionData: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      token: user.token || '',
      photoUrl: user.photoUrl || '' // puede ser base64 o URL
    };
    localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    this.setUser(sessionData);
  }

  /**
   * Setter del usuario logueado
   */
  setUser(user: User): void {
    this.theUser.next(user);
  }

  /**
   * Getter reactivo (observable) del usuario
   */
  getUser(): Observable<User> {
    return this.theUser.asObservable();
  }

  /**
   * Getter sincrónico del usuario
   */
  get activeUserSession(): User {
    return this.theUser.value;
  }

  /**
   * Cierra sesión completamente
   */
  logout(): void {
    localStorage.removeItem(this.sessionKey);
    this.setUser(new User());
  }

  /**
   * Verifica si ya existe una sesión guardada
   */
  existSession(): boolean {
    return !!localStorage.getItem(this.sessionKey);
  }

  /**
   * Al iniciar el servicio, carga sesión si ya existía
   */
  verifyActualSession(): void {
    const session = this.getSessionData();
    if (session) {
      const user: User = JSON.parse(session);
      this.setUser(user);
    }
  }

  /**
   * Accede directamente a los datos del localStorage
   */
  getSessionData(): string | null {
    return localStorage.getItem(this.sessionKey);
  }
}
