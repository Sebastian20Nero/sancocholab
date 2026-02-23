import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '../../../shared/components/auth/signin-form/signin-form.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true, // ✅ CLAVE
  imports: [AuthPageLayoutComponent, SigninFormComponent],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export class SignInComponent {
  constructor(private auth: AuthService, private router: Router) {}

  onLogin(dto: { email: string; password: string; remember: boolean }) {
    this.auth.login({ email: dto.email, password: dto.password }).subscribe({
      next: () => this.router.navigate(['/app']),
      error: (err) => console.error('Login error:', err),
    });
  }
}
