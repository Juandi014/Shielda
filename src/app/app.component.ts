import { Component, OnInit } from '@angular/core';
import { SecurityService } from './services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    // 🔄 Restaurar sesión desde localStorage si existe
    this.securityService.verifyActualSession();
  }
}
