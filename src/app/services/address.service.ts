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
    return this.http.get<Address[]>(`${environment.url_ms_cinema}/api/addresses`);
  }
  view(id: number): Observable<Address> {
    return this.http.get<Address>(`${environment.url_ms_cinema}/api/addresses/user/${id}`);
  }
  create(userId: number, newAddress: Address): Observable<Address> {
    delete newAddress.id;
    return this.http.post<Address>(`${environment.url_ms_cinema}/api/addresses/user/${userId}`, newAddress);
  }
  update(theAddress: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.url_ms_cinema}/api/addresses/${theAddress.id}`, theAddress);
  }
 getByUserId(userId: number): Observable<Address | null> {
  return this.http.get<Address>(`${environment.url_ms_cinema}/api/addresses/user/${userId}`);
}


  delete(id: number) {
    return this.http.delete<Address>(`${environment.url_ms_cinema}/api/addresses/${id}`);
  }

}
