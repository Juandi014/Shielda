import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Password } from 'src/app/models/password.model';
import { UserService } from 'src/app/services/user.service';
import { PasswordService } from 'src/app/services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  Password: Password;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  user_id: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
  userNameToShow: string = '';
  minDate: string; // Para el campo de fecha, si es necesario
  constructor(private activatedRoute: ActivatedRoute,
    private SessionsService: PasswordService,
    private UsersService: UserService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.Password = { id: 0 };
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
    this.theFormGroup.get('content')?.disable();
    }
    
    this.UsersService.list().subscribe({
      next: (data) => {
        this.users = data;

        // Cargar sesión solo después de tener los usuarios
        if (this.activatedRoute.snapshot.params.id) {
          this.Password.id = this.activatedRoute.snapshot.params.id;
          this.getPassword(this.Password.id);
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
      content: ['', [Validators.required, Validators.minLength(2)]],
      startAt: [null, Validators.required],
      endAt: [null, Validators.required],
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

  getPassword(id: number) {
    this.SessionsService.view(id).subscribe({
      next: (response) => {
        this.Password = response;

        console.log('Contenido recibido del backend:', this.Password.content);

        this.theFormGroup.patchValue({
          id: this.Password.id,
          content: this.Password.content,
          startAt: this.Password.startAt ? new Date(this.Password.startAt) : null,
          endAt: this.Password.endAt ? new Date(this.Password.endAt) : null,
          user_id: this.Password.user_id,
        });
        

        // Buscar y guardar el nombre del usuario para mostrarlo en modo "view"
      const foundUser = this.users.find(u => u.id === this.Password.user_id);
      this.userNameToShow = foundUser ? foundUser.name : '';

        console.log('Password fetched successfully:', this.Password);
      },
      error: (error) => {
        console.error('Error fetching Password:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/passwords/list']);
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
    formValue.startAt = this.formatDate(new Date(formValue.startAt));
    formValue.endAt = this.formatDate(new Date(formValue.endAt));

    this.SessionsService.create(formValue.user_id, formValue).subscribe({
      next: (Password) => {
        console.log('Password created successfully:', Password);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/passwords/list']);
      },
      error: (error) => {
        console.error('Error creating Password:', error);
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

  // Formatea la fecha startAt para el backend
  formValue.startAt = this.formatDate(new Date(formValue.startAt));
  formValue.endAt = this.formatDate(new Date(formValue.endAt));
  console.log(formValue);

  this.SessionsService.update(formValue).subscribe({
    next: (Password) => {
      console.log('Password updated successfully:', Password);
      Swal.fire({
        title: 'Actualizado!',
        text: 'Registro actualizado correctamente.',
        icon: 'success',
      });
      this.router.navigate(['/passwords/list']);
    },
    error: (error) => {
      console.error('Error updating Password:', error);
    }
  });
}

}
