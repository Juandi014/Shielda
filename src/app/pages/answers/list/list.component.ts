import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Answer } from 'src/app/models/answer.model';
import { AnswerService } from 'src/app/services/answer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  answers: Answer[] = [];
  constructor(private answersService:AnswerService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(){
    this.answersService.list().subscribe({
      next: (answers) => {
        this.answers = answers;
      }
    });
  }
  create(){
    this.router.navigate(['/answers/create']);
  }
  view(id:number){
    this.router.navigate(['/answers/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/answers/update/'+id]);
  }
  delete(id:number){
    console.log("Delete answer with id:", id);
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
        this.answersService.delete(id).
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
