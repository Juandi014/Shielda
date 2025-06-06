import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/address.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  constructor(private http: HttpClient) { }
  list(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.url_ms_cinema}/theaters`);
  }
  view(id: number): Observable<Address> {
    return this.http.get<Address>(`${environment.url_ms_cinema}/theaters/${id}`);
  }
  create(newAddress: Address): Observable<Address> {
    delete newAddress.id;
    return this.http.post<Address>(`${environment.url_ms_cinema}/theaters`, newAddress);
  }
  update(theAddress: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.url_ms_cinema}/theaters/${theAddress.id}`, theAddress);
  }

  delete(id: number) {
    return this.http.delete<Address>(`${environment.url_ms_cinema}/theaters/${id}`);
  }

}
