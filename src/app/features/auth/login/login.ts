// src/app/features/auth/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ إضافة FormsModule
import { ActivatedRoute, Router } from '@angular/router'; // ✅ تصحيح استيراد Router من @angular/router
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ إضافة FormsModule هنا
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = 'emilys';
  password = 'emilyspass';

  loading = signal(false);
  error = signal<string | null>(null);

  onLogin(): void {
    if (!this.username || !this.password) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.error.set('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
      },
    });
  }
}
