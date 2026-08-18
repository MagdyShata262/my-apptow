// src/app/core/components/header/header.component.ts
import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // ✅ استيراد RouterLink و RouterLinkActive
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // ✅ إضافة توجيهات التنقل هنا
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ أداء عالي متوافق مع Signals
})
export class Header implements AfterViewInit {
  protected readonly authService = inject(Auth);
  private readonly router = inject(Router);

  // ✅ استخدام Signals للتحكم بالحالة
  isMenuCollapsed = signal(true);
  isUserMenuOpen = signal(false);
  readonly isDarkMode = signal(this.getInitialTheme());

  private getInitialTheme(): 'light' | 'dark' {
    if (typeof document === 'undefined') {
      return 'light';
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const theme = this.isDarkMode() === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const nextTheme = this.isDarkMode() === 'dark' ? 'light' : 'dark';
    this.isDarkMode.set(nextTheme);
    this.applyTheme();
  }

  toggleMenu(): void {
    this.isMenuCollapsed.update((state) => !state);
  }

  closeMenu(): void {
    this.isMenuCollapsed.set(true);
  }

  closeAllMenus(): void {
    this.isMenuCollapsed.set(true);
    this.isUserMenuOpen.set(false);
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isUserMenuOpen.update((state) => !state);
  }

  logout(): void {
    this.authService.logout();
    this.isUserMenuOpen.set(false);
    this.router.navigateByUrl('/auth/login');
  }

  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    if (typeof document === 'undefined') {
      return;
    }

    this.applyTheme();

    const navbar = this.el.nativeElement.querySelector('.navbar');
    if (navbar) {
      const height = navbar.offsetHeight;
      document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    }
  }
}
