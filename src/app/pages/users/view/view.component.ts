import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  userId!: number;
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id'];
    this.userService.getById(this.userId).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error(err)
    });
  }

  deleteUser(): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.delete(this.userId).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => console.error(err)
      });
    }
  }
}
