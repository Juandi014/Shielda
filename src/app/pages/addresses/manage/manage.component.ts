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
  mode: number = 2; // 1: view, 2: create, 3: update
  Address: Address;
  theFormGroup: FormGroup;
  trySend: boolean = false;
  userId: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private AddressesService: AddressService,
    private UsersService: UserService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
    this.Address = { id: 0 };
    this.configFormGroup();
  }

  ngOnInit(): void {
    this.userId = +this.activatedRoute.snapshot.params['userId'];
this.AddressesService.getByUserId(this.userId).subscribe({
  next: (address) => {
    this.mode = 3; // Ya tiene dirección, modo edición
    this.Address = address;
    this.theFormGroup.patchValue(address);
    setTimeout(() => this.initMap(), 0);
  },
  error: (err) => {
    if (err.status === 404) {
      // No tiene dirección aún => modo creación
      this.mode = 2;
      this.loadUserAndInitForm();
      setTimeout(() => this.initMap(), 0);
    } else {
      Swal.fire("Error", "No se pudo cargar la dirección del usuario", "error");
      this.router.navigate(['/users']);
    }
  }
});


    // Geocodificación automática al escribir calle y número
    this.theFormGroup.get('street')?.valueChanges.subscribe(() => this.tryGeocode());
    this.theFormGroup.get('number')?.valueChanges.subscribe(() => this.tryGeocode());
  }

  ngAfterViewInit(): void {
    const lat = this.theFormGroup.get("latitude")?.value;
    const lon = this.theFormGroup.get("longitude")?.value;
    if (lat && lon && (lat !== 0 || lon !== 0)) {
      this.initMap();
    }
  }

  loadUserAndInitForm() {
    const userId = this.userId;
    if (!userId) {
      Swal.fire("Error", "No se encontró el usuario para asignar dirección", "error");
      this.router.navigate(["/users/list"]);
      return;
    }

    this.UsersService.view(userId).subscribe({
      next: (user) => {
        this.theFormGroup.patchValue({
          userId: user.id,
          userName: user.name
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
      id: [0, []],
      street: ["", [Validators.required, Validators.minLength(2)]],
      number: ["", [Validators.required, Validators.minLength(1)]],
      latitude: [0, []],
      longitude: [0, []],
      userId: [0, [Validators.required]],
      userName: [{ value: "", disabled: true }],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire("Error!", "Por favor, complete todos los campos requeridos.", "error");
      return;
    }
    this.AddressesService.create(this.userId, this.theFormGroup.value).subscribe({
      next: (address) => {
        Swal.fire("Creado!", "Registro creado correctamente.", "success");
        this.router.navigate(["/addresses/list"]);
      },
      error: (error) => {
        console.error("Error creating Address:", error);
      },
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire("Error!", "Por favor, complete todos los campos requeridos.", "error");
      return;
    }
    this.AddressesService.update(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire("Actualizado!", "Registro actualizado correctamente.", "success");
        this.router.navigate(["/addresses/list"]);
      },
      error: (error) => {
        console.error("Error updating Address:", error);
      },
    });
  }

  initMap(): void {
    const lat = this.theFormGroup.get("latitude")?.value || 0;
    const lon = this.theFormGroup.get("longitude")?.value || 0;

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    this.marker = L.marker([lat, lon], {
      draggable: this.mode !== 1,
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

    this.theFormGroup.get("latitude")?.valueChanges.subscribe(() => this.updateMap());
    this.theFormGroup.get("longitude")?.valueChanges.subscribe(() => this.updateMap());
  }

  updateMap(): void {
    const lat = this.theFormGroup.get("latitude")?.value;
    const lon = this.theFormGroup.get("longitude")?.value;

    if (this.map && this.marker && lat && lon) {
      this.marker.setLatLng([lat, lon]);
      this.map.setView([lat, lon]);
    }
  }

  tryGeocode(): void {
    const street = this.theFormGroup.get('street')?.value;
    const number = this.theFormGroup.get('number')?.value;
    if (street && number) {
      this.geocodeAddress();
    }
  }

  geocodeAddress(): void {
    const street = this.theFormGroup.get('street')?.value;
    const number = this.theFormGroup.get('number')?.value;
    const query = encodeURIComponent(`${street} ${number}`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.theFormGroup.patchValue({ latitude: lat, longitude: lon });
          this.updateMap();
        } else {
          Swal.fire('No encontrado', 'No se encontró la dirección en el mapa', 'warning');
        }
      })
      .catch(() => {
        Swal.fire('Error', 'Ocurrió un error al buscar la dirección', 'error');
      });
  }
}
