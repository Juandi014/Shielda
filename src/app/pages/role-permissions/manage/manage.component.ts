import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RolePermission } from "src/app/models/role-permission.model";
import { RoleService } from "src/app/services/role.service";
import { PermissionService } from "src/app/services/permission.service";
import { RolePermissionService } from "src/app/services/role-permission.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  RolePermission: RolePermission;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  roleId: number = 0; // Asignar un valor por defecto
  permissionId: number = 0; // Asignar un valor por defecto
  roles: any[] = []; // Lista de roles
  permissions: any[] = []; // Lista de permisos, si es necesario
  minDate: string; // Para el campo de fecha, si es necesario
  constructor(
    private activatedRoute: ActivatedRoute,
    private RolePermissionsService: RolePermissionService,
    private RolesService: RoleService,
    private PermissionsService: PermissionService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.RolePermission = { id: 0 };
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

    // cargar los roles
    this.RolesService.list().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: () => {
        Swal.fire("Error", "No se pudieron cargar los roles", "error");
      },
    });

    // cargar los permisos
    this.PermissionsService.list().subscribe({
      next: (data) => {
        this.permissions = data;
      },
      error: () => {
        Swal.fire("Error", "No se pudieron cargar los permisos", "error");
      },
    });

    if (this.activatedRoute.snapshot.params.id) {
      this.RolePermission.id = this.activatedRoute.snapshot.params.id;
      this.getRolePermission(this.RolePermission.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0, []],
      startAt: [null, Validators.required],
      endAt: [null, Validators.required],
      roleId: [null, [Validators.required]],
      permissionId: [null, [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getRolePermission(id: number) {
    this.RolePermissionsService.view(id).subscribe({
      next: (response) => {
        this.RolePermission = response;

        this.theFormGroup.patchValue({
          id: this.RolePermission.id,
          startAt: this.RolePermission.startAt ? new Date(this.RolePermission.startAt) : null,
          endAt: this.RolePermission.endAt ? new Date(this.RolePermission.endAt) : null,
          roleId: this.RolePermission.roleId,
          permissionId: this.RolePermission.permissionId,
        });

        console.log("RolePermission fetched successfully:", this.RolePermission);
      },
      error: (error) => {
        console.error("Error fetching RolePermission:", error);
      },
    });
  }
  back() {
    this.router.navigate(["/Role-permissions/list"]);
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

    this.RolePermissionsService.create(formValue.roleId, formValue.permissionId, formValue
    ).subscribe({
      next: (RolePermission) => {
        console.log("RolePermission created successfully:", RolePermission);
        Swal.fire({
          title: "Creado!",
          text: "Registro creado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/Role-permissions/list"]);
      },
      error: (error) => {
        console.error("Error creating RolePermission:", error);
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
    this.RolePermissionsService.update(this.theFormGroup.value).subscribe({
      next: (RolePermission) => {
        console.log("RolePermission updated successfully:", RolePermission);
        Swal.fire({
          title: "Actualizado!",
          text: "Registro actualizado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/Role-permissions/list"]);
      },
      error: (error) => {
        console.error("Error updating RolePermission:", error);
      },
    });
  }
}
