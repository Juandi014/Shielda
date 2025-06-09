import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolePermission } from 'src/app/models/role-permission.model';
import { RolePermissionService } from 'src/app/services/role-permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  rolePermissions: RolePermission[] = [];
  constructor(private rolePermissionsService:RolePermissionService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(){
    this.rolePermissionsService.list().subscribe({
      next: (rolePermissions) => {
        this.rolePermissions = rolePermissions;
      }
    });
  }
  create(){
    this.router.navigate(['/role-permissions/create']);
  }
  view(id:number){
    this.router.navigate(['/role-permissions/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/role-permissions/update/'+id]);
  }
  delete(id:number){
    console.log("Delete role permission with id:", id);
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
        this.rolePermissionsService.delete(id).
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
