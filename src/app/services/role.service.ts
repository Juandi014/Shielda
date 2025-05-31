import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) { }
  list(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.url_ms_cinema}/theaters`);
  }
  view(id: number): Observable<Role> {
    return this.http.get<Role>(`${environment.url_ms_cinema}/theaters/${id}`);
  }
  create(newTheater: Role): Observable<Role> {
    delete newTheater.id;
    return this.http.post<Role>(`${environment.url_ms_cinema}/theaters`, newTheater);
  }
  update(theTheater: Role): Observable<Role> {
    return this.http.put<Role>(`${environment.url_ms_cinema}/theaters/${theTheater.id}`, theTheater);
  }

  delete(id: number) {
    return this.http.delete<Role>(`${environment.url_ms_cinema}/theaters/${id}`);
  }

}
