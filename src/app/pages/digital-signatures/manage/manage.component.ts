import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DigitalSignature } from "src/app/models/digital-signature.model";
import { UserService } from "src/app/services/user.service";
import { DigitalSignatureService } from "src/app/services/digital-signature.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  DigitalSignature: DigitalSignature;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  userId: number = 0; // Asignar un valor por defecto
  users: any[] = []; // Lista de usuarios
  selectedFile: File | null = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private DigitalSignaturesService: DigitalSignatureService,
    private UsersService: UserService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.DigitalSignature = { id: 0 };
    this.configFormGroup();
  }

  onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.theFormGroup.patchValue({ photo: this.selectedFile });
  }
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

    this.userId = +this.activatedRoute.snapshot.params.userId || 0; // Obtener userId de la ruta si existe
    this.DigitalSignature.id = +this.activatedRoute.snapshot.params.id || 0; // Obtener id firma si existe
    
    if (this.userId) {
      // Cargar la firma digital asociada a ese userId
      this.loadSignatureByUserId(this.userId);
    } else if (this.DigitalSignature.id) {
      // Cargar firma por id (modo view/update)
      this.getDigitalSignature(this.DigitalSignature.id);
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
      this.DigitalSignature.id = this.activatedRoute.snapshot.params.id;
      this.getDigitalSignature(this.DigitalSignature.id);
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

  loadSignatureByUserId(userId: number) {
  this.DigitalSignaturesService.viewByUserId(userId).subscribe({
    next: (signature) => {
      this.DigitalSignature = signature;
      this.theFormGroup.patchValue({
        id: signature.id,
        photo: signature.photo,
        userId: signature.userId,
      });
    },
    error: () => {
      Swal.fire("Error", "No se encontró firma digital para este usuario", "error");
    },
  });
}
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0, []],
      photo: [null, [Validators.required]],
      userId: [null, [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDigitalSignature(id: number) {
    this.DigitalSignaturesService.view(id).subscribe({
      next: (response) => {
        this.DigitalSignature = response;

        this.theFormGroup.patchValue({
          id: this.DigitalSignature.id,
          photo: this.DigitalSignature.photo,
          userId: this.DigitalSignature.userId,
        });

        console.log("DigitalSignature fetched successfully:", this.DigitalSignature);
      },
      error: (error) => {
        console.error("Error fetching DigitalSignature:", error);
      },
    });
  }
  back() {
    this.router.navigate(["/Digital-signatures/list"]);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid || !this.selectedFile) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("photo", this.selectedFile);
    const userId = this.theFormGroup.value.userId;

    this.DigitalSignaturesService.create(userId, formData).subscribe({
      next: (DigitalSignature) => {
        console.log("DigitalSignature created successfully:", DigitalSignature);
        Swal.fire({
          title: "Creado!",
          text: "Registro creado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/Digital-signatures/list"]);
      },
      error: (error) => {
        console.error("Error creating DigitalSignature:", error);
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
    this.DigitalSignaturesService.update(this.theFormGroup.value).subscribe({
      next: (DigitalSignature) => {
        console.log("DigitalSignature updated successfully:", DigitalSignature);
        Swal.fire({
          title: "Actualizado!",
          text: "Registro actualizado correctamente.",
          icon: "success",
        });
        this.router.navigate(["/Digital-signatures/list"]);
      },
      error: (error) => {
        console.error("Error updating DigitalSignature:", error);
      },
    });
  }
}
