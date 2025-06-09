import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from 'src/app/models/session.model';
import { UserService } from 'src/app/services/user.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  Session: Session;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  user_id: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
  userNameToShow: string = '';
  minDate: string; // Para el campo de fecha, si es necesario
  constructor(private activatedRoute: ActivatedRoute,
    private SessionsService: SessionService,
    private UsersService: UserService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.Session = { id: 0 };
    this.configFormGroup()
  }

  formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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

    if (this.mode === 1) {
    this.theFormGroup.get('token')?.disable();
    this.theFormGroup.get('FACode')?.disable();
    this.theFormGroup.get('state')?.disable();
    }
    
    this.UsersService.list().subscribe({
      next: (data) => {
        this.users = data;

        // Cargar sesión solo después de tener los usuarios
        if (this.activatedRoute.snapshot.params.id) {
          this.Session.id = this.activatedRoute.snapshot.params.id;
          this.getSession(this.Session.id);
        }
      },
      error: () => {
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      },
    });

  }

  formatDateToView(value: any): string {
  if (!value) return '';

  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}


  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0,[]],
      token: ['', [Validators.required, Validators.minLength(2)]],
      expiration: [null, Validators.required],
      FACode: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      user_id: [null, [Validators.required]],
    })
  }

  getUserNameById(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? user.name : '';
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getSession(id: number) {
    this.SessionsService.view(id).subscribe({
      next: (response) => {
        this.Session = response;

        this.theFormGroup.patchValue({
          id: this.Session.id,
          token: this.Session.token,
          expiration: this.Session.expiration ? new Date(this.Session.expiration) : null,
          FACode: this.Session.FACode,
          state: this.Session.state,
          user_id: this.Session.user_id,
        });
        

        // Buscar y guardar el nombre del usuario para mostrarlo en modo "view"
      const foundUser = this.users.find(u => u.id === this.Session.user_id);
      this.userNameToShow = foundUser ? foundUser.name : '';

        console.log('Session fetched successfully:', this.Session);
      },
      error: (error) => {
        console.error('Error fetching Session:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/sessions/list']);
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

    const formValue = { ...this.theFormGroup.value };
    formValue.expiration = this.formatDate(new Date(formValue.expiration));

    this.SessionsService.create(formValue.user_id, formValue).subscribe({
      next: (Session) => {
        console.log('Session created successfully:', Session);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/sessions/list']);
      },
      error: (error) => {
        console.error('Error creating Session:', error);
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
    });
    return;
  }

  // Clona el valor del formulario
  const formValue = { ...this.theFormGroup.value };

  // Formatea la fecha expiration para el backend
  formValue.expiration = this.formatDate(new Date(formValue.expiration));

  console.log(formValue);

  this.SessionsService.update(formValue).subscribe({
    next: (Session) => {
      console.log('Session updated successfully:', Session);
      Swal.fire({
        title: 'Actualizado!',
        text: 'Registro actualizado correctamente.',
        icon: 'success',
      });
      this.router.navigate(['/sessions/list']);
    },
    error: (error) => {
      console.error('Error updating Session:', error);
    }
  });
}

}
