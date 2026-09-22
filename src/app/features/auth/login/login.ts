import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { Auth } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast.service';

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
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    console.log(this.route);
  }
  // 📤 مخرجات للتحكم بالمكون من الخرج
  close = output<void>();
  loginSuccess = output<void>();

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

      this.toastService.show('تم تسجيل الدخول بنجاح 🎉', {
        type: 'success',
        position: 'top-center',
      });

      // 📢 إعلام المكون الأب بنجاح الدخول
      this.loginSuccess.emit();

      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
      await this.router.navigateByUrl(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.';
      this.error.set(errorMessage);
      this.toastService.show(errorMessage, {
        type: 'error',
        position: 'top-center',
      });
    } finally {
      this.loading.set(false);
    }
  }
}
