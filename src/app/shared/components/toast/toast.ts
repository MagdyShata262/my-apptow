import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition =
  'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';

@Component({
  selector: 'app-toast',
  template: `
    <div
      class="toast-box"
      [class]="'toast-box toast-box--' + type()"
      [attr.role]="type() === 'error' ? 'alert' : 'status'"
      [attr.aria-live]="type() === 'error' ? 'assertive' : 'polite'"
      aria-atomic="true"
    >
      <span class="toast-icon" aria-hidden="true">{{ icon() }}</span>
      <span class="toast-message">{{ message() }}</span>
      <button type="button" aria-label="إغلاق الرسالة" (click)="closed.emit()">
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  `,
  styles: `
    .toast-box {
      display: flex;
      align-items: center;
      gap: 12px;
      width: min(420px, calc(100vw - 32px));
      padding: 14px 16px;
      color: #fff;
      background: #343a40;
      border-radius: 8px;
      box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
    }

    .toast-box--success {
      background: #198754;
    }

    .toast-box--error {
      background: #dc3545;
    }

    .toast-box--warning {
      color: #212529;
      background: #ffc107;
    }

    .toast-box--info {
      background: #0d6efd;
    }

    .toast-icon {
      flex: 0 0 auto;
      font-size: 1.25rem;
    }

    .toast-message {
      flex: 1;
      overflow-wrap: anywhere;
    }

    button {
      flex: 0 0 auto;
      padding: 0;
      color: inherit;
      font-size: 1.1rem;
      line-height: 1;
      background: transparent;
      border: 0;
      cursor: pointer;
    }

    button:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly message = input.required<string>();
  readonly type = input<ToastType>('info');
  readonly closed = output<void>();

  icon(): string {
    return {
      success: '✓',
      error: '⚠',
      warning: '⚠',
      info: 'ⓘ',
    }[this.type()];
  }
}
