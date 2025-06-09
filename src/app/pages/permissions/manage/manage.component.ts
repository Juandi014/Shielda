import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/models/permission.model';
import { PermissionService } from 'src/app/services/permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  Permission: Permission;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(private activatedRoute: ActivatedRoute,
    private PermissionsService: PermissionService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.Permission = { id: 0 };
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
      this.Permission.id = this.activatedRoute.snapshot.params.id
      this.getPermission(this.Permission.id)
    }

    if (this.mode === 1) {
    this.theFormGroup.get('url')?.disable();
    this.theFormGroup.get('method')?.disable();
    this.theFormGroup.get('entity')?.disable();
  }

  }
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0,[]],
      url: ['', [Validators.required, Validators.minLength(2)]],
      method: ['', [Validators.required, Validators.minLength(2)]],
      entity: ['', [Validators.required, Validators.minLength(2)]]
    })
  }


  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getPermission(id: number) {
    this.PermissionsService.view(id).subscribe({
      next: (response) => {
        this.Permission = response;

        this.theFormGroup.patchValue({
          id: this.Permission.id,
          url: this.Permission.url,
          method: this.Permission.method,
          entity: this.Permission.entity
        });
        
        console.log('Permission fetched successfully:', this.Permission);
      },
      error: (error) => {
        console.error('Error fetching Permission:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/permissions/list']);
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
    console.log(this.theFormGroup.value);
    this.PermissionsService.create(this.theFormGroup.value).subscribe({
      next: (Permission) => {
        console.log('Permission created successfully:', Permission);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/permissions/list']);
      },
      error: (error) => {
        console.error('Error creating Permission:', error);
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
    this.PermissionsService.update(this.theFormGroup.value).subscribe({
      next: (Permission) => {
        console.log('Permission updated successfully:', Permission);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/permissions/list']);
      },
      error: (error) => {
        console.error('Error updating Permission:', error);
      }
    });
  }

}
