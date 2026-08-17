import { Component, inject } from '@angular/core';
import { Router } from 'express';
import { Auth } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly authService = inject(Auth);
  private readonly router = inject(Router);

  isMenuCollapsed = false;
  isUserMenuOpen = false;

  logout(): void {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.router.navigateByUrl('/');
  }
}
