import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'src/app/models/session.model';
import { SessionService } from 'src/app/services/session.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  sessions: Session[] = [];
  users: any[] = []; // Lista de usuarios
  user_id?: number;
  constructor(private sessionsService:SessionService,
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
      this.sessionsService.getByUserId(user_id).subscribe({
        next: (sessions) => {
          this.sessions = sessions;
        },
        error: () => {
          Swal.fire('Error', 'No se pudieron cargar los dispositivos del usuario', 'error');
        }
      });
    }

  loadUsers() {
    this.sessionsService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Desconocido';
  }

  list(){
    this.sessionsService.list().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
      }
    });
  }
  create(){
    this.router.navigate(['/sessions/create']);
  }
  view(id:number){
    this.router.navigate(['/sessions/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/sessions/update/'+id]);
  }
  delete(id:number){
    console.log("Delete session with id:", id);
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
        this.sessionsService.delete(id).
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
