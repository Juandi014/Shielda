import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role.model';
import { UserRole } from 'src/app/models/user-role.model';
import { User } from 'src/app/models/user.model';
import { UserRoleService } from 'src/app/services/user-role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  userRoles: UserRole[] = [];
  roles: Role[] = [];
  users: User[] = [];
  roleService: any;
  UserRolesService: any;
  constructor(private userRolesService:UserRoleService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.userRolesService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadRoles() {
    this.userRolesService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Desconocido';
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Desconocido';
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
