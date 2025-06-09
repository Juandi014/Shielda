import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DigitalSignature } from '../models/digital-signature.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DigitalSignatureService {
  constructor(private http: HttpClient) { }
  list(): Observable<DigitalSignature[]> {
    return this.http.get<DigitalSignature[]>(`${environment.url_ms_cinema}/api/digital-signatures`);
  }
  view(id: number): Observable<DigitalSignature> {
    return this.http.get<DigitalSignature>(`${environment.url_ms_cinema}/api/digital-signatures/${id}`);
  }
  create(userId: number, formData: FormData): Observable<DigitalSignature> {
    return this.http.post<DigitalSignature>(`${environment.url_ms_cinema}/api/digital-signatures/user/${userId}`, formData);
  }
  update(theDigitalSignature: DigitalSignature): Observable<DigitalSignature> {
    return this.http.put<DigitalSignature>(`${environment.url_ms_cinema}/api/digital-signatures/${theDigitalSignature.id}`, theDigitalSignature);
  }

  delete(id: number) {
    return this.http.delete<DigitalSignature>(`${environment.url_ms_cinema}/api/digital-signatures/${id}`);
  }

}
