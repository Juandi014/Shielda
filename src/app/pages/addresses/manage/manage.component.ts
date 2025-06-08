import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Address } from "src/app/models/address.model";
import { AddressService } from "src/app/services/address.service";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";
import * as L from "leaflet";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit, AfterViewInit {
  map!: L.Map;
  marker!: L.Marker;
  mode: number; // 1: view, 2: create, 3: update
  Address: Address;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  userId: number = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private AddressesService: AddressService,
    private UsersService: UserService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.Address = { id: 0 };
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

    this.userId = +this.activatedRoute.snapshot.params['userId'] || 0;

    if (this.mode === 2) {
      this.loadUserAndInitForm(); // cargar info del usuario
    }
    if (this.activatedRoute.snapshot.params.id) {
      this.Address.id = this.activatedRoute.snapshot.params.id;
      this.getAddress(this.Address.id);
    }
  }

  ngAfterViewInit(): void {
    // Solo inicializa el mapa si ya tienes latitud y longitud cargadas
    const lat = this.theFormGroup.get("latitude")?.value;
    const lon = this.theFormGroup.get("longitude")?.value;
    if (lat && lon && (lat !== 0 || lon !== 0)) {
      this.initMap();
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

    this.UsersService.view(userId).subscribe({
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
      street: ["", [Validators.required, Validators.minLength(2)]],
      number: ["", [Validators.required, Validators.minLength(2)]],
      latitude: [0, []],
      longitude: [0, []],
      userId: [0, [Validators.required]],  // oculto en el formulario, pero enviado al backend
      userName: [{ value: "", disabled: true }],  // solo lectura
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getAddress(id: number) {
  this.AddressesService.view(id).subscribe({
    next: (response) => {
      this.Address = response;
      this.theFormGroup.patchValue({
        id: this.Address.id,
        street: this.Address.street,
        number: this.Address.number,
        latitude: this.Address.latitude,
        longitude: this.Address.longitude,
      });

      // Inicializa el mapa después de recibir datos válidos
      const { latitude, longitude } = this.Address;
      if (latitude && longitude && (latitude !== 0 || longitude !== 0)) {
        setTimeout(() => this.initMap(), 0); // espera al DOM
      }
    },
    error: (error) => {
      console.error("Error fetching Address:", error);
    },
  });
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
    this.AddressesService.create(this.userId, this.theFormGroup.value).subscribe({
      next: (Address) => {
        console.log("Address created successfully:", Address);
        Swal.fire({
          title: "Creado!",
          text: "Registro creado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/Addresses/list"]);
      },
      error: (error) => {
        console.error("Error creating Address:", error);
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
    this.AddressesService.update(this.theFormGroup.value).subscribe({
      next: (Address) => {
        console.log("Address updated successfully:", Address);
        Swal.fire({
          title: "Actualizado!",
          text: "Registro actualizado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/Addresses/list"]);
      },
      error: (error) => {
        console.error("Error updating Address:", error);
      },
    });
  }

  initMap(): void {
    const lat = this.theFormGroup.get("latitude")?.value || 0;
    const lon = this.theFormGroup.get("longitude")?.value || 0;

    this.map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    this.marker = L.marker([lat, lon], {
      draggable: this.mode !== 1, // solo si no es modo vista
    }).addTo(this.map);

    if (this.marker.options.draggable) {
      this.marker.on("dragend", () => {
        const pos = this.marker.getLatLng();
        this.theFormGroup.patchValue({
          latitude: pos.lat,
          longitude: pos.lng,
        });
      });
    }

    // Actualiza posición si el usuario escribe en el form
    this.theFormGroup
      .get("latitude")
      ?.valueChanges.subscribe(() => this.updateMap());
    this.theFormGroup
      .get("longitude")
      ?.valueChanges.subscribe(() => this.updateMap());
  }

  updateMap(): void {
    const lat = this.theFormGroup.get("latitude")?.value;
    const lon = this.theFormGroup.get("longitude")?.value;

    if (this.map && this.marker && lat && lon) {
      this.marker.setLatLng([lat, lon]);
      this.map.setView([lat, lon]);
    }
  }
}
