import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { SecurityService } from 'src/app/services/security.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[] = [];
  public location: Location;
  user: User;
  subscription: Subscription;
  mostQueriedEntity: string = '';

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private securityService: SecurityService,
    private cdr: ChangeDetectorRef
  ) {
    this.location = location;
    this.subscription = this.securityService.getUser().subscribe(data => {
      this.user = data;
    });
  }

  logout() {
    this.securityService.logout();
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.updateMostQueried();
    
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  getInitial(email: string): string {
    return email?.charAt(0).toUpperCase() || '?';
  }

  stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 50%)`;
  }
  updateMostQueried(): void {
    const users = +localStorage.getItem('counter_users')! || 0;
    const roles = +localStorage.getItem('counter_roles')! || 0;
    const permissions = +localStorage.getItem('counter_permissions')! || 0;

    const max = Math.max(users, roles, permissions);
    const tied = [];

    if (users === max) tied.push('Users');
    if (roles === max) tied.push('Roles');
    if (permissions === max) tied.push('Permissions');

    this.mostQueriedEntity = tied.length ? tied[Math.floor(Math.random() * tied.length)] : '';
    this.cdr.detectChanges();
  }

}

