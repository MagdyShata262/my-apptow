// src/app/features/home/home.component.ts

import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';

import { CommonModule } from '@angular/common';

import { form, FormField, minLength, required } from '@angular/forms/signals';

interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [RouterLink, CommonModule, FormField],

  templateUrl: './home.html',
  styleUrl: './home.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly authService = inject(Auth);
  private readonly router = inject(Router);

  // ============================================
  // Login Model
  // ============================================

  loginModel = signal<LoginData>({
    username: '',
    password: '',
  });

  // ============================================
  // Signal Form + Validation
  // ============================================

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.username, {
      message: 'اسم المستخدم مطلوب',
    });

    required(schemaPath.password, {
      message: 'كلمة المرور مطلوبة',
    });

    minLength(schemaPath.password, 6, {
      message: 'كلمة المرور يجب أن لا تقل عن 6 أحرف',
    });
  });

  // ============================================
  // UI State
  // ============================================

  loading = signal(false);

  errorMessage = signal<string | null>(null);

  // ============================================
  // Submit
  // ============================================

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    // ------------------------------------------
    // Validate form
    // ------------------------------------------

    if (this.loginForm().invalid()) {
      return;
    }

    // ------------------------------------------
    // UI state
    // ------------------------------------------

    this.loading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginModel();

    try {
      // ----------------------------------------
      // Login
      // ----------------------------------------

      await this.authService.login(credentials.username, credentials.password);

      // ----------------------------------------
      // Navigate
      // ----------------------------------------

      await this.router.navigate(['/dashboard']);
    } catch (err: unknown) {
      // ----------------------------------------
      // Error handling
      // ----------------------------------------

      console.error('Login error:', err);

      if (err && typeof err === 'object' && 'error' in err) {
        const httpError = err as {
          error?: {
            message?: string;
          };
        };

        this.errorMessage.set(
          httpError.error?.message ?? 'فشل تسجيل الدخول، تحقق من البيانات وحاول مجدداً.',
        );
      } else {
        this.errorMessage.set('فشل تسجيل الدخول، تحقق من البيانات وحاول مجدداً.');
      }
    } finally {
      // ----------------------------------------
      // Always stop loading
      // ----------------------------------------

      this.loading.set(false);
    }
  }
}
