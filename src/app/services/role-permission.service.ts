import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolePermission } from '../models/role-permission.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  constructor(private http: HttpClient) { }
  list(): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(`${environment.url_ms_cinema}/api/role-permissions`);
  }
  view(id: number): Observable<RolePermission> {
    return this.http.get<RolePermission>(`${environment.url_ms_cinema}/api/role-permissions/${id}`);
  }
  create(roleId: number, permissionId:number, newRolePermission: RolePermission): Observable<RolePermission> {
    delete newRolePermission.id;
    return this.http.post<RolePermission>(`${environment.url_ms_cinema}/api/role-permissions/role/${roleId}/permission/${permissionId}`, newRolePermission);
  }
  update(theRolePermission: RolePermission): Observable<RolePermission> {
    return this.http.put<RolePermission>(`${environment.url_ms_cinema}/api/role-permissions/${theRolePermission.id}`, theRolePermission);
  }

  delete(id: number) {
    return this.http.delete<RolePermission>(`${environment.url_ms_cinema}/api/role-permissions/${id}`);
  } 

}
