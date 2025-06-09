import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import { User } from 'src/app/models/user.model';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  type: number; // 0: no logueado, 1: logueado, 2: siempre visible
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '', type: 2 },
  { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '', type: 1 },
  { path: '/users', title: 'Users', icon: 'ni-circle-08 text-purple', class: '', type: 1 }, // ✅ NUEVO ITEM
  { path: '/addresses/list', title: 'Addresses', icon: 'ni-map-big text-orange', class: '', type: 1 },
  { path: '/digital-signatures/list', title: 'Digital Signatures', icon: 'ni-paper-diploma text-pink', class: '', type: 1 },
  { path: '/passwords/list', title: 'Passwords', icon: 'ni-key-25 text-danger', class: '', type: 1 },
  { path: '/devices/list', title: 'Devices', icon: 'ni-laptop text-success', class: '', type: 1 },
  { path: '/sessions/list', title: 'Sessions', icon: 'ni-time-alarm text-info', class: '', type: 1 },
  { path: '/roles/list', title: 'Roles', icon: 'ni-badge text-indigo', class: '', type: 1 },
  { path: '/permissions/list', title: 'Permissions', icon: 'ni-lock-circle-open text-dark', class: '', type: 1 },
  { path: '/security-questions/list', title: 'Security Questions', icon: 'ni-support-16 text-secondary', class: '', type: 1 },
  { path: '/answers/list', title: 'Answers', icon: 'ni-chat-round text-teal', class: '', type: 1 },
  { path: '/user-roles/list', title: 'User Roles', icon: 'ni-badge text-warning', class: '', type: 1 },
  { path: '/role-permissions/list', title: 'Role Permissions', icon: 'ni-settings-gear-65 text-primary', class: '', type: 1 },
  { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '', type: 0 },
  { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '', type: 0 },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  public currentUser?: User;

  constructor(private router: Router, public securityService: SecurityService) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    
    // Suscribirse al usuario activo
    this.securityService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
  }

  logout() {
    this.securityService.logout();
    this.router.navigate(['/login']);
  }
  getInitial(email: string): string {
  return email?.charAt(0).toUpperCase() || '?';
}

stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 50%)`;
  return color;
}
}
