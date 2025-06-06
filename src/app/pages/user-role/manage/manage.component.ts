import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from 'src/app/models/user-role.model';
import { UserRoleService } from 'src/app/services/user-role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  UserRole: UserRole;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(private activatedRoute: ActivatedRoute,
    private UserRolesService: UserRoleService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.UserRole = { id: 0};
    this.configFormGroup()
  }

  users: any[] = [];
  roles: any[] = [];

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    
    // Detectar modo
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.UserRole.id = this.activatedRoute.snapshot.params.id
      this.getUserRole(this.UserRole.id)
    }
  }

  loadUsers() {
    this.UserRolesService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadRoles() {
    this.UserRolesService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }


  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: ['',[]],
      userId: ['', Validators.required],
      roleId: ['', Validators.required],
      startAt: [null, Validators.required],
      endAt: [null, Validators.required],
    })
  }


  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getUserRole(id: number) {
    this.UserRolesService.view(id).subscribe({
      next: (response) => {
        this.UserRole = response;

        this.theFormGroup.patchValue({
          id: this.UserRole.id,
          userId: this.UserRole.userId,
          roleId: this.UserRole.roleId,
          startAt: this.UserRole.startAt ? new Date(this.UserRole.startAt) : null,
          endAt: this.UserRole.endAt ? new Date(this.UserRole.endAt) : null
        });
        
        console.log('UserRole fetched successfully:', this.UserRole);
      },
      error: (error) => {
        console.error('Error fetching UserRole:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/user-roles/list']);
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
  
  const formValue = this.theFormGroup.value;

  this.UserRolesService.create(
    formValue.userId,
    formValue.roleId,
    formValue).subscribe({
      next: (UserRole) => {
        console.log('UserRole created successfully:', UserRole);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/user-roles/list']);
      },
      error: (error) => {
        console.error('Error creating UserRole:', error);
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
    this.UserRolesService.update(this.theFormGroup.value).subscribe({
      next: (UserRole) => {
        console.log('UserRole updated successfully:', UserRole);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/user-Roles/list']);
      },
      error: (error) => {
        console.error('Error updating UserRole:', error);
      }
    });
  }

}
