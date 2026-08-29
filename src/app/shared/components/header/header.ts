// src/app/core/components/header/header.component.ts

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,

  imports: [CommonModule, RouterLink, RouterLinkActive],

  templateUrl: './header.html',
  styleUrl: './header.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements AfterViewInit {
  // ============================================
  // Dependencies
  // ============================================

  protected readonly authService = inject(Auth);

  private readonly router = inject(Router);

  private readonly el = inject(ElementRef);

  private readonly platformId = inject(PLATFORM_ID);

  // ============================================
  // UI State
  // ============================================

  readonly isMenuCollapsed = signal(true);

  readonly isUserMenuOpen = signal(false);

  // ============================================
  // Theme
  // ============================================

  readonly theme = signal<'light' | 'dark'>(this.getInitialTheme());

  private getInitialTheme(): 'light' | 'dark' {
    // SSR protection
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }

    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const theme = this.theme();

    document.documentElement.setAttribute('data-bs-theme', theme);

    localStorage.setItem('theme', theme);
  }

  toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';

    this.theme.set(nextTheme);

    this.applyTheme();
  }

  // ============================================
  // Navbar
  // ============================================

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

  // ============================================
  // User Menu
  // ============================================

  toggleUserMenu(event?: Event): void {
    event?.preventDefault();

    this.isUserMenuOpen.update((state) => !state);
  }

  // ============================================
  // Logout
  // ============================================

  logout(): void {
    this.authService.logout();

    this.closeAllMenus();

    this.router.navigateByUrl('/auth/login');
  }

  // ============================================
  // View initialization
  // ============================================

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.applyTheme();

    const navbar = this.el.nativeElement.querySelector('.navbar');

    if (!navbar) {
      return;
    }

    const height = navbar.offsetHeight;

    document.documentElement.style.setProperty('--navbar-height', `${height}px`);
  }
}
