import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.list();
  }
  createUser(): void {
    this.router.navigate(['/users/create']);
  }
  list(): void {
    this.userService.list().subscribe(users => this.users = users);
  }

  create(): void {
    this.router.navigate(['/register']);
  }

  view(id: number) {
    this.router.navigate(['/users/view', id]);
  }

  update(id: number) {
    this.router.navigate(['/users/update', id]);
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'Usuario eliminado', 'success');
          this.ngOnInit();
        });
      }
    });
  }
}
