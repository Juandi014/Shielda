import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserRole } from "src/app/models/user-role.model";
import { UserService } from "src/app/services/user.service";
import { RoleService } from "src/app/services/role.service";
import { UserRoleService } from "src/app/services/user-role.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  UserRole: UserRole;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  user_id: number = 0; // Asignar un valor por defecto
  role_id: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
  roles: any[] = []; // Lista de preguntas, si es necesario
  userNameToShow: string = '';
  userRoleToShow: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private UserRolesService: UserRoleService,
    private UsersService: UserService,
    private RolesService: RoleService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.UserRole = { id: 0 };
    this.configFormGroup();
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
    const currentUrl = this.activatedRoute.snapshot.url.join("/");
    if (currentUrl.includes("view")) {
      this.mode = 1;
    } else if (currentUrl.includes("create")) {
      this.mode = 2;
    } else if (currentUrl.includes("update")) {
      this.mode = 3;
    }

    if (this.mode === 1) {
      this.theFormGroup.get('startAt')?.disable();
    }

    // cargar los usuarios y preguntas primero
  Promise.all([
    this.UsersService.list().toPromise(),
    this.RolesService.list().toPromise()
  ])
  .then(([usersData, rolesData]) => {
    this.users = usersData;
    this.roles = rolesData;

    // Solo ahora cargamos la respuesta
    if (this.activatedRoute.snapshot.params.id) {
      this.UserRole.id = this.activatedRoute.snapshot.params.id;
      this.getUserRole(this.UserRole.id);
    }
  })
  .catch(() => {
    Swal.fire("Error", "No se pudieron cargar los datos", "error");
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
      id: [0, []],
      startAt: [null, [Validators.required]],
      endAt: [null, [Validators.required]], // endAt puede ser opcional
      user_id: [null, [Validators.required]],
      role_id: [null, [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getUserRole(id: number) {
    this.UserRolesService.view(id).subscribe({
      next: (response) => {
        this.UserRole = response;

        console.log("Fetched UserRole:", this.UserRole);

        this.theFormGroup.patchValue({
          id: this.UserRole.id,
          startAt: this.UserRole.startAt ? new Date(this.UserRole.startAt) : null,
          endAt: this.UserRole.endAt ? new Date(this.UserRole.endAt) : null,
          user_id: this.UserRole.user_id,
          role_id: this.UserRole.role_id,
        });

        // Buscar y guardar el nombre del usuario para mostrarlo en modo "view"
      const foundUser = this.users.find(u => u.id === this.UserRole.user_id);
      this.userNameToShow = foundUser ? foundUser.name : '';

      // Buscar y guardar el nombre del usuario para mostrarlo en modo "view"
      const foundRole = this.roles.find(u => u.id === this.UserRole.role_id);
      this.userRoleToShow = foundRole ? foundRole.name : '';
        
      },
      error: (error) => {
        console.error("Error fetching UserRole:", error);
      },
    });
  }
  back() {
    this.router.navigate(["/user-roles/list"]);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
      });
      return;
    }
    
    const formValue = { ...this.theFormGroup.value };
    formValue.startAt = this.formatDate(new Date(formValue.startAt));
    formValue.endAt = this.formatDate(new Date(formValue.endAt));
    this.UserRolesService.create(formValue.user_id, formValue.role_id, formValue).subscribe({
      next: (UserRole) => {
        console.log("UserRole created successfully:", UserRole);
        Swal.fire({
          title: "Creado!",
          text: "Registro creado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/user-roles/list"]);
      },
      error: (error) => {
        console.error("Error creating UserRole:", error);
      },
    });
  }
  update() {
  this.trySend = true;

  if (this.theFormGroup.invalid) {
    Swal.fire({
      title: "Error!",
      text: "Por favor, complete todos los campos requeridos.",
      icon: "error",
    });
    return;
  }

  // Clona el valor del formulario
  const formValue = { ...this.theFormGroup.value };

  // Formatea las fechas en formato ISO (esperado por el backend para update)
  formValue.startAt = new Date(formValue.startAt).toISOString();
  formValue.endAt = new Date(formValue.endAt).toISOString();

  console.log("Enviando datos para actualización:", formValue);

  this.UserRolesService.update(formValue).subscribe({
    next: (UserRole) => {
      console.log("UserRole updated successfully:", UserRole);
      Swal.fire({
        title: "Actualizado!",
        text: "Registro actualizado correctamente.",
        icon: "success",
      });
      this.router.navigate(["/user-roles/list"]);
    },
    error: (error) => {
      console.error("Error updating UserRole:", error);
      Swal.fire("Error", "No se pudo actualizar el registro.", "error");
    },
  });
}

}
