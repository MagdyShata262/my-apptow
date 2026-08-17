// src/app/core/services/auth.service.ts
import { Injectable, inject, signal, computed, afterNextRender } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

// ✅ واجهة البيانات المطابقة لتوثيق DummyJSON
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
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // ✅ Signals لإدارة الحالة
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly refreshTokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<AuthUser | null>(null);

  // ✅ Public Readonly Signals
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenSignal());
  constructor() {
    // ✅ بعدNextRender يضمن التشغيل في المتصفح فقط (ليس على الخادم)
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

  // 2. التحقق من صلاحية الـ Token عند فتح التطبيق (GET /auth/me)
  checkAuth(): Observable<AuthUser | null> {
    const token = this.accessTokenSignal();
    if (!token) return of(null);

    return this.http.get<AuthUser>(`${this.apiUrl}/auth/me`).pipe(
      tap((user) => this.userSignal.set(user)),
      catchError(() => {
        this.logout(); // إذا فشل، نقوم بتسجيل الخروج
        return of(null);
      }),
    );
  }

  // 3. تسجيل الخروج
  logout(): void {
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.userSignal.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_session');
    }
  }

  // ✅ دوال مساعدة خاصة (Private Helpers)
  private saveSession(user: AuthUser): void {
    this.accessTokenSignal.set(user.accessToken);
    this.refreshTokenSignal.set(user.refreshToken);
    this.userSignal.set(user);
    // ✅ حماية إضافية
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_session', JSON.stringify(user));
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return; // ✅ حماية
    const saved = localStorage.getItem('auth_session');
    if (saved) {
      try {
        const user: AuthUser = JSON.parse(saved);
        this.accessTokenSignal.set(user.accessToken);
        this.refreshTokenSignal.set(user.refreshToken);
        this.userSignal.set(user);
      } catch {
        // إذا كانت البيانات تالفة، احذفها
        localStorage.removeItem('auth_session');
      }
    }
  }
}
