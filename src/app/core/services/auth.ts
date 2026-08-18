// src/app/core/services/auth.service.ts
import { Injectable, inject, signal, computed, afterNextRender } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

// ✅ واجهة بيانات الاستجابة من تسجيل الدخول
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

// ✅ واجهة بيانات المستخدم المرتجعة من /auth/me (بدون tokens)
export type UserProfile = Omit<AuthUser, 'accessToken' | 'refreshToken'>;

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // ✅ Signals لإدارة الحالة الداخلية
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly refreshTokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<UserProfile | AuthUser | null>(null);

  // ✅ Readonly Signals للوصول الخارجي
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly refreshToken = this.refreshTokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenSignal());

  constructor() {
    // ✅ الحماية من SSR والقراءة من local storage
    afterNextRender(() => {
      this.loadFromStorage();
    });
  }

  // 1. تسجيل الدخول
  login(username: string, password: string): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${this.apiUrl}/auth/login`, {
        username,
        password,
        expiresInMins: 30,
      })
      .pipe(tap((res) => this.saveSession(res)));
  }

  // 2. التحقق من التوكن وجلب بيانات المستخدم الحالي
  checkAuth(): Observable<UserProfile | null> {
    const token = this.accessTokenSignal();
    if (!token) return of(null);

    // إضافة الهيدر يدوياً في حال عدم وجود Interceptor
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<UserProfile>(`${this.apiUrl}/auth/me`, { headers }).pipe(
      tap((user) => this.userSignal.set(user)),
      catchError(() => {
        this.logout();
        return of(null);
      }),
    );
  }

  // 3. تجديد التوكن (Refresh Token)
  renewToken(): Observable<{ accessToken: string; refreshToken: string }> {
    const currentRefreshToken = this.refreshTokenSignal();

    return this.http
      .post<{ accessToken: string; refreshToken: string }>(`${this.apiUrl}/auth/refresh`, {
        refreshToken: currentRefreshToken,
        expiresInMins: 30,
      })
      .pipe(
        tap((res) => {
          this.accessTokenSignal.set(res.accessToken);
          this.refreshTokenSignal.set(res.refreshToken);
          this.updateStoredTokens(res.accessToken, res.refreshToken);
        }),
      );
  }

  // 4. تسجيل الخروج
  logout(): void {
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.userSignal.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_session');
    }
  }

  // Private Helpers
  private saveSession(user: AuthUser): void {
    this.accessTokenSignal.set(user.accessToken);
    this.refreshTokenSignal.set(user.refreshToken);
    this.userSignal.set(user);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_session', JSON.stringify(user));
    }
  }

  private updateStoredTokens(accessToken: string, refreshToken: string): void {
    if (typeof localStorage === 'undefined') return;
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
    if (typeof localStorage === 'undefined') return;
    const saved = localStorage.getItem('auth_session');
    if (saved) {
      try {
        const user: AuthUser = JSON.parse(saved);
        this.accessTokenSignal.set(user.accessToken);
        this.refreshTokenSignal.set(user.refreshToken);
        this.userSignal.set(user);
      } catch {
        localStorage.removeItem('auth_session');
      }
    }
  }
}
