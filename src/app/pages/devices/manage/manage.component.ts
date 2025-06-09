import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Device } from "src/app/models/device.model";
import { UserService } from "src/app/services/user.service";
import { DeviceService } from "src/app/services/device.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  Device: Device;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  user_id: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
  userNameToShow: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private DevicesService: DeviceService,
    private UsersService: UserService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.Device = { id: 0 };
    this.configFormGroup();
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
    this.theFormGroup.get('name')?.disable();
    this.theFormGroup.get('ip')?.disable();
    this.theFormGroup.get('operating_system')?.disable();
    }

    // cargar los usuarios
    this.UsersService.list().subscribe({
      next: (data) => {
        this.users = data;

        if (this.activatedRoute.snapshot.params.id) {
          this.Device.id = this.activatedRoute.snapshot.params.id;
          this.getDevice(this.Device.id);
        }
      },
      error: () => {
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      },
    });
  }
  
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0, []],
      name: ["", [Validators.required, Validators.minLength(2)]],
      ip: ["", [Validators.required, Validators.minLength(2)]],
      operating_system: ["", [Validators.required, Validators.minLength(2)]],
      user_id: [null, [Validators.required]],
    });
  }

  getUserNameById(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? user.name : '';
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDevice(id: number) {
    this.DevicesService.view(id).subscribe({
      next: (response) => {
        this.Device = response;

        console.log(this.Device)

        this.theFormGroup.patchValue({
          id: this.Device.id,
          name: this.Device.name,
          ip: this.Device.ip,
          operating_system: this.Device.operating_system,
          user_id: this.Device.user_id,
        });

        // Buscar y guardar el nombre del usuario para mostrarlo en modo "view"
      const foundUser = this.users.find(u => u.id === this.Device.user_id);
      this.userNameToShow = foundUser ? foundUser.name : '';

        console.log("Device fetched successfully:", this.Device);
      },
      error: (error) => {
        console.error("Error fetching Device:", error);
      },
    });
  }
  back() {
    this.router.navigate(["/devices/list"]);
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
    this.DevicesService.create(this.theFormGroup.value.user_id, this.theFormGroup.value).subscribe({
      next: (Device) => {
        console.log("Device created successfully:", Device);
        Swal.fire({
          title: "Creado!",
          text: "Registro creado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/devices/list"]);
      },
      error: (error) => {
        console.error("Error creating Device:", error);
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
    this.DevicesService.update(this.theFormGroup.value).subscribe({
      next: (Device) => {
        console.log("Device updated successfully:", Device);
        Swal.fire({
          title: "Actualizado!",
          text: "Registro actualizado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/devices/list"]);
      },
      error: (error) => {
        console.error("Error updating Device:", error);
      },
    });
  }
}
