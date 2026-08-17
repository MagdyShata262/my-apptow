import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
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
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/features';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.error.set('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
      },
    });
  }
}
