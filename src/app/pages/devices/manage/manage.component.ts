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
  userId: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
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
      this.Device.id = this.activatedRoute.snapshot.params.id;
      this.getDevice(this.Device.id);
    }
  }
  loadUserAndInitForm() {
    // Ejemplo: obtén el userId desde parámetros (o desde un servicio Auth)
    const userId = +this.activatedRoute.snapshot.params.userId || 0;

    if (!userId) {
      Swal.fire(
        "Error",
        "No se encontró el usuario para asignar dirección",
        "error"
      );
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
      id: [0, []],
      name: ["", [Validators.required, Validators.minLength(2)]],
      ip: ["", [Validators.required, Validators.minLength(2)]],
      operatingSystem: ["", [Validators.required, Validators.minLength(2)]],
      userId: [null, [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDevice(id: number) {
    this.DevicesService.view(id).subscribe({
      next: (response) => {
        this.Device = response;

        this.theFormGroup.patchValue({
          id: this.Device.id,
          name: this.Device.name,
          ip: this.Device.ip,
          operatingSystem: this.Device.operatingSystem
        });

        console.log("Device fetched successfully:", this.Device);
      },
      error: (error) => {
        console.error("Error fetching Device:", error);
      },
    });
  }
  back() {
    this.router.navigate(["/Devices/list"]);
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
    this.DevicesService.create(this.theFormGroup.value.userId, this.theFormGroup.value).subscribe({
      next: (Device) => {
        console.log("Device created successfully:", Device);
        Swal.fire({
          title: "Creado!",
          text: "Registro creado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/Devices/list"]);
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
        this.router.navigate(["/Devices/list"]);
      },
      error: (error) => {
        console.error("Error updating Device:", error);
      },
    });
  }
}
