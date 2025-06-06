import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private baseUrl = 'http://127.0.0.1:5000';  // URL de tu backend
  private theUser = new BehaviorSubject<User>(new User());

  constructor(private http: HttpClient) {
    this.verifyActualSession();
  }

  /**
   * Login con usuario y contraseña (tradicional)
   */
  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user);
  }

  /**
   * Login con token de Google (OAuth)
   */
  loginWithGoogle(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login/google`, { token });
  }

  /**
   * Guarda la sesión en localStorage
   */
  saveSession(dataSesion: any) {
    const data: User = {
      id: dataSesion?.user?.id,
      name: dataSesion?.user?.name,
      email: dataSesion?.user?.email,
      password: "",
      token: dataSesion?.token
    };
    localStorage.setItem('sesion', JSON.stringify(data));
    this.setUser(data);
  }

  /**
   * Actualiza el usuario actual
   */
  setUser(user: User) {
    this.theUser.next(user);
  }

  /**
   * Devuelve observable con el usuario actual
   */
  getUser() {
    return this.theUser.asObservable();
  }

  /**
   * Devuelve el usuario actual sin ser observable
   */
  public get activeUserSession(): User {
    return this.theUser.value;
  }

  /**
   * Cierra sesión
   */
  logout() {
    localStorage.removeItem('sesion');
    this.setUser(new User());
  }

  /**
   * Verifica si ya hay una sesión activa al cargar la app
   */
  verifyActualSession() {
    const actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion));
    }
  }

  /**
   * Devuelve true si hay sesión guardada
   */
  existSession(): boolean {
    return !!this.getSessionData();
  }

  /**
   * Devuelve los datos guardados en el localStorage
   */
  getSessionData() {
    return localStorage.getItem('sesion');
  }
}
