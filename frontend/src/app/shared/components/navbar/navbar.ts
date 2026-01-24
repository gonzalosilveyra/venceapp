import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  standalone: false
})
export class Navbar {
  user: any;
  menuOpen = false;

  constructor(public authService: AuthService) {
    this.authService.userSubject.subscribe(u => this.user = u);
  }

  logout() {
    this.authService.logout();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
