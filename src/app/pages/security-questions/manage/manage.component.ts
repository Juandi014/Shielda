import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityQuestion } from 'src/app/models/security-question.model';
import { SecurityQuestionService } from 'src/app/services/security-question.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  SecurityQuestion: SecurityQuestion;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(private activatedRoute: ActivatedRoute,
    private SecurityQuestionsService: SecurityQuestionService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.SecurityQuestion = { id: 0 };
    this.configFormGroup()
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activatedRoute.snapshot.params.id) {
      this.SecurityQuestion.id = this.activatedRoute.snapshot.params.id
      this.getSecurityQuestion(this.SecurityQuestion.id)
    }

  }
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0,[]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]]
    })
  }


  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getSecurityQuestion(id: number) {
    this.SecurityQuestionsService.view(id).subscribe({
      next: (response) => {
        this.SecurityQuestion = response;

        this.theFormGroup.patchValue({
          id: this.SecurityQuestion.id,
          name: this.SecurityQuestion.name,
          description: this.SecurityQuestion.description
        });
        
        console.log('SecurityQuestion fetched successfully:', this.SecurityQuestion);
      },
      error: (error) => {
        console.error('Error fetching SecurityQuestion:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/Security-questions/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
    this.SecurityQuestionsService.create(this.theFormGroup.value).subscribe({
      next: (SecurityQuestion) => {
        console.log('SecurityQuestion created successfully:', SecurityQuestion);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Security-questions/list']);
      },
      error: (error) => {
        console.error('Error creating SecurityQuestion:', error);
      }
    });
  }
  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
    this.SecurityQuestionsService.update(this.theFormGroup.value).subscribe({
      next: (SecurityQuestion) => {
        console.log('SecurityQuestion updated successfully:', SecurityQuestion);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Security-questions/list']);
      },
      error: (error) => {
        console.error('Error updating SecurityQuestion:', error);
      }
    });
  }

}
