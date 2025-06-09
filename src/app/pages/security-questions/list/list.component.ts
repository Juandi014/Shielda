import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityQuestion } from 'src/app/models/security-question.model';
import { SecurityQuestionService } from 'src/app/services/security-question.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  securityQuestions: SecurityQuestion[] = [];
  constructor(private securityQuestionsService:SecurityQuestionService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(){
    this.securityQuestionsService.list().subscribe({
      next: (securityQuestions) => {
        this.securityQuestions = securityQuestions;
      }
    });
  }
  create(){
    this.router.navigate(['/security-questions/create']);
  }
  view(id:number){
    this.router.navigate(['/security-questions/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/security-questions/update/'+id]);
  }
  delete(id:number){
    console.log("Delete security question with id:", id);
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
        this.securityQuestionsService.delete(id).
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
