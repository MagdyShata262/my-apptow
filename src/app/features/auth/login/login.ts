import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { Auth } from '../../../core/services/auth';

interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loginModel = signal<LoginData>({
    username: 'emilys',
    password: 'emilyspass',
  });

  loginForm = form(this.loginModel);

  loading = signal(false);
  error = signal<string | null>(null);

  async onLogin(event: Event): Promise<void> {
    event.preventDefault();

    const credentials = this.loginModel();

    if (!credentials.username || !credentials.password) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.login(credentials.username, credentials.password);

      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';

      await this.router.navigateByUrl(returnUrl);
    } catch (error) {
      console.error('Login error:', error);

      this.error.set('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
    } finally {
      this.loading.set(false);
    }
  }
}
