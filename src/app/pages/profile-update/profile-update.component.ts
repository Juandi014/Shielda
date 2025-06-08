import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
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

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id'];
    this.userService.getById(this.userId).subscribe({
      next: data => {
        this.user = data;
        this.phone = data['phone'] || '';
      },
      error: err => console.error(err)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateProfile(): void {
    const formData = new FormData();
    formData.append('phone', this.phone);
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.userService.updateProfile(this.userId, formData).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Perfil actualizado correctamente', 'success');
        this.router.navigate(['/profile', this.userId]);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
      }
    });
  }
}
