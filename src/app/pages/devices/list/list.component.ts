import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  users: any[] = []; // Lista de usuarios
  user_id?: number;
  constructor(private devicesService:DeviceService,
    private router:Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadUsers();

    this.route.params.subscribe(params => {
      this.user_id = params['user_id'] ? +params['user_id'] : undefined;

      if (this.user_id) {
        this.listByUser(this.user_id);
      } else {
        this.list();
      }
    });
  }


  listByUser(user_id: number) {
    this.devicesService.getByUserId(user_id).subscribe({
      next: (devices) => {
        this.devices = devices;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los dispositivos del usuario', 'error');
      }
    });
  }

  loadUsers() {
    this.devicesService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUserName(user_id: number): string {
    const user = this.users.find(u => u.id === user_id);
    return user ? user.name : 'Desconocido';
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
    console.log("Delete device with id:", id);
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
