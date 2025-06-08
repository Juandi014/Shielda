import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  userId!: number;
  userForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id']; // conversión segura a number

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.userService.getById(this.userId).subscribe({
      next: (data) => {
        this.userForm.patchValue(data);
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.update(this.userId, this.userForm.value).subscribe({
        next: () => this.router.navigate(['/users/view', this.userId]),
        error: (err) => console.error(err)
      });
    }
  }
}
