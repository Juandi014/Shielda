import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../models/device.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private http: HttpClient) { }
  list(): Observable<Device[]> {
    return this.http.get<Device[]>(`${environment.url_ms_cinema}/api/devices`);
  }
  view(id: number): Observable<Device> {
    return this.http.get<Device>(`${environment.url_ms_cinema}/api/devices/${id}`);
  }
  create(userId: number, newDevice: Device): Observable<Device> {
    delete newDevice.id;
    return this.http.post<Device>(`${environment.url_ms_cinema}/api/devices/user/${userId}`, newDevice);
  }
  update(theDevice: Device): Observable<Device> {
    return this.http.put<Device>(`${environment.url_ms_cinema}/api/devices/${theDevice.id}`, theDevice);
  }

  delete(id: number) {
    return this.http.delete<Device>(`${environment.url_ms_cinema}/api/devices/${id}`);
  }

}
