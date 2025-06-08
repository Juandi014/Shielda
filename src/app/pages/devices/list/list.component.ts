import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from 'src/app/models/device.model';
import { DeviceService } from 'src/app/services/device.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  devices: Device[] = [];
  constructor(private devicesService:DeviceService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(){
    this.devicesService.list().subscribe({
      next: (devices) => {
        this.devices = devices;
      }
    });
  }
  create(){
    this.router.navigate(['/devices/create']);
  }
  view(id:number){
    this.router.navigate(['/devices/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/devices/update/'+id]);
  }
  delete(id:number){
    console.log("Delete role with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.devicesService.delete(id).
          subscribe(data => {
            Swal.fire(
              'Eliminado!',
              'Registro eliminado correctamente.',
              'success'
            )
            this.ngOnInit();
          });
      }
    })
  }

}
