import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Password } from '../models/password.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(private http: HttpClient) { }
  list(): Observable<Password[]> {
    return this.http.get<Password[]>(`${environment.url_ms_cinema}/api/passwords`);
  }
  view(id: number): Observable<Password> {
    return this.http.get<Password>(`${environment.url_ms_cinema}/api/passwords/${id}`);
  }
  create(userId: number, newPassword: Password): Observable<Password> {
    delete newPassword.id;
    return this.http.post<Password>(`${environment.url_ms_cinema}/api/passwords/user/${userId}`, newPassword);
  }
  update(thePassword: Password): Observable<Password> {
    return this.http.put<Password>(`${environment.url_ms_cinema}/api/passwords/${thePassword.id}`, thePassword);
  }

  delete(id: number) {
    return this.http.delete<Password>(`${environment.url_ms_cinema}/api/passwords/${id}`);
  }

}
