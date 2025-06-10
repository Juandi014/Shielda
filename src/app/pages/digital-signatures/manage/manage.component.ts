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
  mode: number = 1; // 1: view, 2: create, 3: update
  DigitalSignature: DigitalSignature = { id: 0 };
  theFormGroup: FormGroup;
  trySend: boolean = false;
  userId: number = 0;
  userName: string = '';
  userEmail: string = '';
  users: any[] = [];
  selectedFile: File | null = null;
  readonly BACKEND_URL = 'http://127.0.0.1:5000'; // o donde esté corriendo


  constructor(
    private activatedRoute: ActivatedRoute,
    private DigitalSignaturesService: DigitalSignatureService,
    private UsersService: UserService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) {
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
    const idParam = +this.activatedRoute.snapshot.params['id'] || 0;

    if (this.mode === 2 && this.userId) {
      this.loadUserAndInitForm();
    }

    if (this.userId && this.mode === 1) {
      this.loadSignatureByUserId(this.userId);
    } else if (idParam && (this.mode === 1 || this.mode === 3)) {
      this.getDigitalSignature(idParam);
    }

    this.UsersService.list().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      }
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      id: [0],
      photo: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      userName: [{ value: '', disabled: true }],
      userEmail: [{ value: '', disabled: true }]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }
onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.theFormGroup.patchValue({ photo: this.selectedFile });

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      localStorage.setItem(`signature_photo_user_${this.userId}`, base64);
    };
    reader.readAsDataURL(this.selectedFile);
  }
}


  loadUserAndInitForm() {
  if (!this.userId) {
    Swal.fire("Error", "No se encontró el usuario", "error");
    this.router.navigate(["/users/list"]);
    return;
  }

  this.UsersService.getById(this.userId).subscribe({
    next: (user) => {
      this.userName = user.name;
      this.userEmail = user.email;
      this.theFormGroup.patchValue({
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      });
    },
    error: () => {
      Swal.fire("Error", "No se pudo cargar el usuario", "error");
      this.router.navigate(["/users/list"]);
    }
  });
}


  loadSignatureByUserId(userId: number) {
  this.DigitalSignaturesService.viewByUserId(userId).subscribe({
    next: (signature) => {
      this.mode = 1;
      this.DigitalSignature = signature;
      this.userId = signature.userId ?? userId; // ← Asegurar que userId se actualiza
      this.theFormGroup.patchValue({
        id: signature.id,
        photo: signature.photo,
        userId: signature.userId
      });

      // ⚠️ Validar antes de usar
      if (this.userId) {
        // ✅ Ver si hay imagen guardada en localStorage (base64)
const storedPhoto = localStorage.getItem(`signature_photo_user_${this.userId}`);
if (storedPhoto) {
  this.DigitalSignature.photo = storedPhoto;
}

        this.UsersService.getById(this.userId).subscribe(user => {
          this.theFormGroup.patchValue({
            userName: user.name,
            userEmail: user.email
          });
        });
      }
    },
    error: () => {
      this.router.navigate(['/digital-signatures/create', userId]);
    }
  });
}


  getDigitalSignature(id: number) {
  this.DigitalSignaturesService.view(id).subscribe({
    next: (response) => {
      this.DigitalSignature = response;
      this.userId = response.userId; // ← Guardar el ID correctamente

      this.theFormGroup.patchValue({
        id: response.id,
        photo: response.photo,
        userId: response.userId
      });

      if (this.userId) {
        // ✅ Ver si hay imagen guardada en localStorage (base64)
const storedPhoto = localStorage.getItem(`signature_photo_user_${this.userId}`);
if (storedPhoto) {
  this.DigitalSignature.photo = storedPhoto;
}

        this.UsersService.getById(this.userId).subscribe(user => {
          this.theFormGroup.patchValue({
            userName: user.name,
            userEmail: user.email
          });
        });
      }
    },
    error: () => {
      Swal.fire("No encontrado", "No se encontró la firma digital", "warning")
        .then(() => this.router.navigate(['/digital-signatures/list']));
    }
  });
}


 create() {
  this.trySend = true;
  if (this.theFormGroup.invalid || !this.selectedFile) {
    Swal.fire("Error", "Complete todos los campos", "error");
    return;
  }

  const formData = new FormData();
  formData.append("photo", this.selectedFile);
  const userId = this.theFormGroup.value.userId;

  this.DigitalSignaturesService.create(userId, formData).subscribe({
    next: () => {
      Swal.fire("Creado", "Firma creada correctamente", "success");
      this.router.navigate(["/users"]); // ✅ Redirige al listado de usuarios
    },
    error: (err) => {
      console.error("Error creando firma:", err);
    }
  });
}


  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire("Error", "Complete todos los campos", "error");
      return;
    }

    this.DigitalSignaturesService.update(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire("Actualizado", "Firma actualizada correctamente", "success");
        this.router.navigate(["/digital-signatures/list"]);
      },
      error: (err) => {
        console.error("Error actualizando firma:", err);
      }
    });
  }

  back() {
    this.router.navigate(["/digital-signatures/list"]);
  }
  getPhotoUrl(photo: string): string {
  // Si ya viene como URL completa (por ejemplo desde el backend), no tocar
  if (photo.startsWith('http')) return photo;
  return `${this.BACKEND_URL}/uploads/signatures/${photo}`;
}

}
