import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../models/session.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private http: HttpClient) { }
  list(): Observable<Session[]> {
    return this.http.get<Session[]>(`${environment.url_ms_cinema}/api/sessions`);
  }
  view(id: number): Observable<Session> {
    return this.http.get<Session>(`${environment.url_ms_cinema}/api/sessions/${id}`);
  }
  create(userId: number, newSession: Session): Observable<Session> {
    delete newSession.id;
    return this.http.post<Session>(`${environment.url_ms_cinema}/api/sessions/user/${userId}`, newSession);
  }
  update(theSession: Session): Observable<Session> {
    return this.http.put<Session>(`${environment.url_ms_cinema}/api/sessions/${theSession.id}`, theSession);
  }

  delete(id: number) {
    return this.http.delete<Session>(`${environment.url_ms_cinema}/api/sessions/${id}`);
  }

}
