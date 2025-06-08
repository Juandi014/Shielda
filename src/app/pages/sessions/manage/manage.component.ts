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
  userId: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
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
          this.Session.id = this.activatedRoute.snapshot.params.id;
          this.getSession(this.Session.id);
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
      token: ['', [Validators.required, Validators.minLength(2)]],
      expiration: [null, Validators.required],
      FACode: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      userId: [null, [Validators.required]],
    })
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
        });
        
        console.log('Session fetched successfully:', this.Session);
      },
      error: (error) => {
        console.error('Error fetching Session:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/Sessions/list']);
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

    this.SessionsService.create(formValue.userId, formValue).subscribe({
      next: (Session) => {
        console.log('Session created successfully:', Session);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Sessions/list']);
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
      })
      return;
    }
    this.SessionsService.update(this.theFormGroup.value).subscribe({
      next: (Session) => {
        console.log('Session updated successfully:', Session);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Sessions/list']);
      },
      error: (error) => {
        console.error('Error updating Session:', error);
      }
    });
  }

}
