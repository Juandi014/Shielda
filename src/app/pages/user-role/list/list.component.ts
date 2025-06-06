import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/models/user-role.model';
import { UserRoleService } from 'src/app/services/user-role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  userRoles: UserRole[] = [];
  constructor(private userRolesService:UserRoleService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(){
    this.userRolesService.list().subscribe({
      next: (userRoles) => {
        this.userRoles = userRoles;
      }
    });
  }
  create(){
    this.router.navigate(['/user-roles/create']);
  }
  view(id:number){
    this.router.navigate(['/user-roles/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/user-roles/update/'+id]);
  }
  delete(id:number){
    console.log("Delete user-role with id:", id);
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
        this.userRolesService.delete(id).
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
