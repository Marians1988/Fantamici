import { Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../shared-service/auth-service';


@Component({
  selector: 'app-header-app-component',
  imports: [MatToolbar,MatIcon,MatButton],
  templateUrl: './header-app.component.html',
  styleUrl: './header-app.component.scss',
})
export class HeaderAppComponent {
   back = output();
   dashboard =input(true);
   private readonly authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}