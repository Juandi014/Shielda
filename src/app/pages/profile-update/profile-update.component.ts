import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {
  userId!: number;
  user: User = { name: '', email: '', password: '' };
  phone: string = '';
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private securityService: SecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id'];

    // Intenta obtener datos locales
    const localData = localStorage.getItem('profile_' + this.userId);
    if (localData) {
      const parsed = JSON.parse(localData);
      this.user = parsed;
      this.phone = parsed.phone || '';
      this.photoPreview = parsed.photoUrl || null;
    } else {
      // O consulta desde el backend
      this.userService.getById(this.userId).subscribe({
        next: data => {
          this.user = data;
          this.phone = data['phone'] || '';
        },
        error: err => console.error(err)
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    const updatedUser: User = {
      ...this.user,
      phone: this.phone,
      photoUrl: this.photoPreview || this.user.photoUrl
    };

    // Guardar en localStorage
    localStorage.setItem('profile_' + this.userId, JSON.stringify(updatedUser));

    // Actualizar sesión actual si es el mismo usuario
    this.securityService.setUser(updatedUser);

    Swal.fire('Actualizado', 'Perfil actualizado localmente', 'success');
    this.router.navigate(['/profile', this.userId]);
  }
}
