import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = { email: '', password: '' };

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  register(): void {
    this.userService.create(this.user).subscribe({
      next: (data) => {
        Swal.fire('Usuario creado', 'El usuario fue creado exitosamente', 'success');
        this.router.navigate(['/users']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el usuario', 'error');
      }
    });
  }
}
