// src/app/core/services/auth.service.ts
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export type UserProfile = Omit<AuthUser, 'accessToken' | 'refreshToken'>;

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly platformId = inject(PLATFORM_ID);

  // 1️⃣ State Signals
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly refreshTokenSignal = signal<string | null>(null);
  readonly isAuthenticating = signal<boolean>(false);

  // 2️⃣ استخدام httpResource بدلاً من resource مع Handling للـ Idle و AbortSignal
  readonly userResource = httpResource<UserProfile | null>(() => {
    const token = this.accessTokenSignal();

    // إذا لم يتوفر التوكن، تُرجع undefined لتصبح حالة الـ Resource خاملة ('idle')
    if (!token) {
      return undefined;
    }

    // إرجاع خيارات طلب HttpClient وتمرير الهيدرز المخصصة
    return {
      url: `${this.apiUrl}/auth/me`,
      method: 'GET',
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
      // مررنا الخيارات القياسية مع استخدام Angular HTTP Stack
    };
  });

  // 3️⃣ Computed Signals
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly refreshToken = this.refreshTokenSignal.asReadonly();
  readonly user = computed(() => this.userResource.value() ?? null);
  readonly isLoadingUser = this.userResource.isLoading;
  readonly isAuthenticated = computed(() => !!this.accessTokenSignal() && !!this.user());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  // 4️⃣ تسجيل الدخول باستخدام async/await
  async login(username: string, password: string): Promise<AuthUser> {
    this.isAuthenticating.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthUser>(`${this.apiUrl}/auth/login`, {
          username,
          password,
          expiresInMins: 30,
        }),
      );

      this.saveSession(response);
      return response;
    } finally {
      this.isAuthenticating.set(false);
    }
  }

  // 5️⃣ تجديد التوكن تلقائياً
  async renewToken(): Promise<boolean> {
    const currentRefreshToken = this.refreshTokenSignal();
    if (!currentRefreshToken) return false;

    try {
      const res = await firstValueFrom(
        this.http.post<{ accessToken: string; refreshToken: string }>(
          `${this.apiUrl}/auth/refresh`,
          { refreshToken: currentRefreshToken, expiresInMins: 30 },
        ),
      );

      this.accessTokenSignal.set(res.accessToken);
      this.refreshTokenSignal.set(res.refreshToken);
      this.updateStoredTokens(res.accessToken, res.refreshToken);
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  // 6️⃣ تسجيل الخروج
  logout(): void {
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_session');
    }
  }

  // Private Helpers
  private saveSession(user: AuthUser): void {
    this.accessTokenSignal.set(user.accessToken);
    this.refreshTokenSignal.set(user.refreshToken);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_session', JSON.stringify(user));
    }
  }

  private updateStoredTokens(accessToken: string, refreshToken: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('auth_session');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        localStorage.setItem('auth_session', JSON.stringify(user));
      } catch {
        localStorage.removeItem('auth_session');
      }
    }
  }

  private loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('auth_session');
    if (saved) {
      try {
        const user: AuthUser = JSON.parse(saved);
        this.accessTokenSignal.set(user.accessToken);
        this.refreshTokenSignal.set(user.refreshToken);
      } catch {
        localStorage.removeItem('auth_session');
      }
    }
  }
}
