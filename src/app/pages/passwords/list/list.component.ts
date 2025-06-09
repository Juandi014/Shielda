import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Password } from 'src/app/models/password.model';
import { PasswordService } from 'src/app/services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  passwords: Password[] = [];
  users: any[] = []; // Lista de usuarios
  constructor(private passwordsService:PasswordService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
    this.loadUsers();
  }

  loadUsers() {
    this.passwordsService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Desconocido';
  }

  list(){
    this.passwordsService.list().subscribe({
      next: (passwords) => {
        this.passwords = passwords;
      }
    });
  }
  create(){
    this.router.navigate(['/passwords/create']);
  }
  view(id:number){
    this.router.navigate(['/passwords/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/passwords/update/'+id]);
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
        this.passwordsService.delete(id).
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
