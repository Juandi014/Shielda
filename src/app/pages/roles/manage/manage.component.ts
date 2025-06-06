import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/services/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  Role: Role;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(private activatedRoute: ActivatedRoute,
    private RolesService: RoleService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.Role = { id: 0 };
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
      this.Role.id = this.activatedRoute.snapshot.params.id
      this.getRole(this.Role.id)
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

  getRole(id: number) {
    this.RolesService.view(id).subscribe({
      next: (response) => {
        this.Role = response;

        this.theFormGroup.patchValue({
          id: this.Role.id,
          name: this.Role.name,
          description: this.Role.description
        });
        
        console.log('Role fetched successfully:', this.Role);
      },
      error: (error) => {
        console.error('Error fetching Role:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/Roles/list']);
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
    this.RolesService.create(this.theFormGroup.value).subscribe({
      next: (Role) => {
        console.log('Role created successfully:', Role);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Roles/list']);
      },
      error: (error) => {
        console.error('Error creating Role:', error);
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
    this.RolesService.update(this.theFormGroup.value).subscribe({
      next: (Role) => {
        console.log('Role updated successfully:', Role);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Roles/list']);
      },
      error: (error) => {
        console.error('Error updating Role:', error);
      }
    });
  }

}
