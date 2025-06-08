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
  userId: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
  minDate: string; // Para el campo de fecha, si es necesario
  constructor(private activatedRoute: ActivatedRoute,
    private PasswordsService: PasswordService,
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

    // cargar los usuarios
        this.UsersService.list().subscribe({
          next: (data) => {
            this.users = data;
          },
          error: () => {
            Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
          },
        });
    
        if (this.activatedRoute.snapshot.params.id) {
          this.Password.id = this.activatedRoute.snapshot.params.id;
          this.getPassword(this.Password.id);
        }

  }
  loadUserAndInitForm() {
      // Ejemplo: obtén el userId desde parámetros (o desde un servicio Auth)
      const userId = +this.activatedRoute.snapshot.params.userId || 0;
  
      if (!userId) {
        Swal.fire("Error", "No se encontró el usuario para asignar dirección", "error");
        this.router.navigate(["/users/list"]);
        return;
      }
  
      this.UsersService.getById(userId).subscribe({
        next: (user) => {
          // Inicializa el form con userId y userName
          this.theFormGroup.patchValue({
            userId: user.id,
            userName: user.name,
            // los otros campos vacíos o con valores por defecto
          });
        },
        error: () => {
          Swal.fire("Error", "No se pudo cargar el usuario", "error");
          this.router.navigate(["/users/list"]);
        },
      });
    }
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0,[]],
      content: ['', [Validators.required, Validators.minLength(2)]],
      startAt: [null, Validators.required],
      endAt: [null, Validators.required],
      userId: [null, [Validators.required]],
    })
  }


  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getPassword(id: number) {
    this.PasswordsService.view(id).subscribe({
      next: (response) => {
        this.Password = response;

        this.theFormGroup.patchValue({
          id: this.Password.id,
          content: this.Password.content,
          startAt: this.Password.startAt ? new Date(this.Password.startAt) : null,
          endAt: this.Password.endAt ? new Date(this.Password.endAt) : null,
        });
        
        console.log('Password fetched successfully:', this.Password);
      },
      error: (error) => {
        console.error('Error fetching Password:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/Passwords/list']);
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

    this.PasswordsService.create(formValue.userId, formValue).subscribe({
      next: (Password) => {
        console.log('Password created successfully:', Password);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Passwords/list']);
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
      })
      return;
    }
    this.PasswordsService.update(this.theFormGroup.value).subscribe({
      next: (Password) => {
        console.log('Password updated successfully:', Password);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Passwords/list']);
      },
      error: (error) => {
        console.error('Error updating Password:', error);
      }
    });
  }

}
