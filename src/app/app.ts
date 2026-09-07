import {
  Component,
  signal,
  ViewChild,
  ViewContainerRef,
  outputBinding,
  ComponentRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Login } from './features/auth/login/login'; // 👈 استيراد مكون تسجيل الدخول

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('my-apptow');

  // 🔍 الوصول إلى مكان رسم المكون الديناميكي
  @ViewChild('modalHost', { read: ViewContainerRef })
  private modalHost!: ViewContainerRef;

  private modalRef?: ComponentRef<Login>;

  // 🚀 دالة فتح النافذة برمجياً مع الربط التصريحي
  openLoginModal(): void {
    // 1. تنظيف المكان
    this.modalHost?.clear();

    // 2. إنشاء المكون مع ربط الأحداث (Declarative Bindings)
    this.modalRef = this.modalHost?.createComponent(Login, {
      bindings: [
        // 📤 ربط حدث الإغلاق
        outputBinding('close', () => {
          this.closeLoginModal();
        }),

        // 📤 ربط حدث نجاح الدخول
        outputBinding('loginSuccess', () => {
          console.log('تم تسجيل الدخول بنجاح! 🔑');
          this.closeLoginModal();
        }),
      ],
    });
  }

  // 🧹 دالة إغلاق وتدمير المكون
  closeLoginModal(): void {
    if (this.modalRef) {
      this.modalRef.destroy();
      this.modalRef = undefined;
    }
  }
}
