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
    this.userId = +this.route.snapshot.params['id'];
    this.userService.getById(this.userId).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error(err)
    });
  }
}
