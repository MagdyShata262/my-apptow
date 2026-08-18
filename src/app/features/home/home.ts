// src/app/features/home/home.component.ts
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router'; // ✅ استيراد RouterLink لضمان عمل أزرار التنقل
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // ✅ إضافة RouterLink هنا
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ أداء عالي مع Signals
})
export class Home {
  protected readonly authService = inject(Auth);
}
