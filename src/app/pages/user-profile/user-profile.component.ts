import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User = { name: '', email: '', password: '', photoUrl: '' };
  userId: number = 0;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.userId = +params['id'];

    const savedProfile = localStorage.getItem('profile_' + this.userId);
    if (savedProfile) {
      this.user = JSON.parse(savedProfile);
    } else {
      this.userService.getById(this.userId).subscribe({
        next: user => this.user = user,
        error: () => this.user = { name: 'Desconocido', email: '', phone: '', photoUrl: '' }
      });
    }
  });
}
}