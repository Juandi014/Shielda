import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from '../models/user-role.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  constructor(private http: HttpClient) { }
  list(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_cinema}/api/user-roles`);
  }
  view(id: number): Observable<UserRole> {
    return this.http.get<UserRole>(`${environment.url_ms_cinema}/api/user-roles/${id}`);
  }
  create(userId: number, roleId: number, newUserRole: UserRole): Observable<UserRole> {
    delete newUserRole.id;
    return this.http.post<UserRole>(`${environment.url_ms_cinema}/api/user-roles/user/${userId}/role/${roleId}`, newUserRole);
  }
  update(theUserRole: UserRole): Observable<UserRole> {
    return this.http.put<UserRole>(`${environment.url_ms_cinema}/api/user-roles/${theUserRole.id}`, theUserRole);
  }

  delete(id: number) {
    return this.http.delete<UserRole>(`${environment.url_ms_cinema}/api/user-roles/${id}`);
  }

  getUsersByRole(roleId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_cinema}/api/user-roles/role/${roleId}`);
  }

  getRolesByUser(userId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${environment.url_ms_cinema}/api/user-roles/user/${userId}`);
  }
  
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url_ms_cinema}/api/users`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url_ms_cinema}/api/roles`);
  }

}
