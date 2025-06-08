import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityQuestion } from '../models/security-question.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionService {
  constructor(private http: HttpClient) { }
  list(): Observable<SecurityQuestion[]> {
    return this.http.get<SecurityQuestion[]>(`${environment.url_ms_cinema}/api/security-questions`);
  }
  view(id: number): Observable<SecurityQuestion> {
    return this.http.get<SecurityQuestion>(`${environment.url_ms_cinema}/api/security-questions/${id}`);
  }
  create(newSecurityQuestion: SecurityQuestion): Observable<SecurityQuestion> {
    delete newSecurityQuestion.id;
    return this.http.post<SecurityQuestion>(`${environment.url_ms_cinema}/api/security-questions`, newSecurityQuestion);
  }
  update(theSecurityQuestion: SecurityQuestion): Observable<SecurityQuestion> {
    return this.http.put<SecurityQuestion>(`${environment.url_ms_cinema}/api/security-questions/${theSecurityQuestion.id}`, theSecurityQuestion);
  }

  delete(id: number) {
    return this.http.delete<SecurityQuestion>(`${environment.url_ms_cinema}/api/security-questions/${id}`);
  }

}
