import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  constructor(private http: HttpClient) { }
  list(): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${environment.url_ms_cinema}/api/answers`);
  }
  view(id: number): Observable<Answer> {
    return this.http.get<Answer>(`${environment.url_ms_cinema}/api/answers/${id}`);
  }
  create(userId: number, questionId:number, newAnswer: Answer): Observable<Answer> {
    delete newAnswer.id;
    return this.http.post<Answer>(`${environment.url_ms_cinema}/api/answers/user/${userId}/question/${questionId}`, newAnswer);
  }
  update(theAnswer: Answer): Observable<Answer> {
    return this.http.put<Answer>(`${environment.url_ms_cinema}/api/answers/${theAnswer.id}`, theAnswer);
  }

  delete(id: number) {
    return this.http.delete<Answer>(`${environment.url_ms_cinema}/api/answers/${id}`);
  }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url_ms_cinema}/api/users`);
  }

  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url_ms_cinema}/api/security-questions`);
  }

}
