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
  { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '', type: 1 },
  { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '', type: 1 },
  { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '', type: 1 },
  { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '', type: 1 },
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
